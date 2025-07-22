import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Message as TMessage } from '../../types';
import Message from './Message';
import MetadataContainer from './MetadataContainer';

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
  // Check if message has been edited
  const isEdited = message.editedAt && message.editedAt > message.createdAt;

  // Determine if this message should be grouped with adjacent messages
  const isFirstInGroup = !prevMessage || prevMessage.isReceived !== message.isReceived;
  const isLastInGroup = !nextMessage || nextMessage.isReceived !== message.isReceived;

  // Calculate bubble styles based on grouping
  let bubbleGroupStyle;
  if (message.isReceived) {
    if (isFirstInGroup && isLastInGroup) {
      bubbleGroupStyle = styles.bubbleLeftSingle;
    } else if (isFirstInGroup) {
      bubbleGroupStyle = styles.bubbleLeftFirst;
    } else if (isLastInGroup) {
      bubbleGroupStyle = styles.bubbleLeftLast;
    } else {
      bubbleGroupStyle = styles.bubbleLeftMiddle;
    }
  } else {
    if (isFirstInGroup && isLastInGroup) {
      bubbleGroupStyle = styles.bubbleRightSingle;
    } else if (isFirstInGroup) {
      bubbleGroupStyle = styles.bubbleRightFirst;
    } else if (isLastInGroup) {
      bubbleGroupStyle = styles.bubbleRightLast;
    } else {
      bubbleGroupStyle = styles.bubbleRightMiddle;
    }
  }

  const bubbleBaseStyle = message.isReceived ? styles.bubbleLeft : styles.bubbleRight;

  return (
    <View style={[
      styles.messageRow,
      isFirstInGroup ? styles.messageRowFirst : styles.messageRowGrouped,
    ]}>
      <View style={[
        styles.bubble,
        bubbleBaseStyle,
        bubbleGroupStyle,
      ]}>
        <Message message={message} />
        <MetadataContainer
          isEdited={!!isEdited}
          createdAt={typeof message.createdAt === 'number' ? message.createdAt : new Date(message.createdAt).getTime()}
          isReceived={!!message.isReceived}
          status={message.status}
        />
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
});

export default MessageBubble; 