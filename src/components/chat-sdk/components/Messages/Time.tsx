import React from 'react';
import { StyleProp, Text, TextStyle } from 'react-native';

interface TimeProps {
  timestamp: number;
  style?: StyleProp<TextStyle>;
}

const Time: React.FC<TimeProps> = ({ timestamp, style }) => {
  const date = new Date(timestamp);
  const formatted = `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
  return <Text style={style}>{formatted}</Text>;
};

export default Time; 