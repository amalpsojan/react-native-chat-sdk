import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { VideoContent } from '../../../types/types';

const MessageVideo = ({ content }: { content: VideoContent }) => (
  <View style={styles.container}>
    {/* Placeholder for video player */}
    <View style={styles.videoPlaceholder} />
    {content.caption ? <Text style={styles.caption}>{content.caption}</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center' },
  videoPlaceholder: { width: 200, height: 200, backgroundColor: '#ccc', borderRadius: 8, marginBottom: 4 },
  caption: { fontSize: 12, color: '#555', textAlign: 'center' },
});

export default MessageVideo; 