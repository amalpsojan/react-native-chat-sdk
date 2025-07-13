import React, { useCallback, useMemo } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import DateSeparator from '../DateSeparator';
import MessageBubble from './MessageBubble';
import { Message } from '../../types';

interface MessagesListProps {
  messages: Message[];
  currentUserId: string;
  onLoadEarlier?: () => void;
}

// Helper to check if two dates are the same day
const isSameDay = (date1: Date, date2: Date) => {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
};

// Item types for our FlatList
type ListItem = {
  id: string;
  type: 'message' | 'separator';
  timestamp: number;
  message?: Message;
};

/**
 * MessagesList - Renders the scrollable list of chat messages
 * 
 * Handles message rendering, scrolling, and loading earlier messages
 */
const MessagesList = React.forwardRef<FlatList, MessagesListProps>(
  ({ messages, currentUserId, onLoadEarlier }, ref) => {
    // Process messages to include date separators
    const processedItems = useMemo(() => {
      const items: ListItem[] = [];
      let lastDate: Date | null = null;
      
      // Messages are in chronological order (oldest first)
      // We need to iterate in reverse to match the inverted FlatList
      [...messages].reverse().forEach(message => {
        const messageDate = new Date(message.createdAt);
        
        // Add date separator if this is a new day
        if (!lastDate || !isSameDay(lastDate, messageDate)) {
          items.push({
            id: `separator-${message.createdAt}`,
            type: 'separator',
            timestamp: message.createdAt,
          });
          lastDate = messageDate;
        }
        
        // Add the message
        items.push({
          id: message.id,
          type: 'message',
          timestamp: message.createdAt,
          message,
        });
      });
      
      return items;
    }, [messages]);

    const renderItem = useCallback(
      ({ item }: { item: ListItem }) => {
        if (item.type === 'separator') {
          return <DateSeparator timestamp={item.timestamp} />;
        } else if (item.message) {
          return <MessageBubble message={item.message} />;
        }
        return null;
      },
      [currentUserId]
    );

    const keyExtractor = useCallback((item: ListItem) => item.id, []);

    const handleEndReached = useCallback(() => {
      if (onLoadEarlier) {
        onLoadEarlier();
      }
    }, [onLoadEarlier]);

    if (messages.length === 0) {
      return (
        <View style={styles.emptyList}>
          <Text>No messages yet</Text>
        </View>
      );
    }

    return (
      <FlatList
        ref={ref}
        data={processedItems}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        inverted={true}
        removeClippedSubviews={true}
        windowSize={10}
        maxToRenderPerBatch={20}
        initialNumToRender={20}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.2}
        ListFooterComponent={() => <View style={{ height: 20 }} />}
      />
    );
  }
);

const styles = StyleSheet.create({
  listContent: { 
    padding: 12 
  },
  emptyList: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MessagesList; 