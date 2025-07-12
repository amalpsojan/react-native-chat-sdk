import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import Message from './Message';
import { Message as TMessage } from './types';

interface MessageBubbleProps {
  message: TMessage;
}

/**
 * MessageBubble - Renders a message bubble with appropriate styling
 * 
 * Handles bubble styling based on sender (left/right alignment)
 */
const MessageBubble = memo(({ message }: MessageBubbleProps) => {
  return (
    <View style={styles.messageRow}>
      <View 
        style={[
          styles.bubble, 
          message.isReceived ? styles.bubbleLeft : styles.bubbleRight
        ]}
      >
        <Message message={message} />
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
});

export default MessageBubble; 