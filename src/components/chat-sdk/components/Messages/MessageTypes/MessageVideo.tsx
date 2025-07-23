import { VideoView, useVideoPlayer } from 'expo-video';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { VideoContent } from '../../../types/types';

const MessageVideo = ({ content }: { content: VideoContent }) => {
  const player = useVideoPlayer(content.video);
  return (
    <View style={styles.container}>
      <VideoView
        player={player}
        style={styles.video}
        nativeControls
        contentFit="contain"
      />
      {content.caption ? <Text style={styles.caption}>{content.caption}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center' },
  video: { width: 200, height: 200, borderRadius: 8, marginBottom: 4 },
  caption: { fontSize: 12, color: '#555', textAlign: 'center' },
});

export default MessageVideo; 