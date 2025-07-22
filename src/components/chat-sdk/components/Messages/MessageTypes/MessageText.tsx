import React from 'react';
import { StyleSheet } from 'react-native';
import ParsedText from 'react-native-parsed-text';
import { TextContent } from '../../../types';

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
    <ParsedText
      style={styles.messageText}
      parse={[
        { type: 'url', style: styles.url, onPress: (url) => {/* handle url */} },
        { type: 'phone', style: styles.phone, onPress: (phone) => {/* handle phone */} },
        { type: 'email', style: styles.email, onPress: (email) => {/* handle email */} },
      ]}
      childrenProps={{ allowFontScaling: false }}
    >
      {content.text}
    </ParsedText>
  );
};

const styles = StyleSheet.create({
  messageText: { 
    fontSize: 16 
  },
  url: {
    color: '#0645AD',
    textDecorationLine: 'underline',
  },
  phone: {
    color: '#1B873F',
  },
  email: {
    color: '#D44638',
  },
});

export default MessageText; 