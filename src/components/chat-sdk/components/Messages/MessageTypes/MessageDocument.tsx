import React from 'react';
import { Button, Linking, StyleSheet, Text, View } from 'react-native';
import { DocumentContent } from '../../../types/types';

const MessageDocument = ({ content }: { content: DocumentContent }) => (
  <View style={styles.container}>
    <Text style={styles.fileName}>{content.fileName}</Text>
    <Button title="Open Document" onPress={() => Linking.openURL(content.document)} />
    {content.caption ? <Text style={styles.caption}>{content.caption}</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center' },
  fileName: { fontWeight: 'bold', fontSize: 14, color: '#333', marginBottom: 2 },
  caption: { fontSize: 12, color: '#555', textAlign: 'center', marginTop: 4 },
});

export default MessageDocument; 