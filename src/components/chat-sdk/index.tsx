import React, { useCallback, useRef } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import InputToolbar from './InputToolbar';
import MessagesList from './MessagesList';
import { ChatWindowProps } from './types';

/**
 * ChatWindow - Main chat UI component
 * 
 * Combines MessagesList and InputToolbar into a complete chat interface
 */
const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  currentUserId,
  onSendMessage,
  onLoadEarlier,
}) => {
  const listRef = useRef<FlatList>(null);

  const scrollToBottom = useCallback(() => {
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
  }, []);

  return (
    <View style={styles.container}>
      <MessagesList
        ref={listRef}
        messages={messages}
        currentUserId={currentUserId}
        onLoadEarlier={onLoadEarlier}
      />
      <InputToolbar
        onSendMessage={onSendMessage}
        onScrollToBottom={scrollToBottom}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
});

export default ChatWindow; 