import React from 'react';
import { StyleProp, Text, TextStyle } from 'react-native';

interface MessageStatusProps {
  status?: string;
  style?: StyleProp<TextStyle>;
}

const getStatusText = (status?: string) => {
  switch (status) {
    case 'sent':
      return '✓';
    case 'delivered':
      return '✓✓';
    case 'read':
      return '✓✓ ';
    case 'failed':
      return '!';
    case 'sending':
      return '⋯';
    default:
      return '';
  }
};

const MessageStatus: React.FC<MessageStatusProps> = ({ status, style }) => {
  return <Text style={style}>{getStatusText(status)}</Text>;
};

export default MessageStatus; 