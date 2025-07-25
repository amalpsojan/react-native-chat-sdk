import { FlashList } from '@shopify/flash-list';
import React, { useCallback, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import InputToolbar from './components/InputToolbar/InputToolbar';
import MessagesList from './components/Messages/MessagesList';
import { ChatWindowProps, Message } from './types';

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
  const listRef = useRef<FlashList<Message>>(null);

  const scrollToBottom = useCallback(() => {
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.messagesContainer}>
        <MessagesList
          ref={listRef}
          messages={messages}
          currentUserId={currentUserId}
          onLoadEarlier={onLoadEarlier}
        />
      </View>
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
  messagesContainer: {
    flex: 1,
  },
});

export default ChatWindow; 