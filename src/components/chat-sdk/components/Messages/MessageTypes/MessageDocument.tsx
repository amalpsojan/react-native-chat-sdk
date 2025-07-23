import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { DocumentContent } from '../../../types/types';

const MessageDocument = ({ content }: { content: DocumentContent }) => (
  <View style={styles.container}>
    <Text style={styles.fileName}>{content.fileName}</Text>
    {content.caption ? <Text style={styles.caption}>{content.caption}</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center' },
  fileName: { fontWeight: 'bold', fontSize: 14, color: '#333', marginBottom: 2 },
  caption: { fontSize: 12, color: '#555', textAlign: 'center' },
});

export default MessageDocument; 