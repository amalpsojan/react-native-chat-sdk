import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { TextContent } from './types';

interface MessageTextProps {
  content: TextContent;
}

/**
 * MessageText - Renders text content inside a message bubble
 * 
 * Handles styling and formatting of text messages
 */
const MessageText = ({ content }: MessageTextProps) => {
  return (
    <Text style={styles.messageText}>{content.text}</Text>
  );
};

const styles = StyleSheet.create({
  messageText: { 
    fontSize: 16 
  },
});

export default MessageText; 