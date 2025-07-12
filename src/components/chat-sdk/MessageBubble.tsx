import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
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
  // Format time to display
  const formatTime = () => {
    const date = new Date(message.createdAt);
    return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  // Get status icon based on message status
  const getStatusText = () => {
    switch (message.status) {
      case 'sent':
        return '✓';
      case 'delivered':
        return '✓✓';
      case 'read':
        return '✓✓ '; // Blue checkmarks would be better but using space for now
      case 'failed':
        return '!';
      case 'sending':
        return '⋯';
      default:
        return '';
    }
  };

  // Check if message has been edited
  const isEdited = message.editedAt && message.editedAt > message.createdAt;

  return (
    <View style={styles.messageRow}>
      <View 
        style={[
          styles.bubble, 
          message.isReceived ? styles.bubbleLeft : styles.bubbleRight
        ]}
      >
        <Message message={message} />
        
        <View style={styles.metadataContainer}>
          {isEdited && <Text style={styles.editedText}>(edited)</Text>}
          <Text style={styles.timeText}>{formatTime()}</Text>
          {!message.isReceived && (
            <Text style={styles.statusText}>{getStatusText()}</Text>
          )}
        </View>
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
  metadataContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 2,
  },
  timeText: {
    fontSize: 11,
    color: '#999',
    marginRight: 4,
  },
  statusText: {
    fontSize: 11,
    color: '#999',
  },
  editedText: {
    fontSize: 11,
    color: '#999',
    fontStyle: 'italic',
    marginRight: 4,
  },
});

export default MessageBubble; 