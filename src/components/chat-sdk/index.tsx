import React, { memo, useCallback, useRef, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { ChatWindowProps, Message } from './types';

// Memoized message bubble component to prevent unnecessary re-renders
const MessageBubble = memo(({ message, isMe }: { message: Message, isMe: boolean }) => {
  let display = '';
  if (typeof message.content === 'string') {
    display = message.content;
  } else {
    display = '[Unsupported message type]';
  }

  return (
    <View style={styles.messageRow}>
      <View style={[styles.bubble, isMe ? styles.bubbleRight : styles.bubbleLeft]}>
        <Text style={styles.messageText}>{display}</Text>
      </View>
    </View>
  );
});

/**
 * Initial ChatWindow implementation
 * --------------------------------
 * Renders a basic message list and an input bar.
 * Only supports plain-text messages for now – other types will be added later.
 */
const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  currentUserId,
  onSendMessage,
  onRetryMessage,
}) => {
  const [draft, setDraft] = useState('');
  const flatListRef = useRef<FlatList>(null);
  
  // Prepare messages - newest at the bottom
  const reversedMessages = [...messages].reverse();

  const handleSend = useCallback(() => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    onSendMessage({ content: trimmed, type: 'text' });
    setDraft('');
    
    // Scroll to bottom after sending
    setTimeout(() => {
      flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    }, 50);
  }, [draft, onSendMessage]);

  const renderItem = useCallback(({ item }: { item: Message }) => {
    const isMe = item.from === currentUserId;
    return <MessageBubble message={item} isMe={isMe} />;
  }, [currentUserId]);

  const keyExtractor = useCallback((item: Message) => item.id, []);

  return (
    <View style={styles.container}>
      {messages.length > 0 ? (
        <FlatList
          ref={flatListRef}
          data={reversedMessages}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          inverted={true}
          removeClippedSubviews={true}
          windowSize={10}
          maxToRenderPerBatch={20}
          initialNumToRender={20}
          onEndReached={() => {
            // This would be where we load older messages
            console.log('Reached end of list');
          }}
          onEndReachedThreshold={0.2}
          ListFooterComponent={() => <View style={{ height: 20 }} />}
        />
      ) : (
        <View style={styles.emptyList}>
          <Text>No messages yet</Text>
        </View>
      )}

      <View style={styles.inputBar}>
        <TextInput
          style={styles.input}
          value={draft}
          onChangeText={setDraft}
          placeholder="Message..."
          placeholderTextColor="#888"
        />
        <Pressable style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendButtonText}>Send</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContent: { padding: 12 },
  emptyList: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageRow: {
    width: '100%',
    paddingHorizontal: 12,
    marginVertical: 2,
    flexDirection: 'row',
  },
  bubble: {
    maxWidth: '80%',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginVertical: 4,
  },
  bubbleLeft: {
    backgroundColor: '#EDEDED',
    alignSelf: 'flex-start',
  },
  bubbleRight: {
    backgroundColor: '#DCF8C6',
    alignSelf: 'flex-end',
    marginLeft: 'auto',
  },
  messageText: { fontSize: 16 },
  inputBar: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#ccc',
    padding: 8,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    padding: 8,
    fontSize: 16,
    backgroundColor: '#fff',
    borderRadius: 4,
  },
  sendButton: {
    marginLeft: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#007AFF',
    borderRadius: 4,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default ChatWindow; 