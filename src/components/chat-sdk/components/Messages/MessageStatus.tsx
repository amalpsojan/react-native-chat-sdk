import React from 'react';
import { StyleProp, Text, TextStyle } from 'react-native';

interface MessageStatusProps {
  status?: 'pending' | 'sent' | 'delivered' | 'read' | 'failed';
  style?: StyleProp<TextStyle>;
}

const getStatusContent = (status?: string) => {
  switch (status) {
    case 'pending':
      return { icon: '🕒', color: undefined };
    case 'sent':
      return { icon: '✓', color: undefined };
    case 'delivered':
      return { icon: '✓✓', color: undefined };
    case 'read':
      return { icon: '✓✓', color: '#2196F3' };
    case 'failed':
      return { icon: '!', color: 'red' };
    default:
      return { icon: '', color: undefined };
  }
};

const MessageStatus: React.FC<MessageStatusProps> = ({ status, style }) => {
  const { icon, color } = getStatusContent(status);
  return <Text style={[style, color ? { color } : null]}>{icon}</Text>;
};

export default MessageStatus; 