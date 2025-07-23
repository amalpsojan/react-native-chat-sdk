import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AudioContent } from '../../../types/types';

const MessageAudio = ({ content }: { content: AudioContent }) => (
  <View style={styles.container}>
    <View style={styles.audioPlaceholder} />
    <Text style={styles.caption}>{content.voice ? 'Voice Message' : 'Audio Message'}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center' },
  audioPlaceholder: { width: 180, height: 40, backgroundColor: '#eee', borderRadius: 20, marginBottom: 4 },
  caption: { fontSize: 12, color: '#555', textAlign: 'center' },
});

export default MessageAudio; 