import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { VideoView, useVideoPlayer } from "expo-video";
import * as VideoThumbnails from "expo-video-thumbnails";
import React, { useEffect, useState } from "react";
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { VideoContent } from "../../../types/types";

interface InitialLayoutProps {
  content: VideoContent;
  onPress: (event: any) => void;
}

interface PopupLayoutProps {
  content: VideoContent;
  layout: { width: number; height: number };
  onClose: () => void;
}

// Component for the initial image layout (thumbnail in chat)
const InitialLayout: React.FC<InitialLayoutProps> = ({ content, onPress }) => {
  const [image, setImage] = useState<string | null>(null);

  const generateThumbnail = async () => {
    try {
      const { uri } = await VideoThumbnails.getThumbnailAsync(content.video, {
        time: 15000,
      });
      setImage(uri);
    } catch (e) {
      console.warn(e);
    }
  };

  useEffect(() => {
    generateThumbnail();
  }, []);

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
      {image ? (
        <ImageBackground
          source={{ uri: image }}
          style={styles.previewImage}
          resizeMode="cover"
        >
          {/* play icon */}
          <View style={styles.playIconContainer}>
            <MaterialCommunityIcons name="play" size={40} color="white" />
          </View>
        </ImageBackground>
      ) : (
        <View style={styles.previewImage} />
      )}
      {content.caption && (
        <Text style={styles.caption} numberOfLines={2}>
          {content.caption}
        </Text>
      )}
    </TouchableOpacity>
  );
};

// Component for the popup layout with gestures
const PopupLayout: React.FC<PopupLayoutProps> = ({
  content,
  layout,
  onClose,
}) => {
  const player = useVideoPlayer(content.video);
  return (
    <View style={styles.container}>
      <VideoView
        player={player}
        style={styles.video}
        nativeControls
        contentFit="contain"
      />
      {content.caption ? (
        <Text style={styles.caption}>{content.caption}</Text>
      ) : null}
    </View>
  );
};

const MessageVideo = ({ content }: { content: VideoContent }) => {};

const styles = StyleSheet.create({
  container: { alignItems: "center", justifyContent: "center" },
  video: { width: 200, height: 200, borderRadius: 8, marginBottom: 4 },
  caption: { fontSize: 12, color: "#555", textAlign: "center" },
  previewImage: {
    width: 200,
    height: 200,
    borderRadius: 8,
    marginBottom: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  playIconContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    borderRadius: 100,
    padding: 10,
  },
});

export default InitialLayout;
