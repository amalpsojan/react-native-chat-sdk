import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { MessageType, Message as TMessage } from '../../types';
import { MessageSystem, MessageText } from './MessageTypes';

interface MessageProps {
  message: TMessage;
}

/**
 * Message - Determines which message type component to render
 * 
 * Handles different message types and delegates to the appropriate component
 */
const Message = ({ message }: MessageProps) => {
  switch (message.type) {
    case MessageType.TEXT:
      return <MessageText content={message.content} />;
    case MessageType.SYSTEM:
      return <MessageSystem content={message.content} />;
    default:
      return <Text style={styles.messageText}>[Unsupported message type]</Text>;
  }
};

const styles = StyleSheet.create({
  messageText: { 
    fontSize: 16 
  },
});

export default Message;
