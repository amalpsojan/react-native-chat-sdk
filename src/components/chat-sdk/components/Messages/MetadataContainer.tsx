import React from 'react';
import { Text, View ,StyleSheet} from 'react-native';
import { Message as TMessage } from '../../types';
import MessageStatus from './MessageStatus';
import Time from './Time';

interface MetadataContainerProps {
  isEdited: boolean;
  createdAt: number;
  isReceived: boolean;
  status?: TMessage['status'];
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

const styles = StyleSheet.create({
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

export default MetadataContainer; 