import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { MessageText } from './MessageTypes';
import { MessageType, Message as TMessage } from '../../types';

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
