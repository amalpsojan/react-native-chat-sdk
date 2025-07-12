import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Message } from './types';

interface MessageBubbleProps {
  message: Message;
  isMe: boolean;
}

/**
 * MessageBubble - Renders a single chat message bubble
 * 
 * Handles different message types and styles them according to sender
 */
const MessageBubble = memo(({ message, isMe }: MessageBubbleProps) => {
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

const styles = StyleSheet.create({
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
  messageText: { 
    fontSize: 16 
  },
});

export default MessageBubble; 