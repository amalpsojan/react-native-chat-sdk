import React, { useCallback } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import MessageBubble from './MessageBubble';
import { Message } from './types';

interface MessagesListProps {
  messages: Message[];
  currentUserId: string;
  onLoadEarlier?: () => void;
}

/**
 * MessagesList - Renders the scrollable list of chat messages
 * 
 * Handles message rendering, scrolling, and loading earlier messages
 */
const MessagesList = React.forwardRef<FlatList, MessagesListProps>(
  ({ messages, currentUserId, onLoadEarlier }, ref) => {
    // Prepare messages - newest at the bottom
    const reversedMessages = [...messages].reverse();

    const renderItem = useCallback(
      ({ item }: { item: Message }) => {
        return <MessageBubble message={item} />;
      },
      [currentUserId]
    );

    const keyExtractor = useCallback((item: Message) => item.id, []);

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
        data={reversedMessages}
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