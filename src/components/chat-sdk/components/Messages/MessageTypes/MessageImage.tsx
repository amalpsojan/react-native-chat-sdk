import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { ImageContent } from '../../../types/types';

const MessageImage = ({ content }: { content: ImageContent }) => (
  <View style={styles.container}>
    <Image source={{ uri: content.image }} style={styles.image} />
    {content.caption ? <Text style={styles.caption}>{content.caption}</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center' },
  image: { width: 200, height: 200, borderRadius: 8, marginBottom: 4 },
  caption: { fontSize: 12, color: '#555', textAlign: 'center' },
});

export default MessageImage; 