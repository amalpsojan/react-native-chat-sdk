import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Message as TMessage } from '../../types';
import Message from './Message';

interface MessageBubbleProps {
  message: TMessage;
  prevMessage?: TMessage | null;
  nextMessage?: TMessage | null;
}

/**
 * MessageBubble - Renders a message bubble with appropriate styling
 * 
 * Handles bubble styling based on sender (left/right alignment)
 * and groups consecutive messages from the same sender
 */
const MessageBubble = memo(({ message, prevMessage, nextMessage }: MessageBubbleProps) => {
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

  // Determine if this message should be grouped with adjacent messages
  const isFirstInGroup = !prevMessage || prevMessage.isReceived !== message.isReceived;
  const isLastInGroup = !nextMessage || nextMessage.isReceived !== message.isReceived;

  // Calculate bubble styles based on grouping
  const getBubbleStyles = () => {
    const baseStyles = [
      styles.bubble,
      message.isReceived ? styles.bubbleLeft : styles.bubbleRight
    ];

    // Apply grouping-specific styles
    if (message.isReceived) {
      // Left side (received messages)
      if (isFirstInGroup && isLastInGroup) {
        // Single message in group
        baseStyles.push(styles.bubbleLeftSingle);
      } else if (isFirstInGroup) {
        // First message in group
        baseStyles.push(styles.bubbleLeftFirst);
      } else if (isLastInGroup) {
        // Last message in group
        baseStyles.push(styles.bubbleLeftLast);
      } else {
        // Middle message in group
        baseStyles.push(styles.bubbleLeftMiddle);
      }
    } else {
      // Right side (sent messages)
      if (isFirstInGroup && isLastInGroup) {
        // Single message in group
        baseStyles.push(styles.bubbleRightSingle);
      } else if (isFirstInGroup) {
        // First message in group
        baseStyles.push(styles.bubbleRightFirst);
      } else if (isLastInGroup) {
        // Last message in group
        baseStyles.push(styles.bubbleRightLast);
      } else {
        // Middle message in group
        baseStyles.push(styles.bubbleRightMiddle);
      }
    }

    return baseStyles;
  };

  // Calculate row margin based on grouping
  const getRowStyles = () => {
    const baseStyles = [styles.messageRow];
    
    if (isFirstInGroup) {
      baseStyles.push(styles.messageRowFirst);
    } else {
      baseStyles.push(styles.messageRowGrouped);
    }

    return baseStyles;
  };

  return (
    <View style={getRowStyles()}>
      <View style={getBubbleStyles()}>
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
    flexDirection: 'row',
  },
  messageRowFirst: {
    marginTop: 8,
    marginBottom: 2,
  },
  messageRowGrouped: {
    marginTop: 1,
    marginBottom: 1,
  },
  bubble: {
    maxWidth: '80%',
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  // Left side (received messages) - different border radius for grouping
  bubbleLeft: {
    backgroundColor: '#EDEDED',
    alignSelf: 'flex-start',
  },
  bubbleLeftSingle: {
    borderRadius: 18,
  },
  bubbleLeftFirst: {
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 18,
  },
  bubbleLeftMiddle: {
    borderTopLeftRadius: 4,
    borderTopRightRadius: 18,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 18,
  },
  bubbleLeftLast: {
    borderTopLeftRadius: 4,
    borderTopRightRadius: 18,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
  },
  // Right side (sent messages) - different border radius for grouping
  bubbleRight: {
    backgroundColor: '#DCF8C6',
    alignSelf: 'flex-end',
    marginLeft: 'auto',
  },
  bubbleRightSingle: {
    borderRadius: 18,
  },
  bubbleRightFirst: {
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 4,
  },
  bubbleRightMiddle: {
    borderTopLeftRadius: 18,
    borderTopRightRadius: 4,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 4,
  },
  bubbleRightLast: {
    borderTopLeftRadius: 18,
    borderTopRightRadius: 4,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
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