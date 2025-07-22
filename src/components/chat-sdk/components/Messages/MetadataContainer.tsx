import React from 'react';
import { Text, View } from 'react-native';
import MessageStatus from './MessageStatus';
import styles from './metadataContainerStyles';
import Time from './Time';

interface MetadataContainerProps {
  isEdited: boolean;
  createdAt: number;
  isReceived: boolean;
  status?: string;
}

const MetadataContainer: React.FC<MetadataContainerProps> = ({
  isEdited,
  createdAt,
  isReceived,
  status,
}) => (
  <View style={styles.metadataContainer}>
    {isEdited && <Text style={styles.editedText}>(edited)</Text>}
    <Time timestamp={createdAt} style={styles.timeText} />
    {!isReceived && <MessageStatus status={status} style={styles.statusText} />}
  </View>
);

export default MetadataContainer; 