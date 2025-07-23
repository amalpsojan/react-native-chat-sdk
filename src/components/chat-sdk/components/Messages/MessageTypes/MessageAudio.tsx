import { useAudioPlayer } from 'expo-audio';
import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { AudioContent } from '../../../types/types';

const MessageAudio = ({ content }: { content: AudioContent }) => {
  const player = useAudioPlayer(content.audio);

  return (
    <View style={styles.container}>
      <Button
        title={player.playing ? 'Pause' : 'Play'}
        onPress={() => (player.playing ? player.pause() : player.play())}
      />
      <Text style={styles.caption}>{content.voice ? 'Voice Message' : 'Audio Message'}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center' },
  caption: { fontSize: 12, color: '#555', textAlign: 'center', marginTop: 4 },
});

export default MessageAudio; 