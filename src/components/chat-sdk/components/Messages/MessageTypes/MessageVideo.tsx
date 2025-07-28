import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { VideoView, useVideoPlayer } from "expo-video";
import * as VideoThumbnails from "expo-video-thumbnails";
import React, { Fragment, useEffect, useState } from "react";
import {
  Dimensions,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { VideoContent } from "../../../types/types";
import SharedPopup from "../../SharedPopup";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

interface InitialLayoutProps {
  content: VideoContent;
  onPress: (event: any) => void;
}

interface PopupLayoutProps {
  content: VideoContent;
  layout: { width: number; height: number };
  onClose: () => void;
}

// Component for the initial video layout (thumbnail in chat)
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
        <View style={styles.previewImage}>
          <View style={styles.playIconContainer}>
            <MaterialCommunityIcons name="play" size={40} color="white" />
          </View>
        </View>
      )}
      {content.caption && (
        <Text style={styles.caption} numberOfLines={2}>
          {content.caption}
        </Text>
      )}
    </TouchableOpacity>
  );
};

// Component for the popup layout
const PopupLayout: React.FC<PopupLayoutProps> = ({
  content,
  layout,
  onClose,
}) => {
  const player = useVideoPlayer(content.video);

  return (
    <Fragment>
      <VideoView
        player={player}
        style={[
          styles.fullscreenVideo,
          { width: layout.width, height: layout.height },
        ]}
        nativeControls
        contentFit="contain"
      />
    </Fragment>
  );
};

// Main MessageVideo component
const MessageVideo = ({ content }: { content: VideoContent }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [videoLayout, setVideoLayout] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  const openFullscreen = (event: any) => {
    // Get the video position for smooth transition
    event.target.measure(
      (
        x: number,
        y: number,
        width: number,
        height: number,
        pageX: number,
        pageY: number
      ) => {
        setVideoLayout({ x: pageX, y: pageY, width, height });
        setIsFullscreen(true);
      }
    );
  };

  const closeFullscreen = () => {
    setIsFullscreen(false);
  };

  const renderInitialLayout = () => (
    <InitialLayout content={content} onPress={openFullscreen} />
  );

  const renderPopupLayout = (layout: { width: number; height: number }) => (
    <PopupLayout content={content} layout={layout} onClose={closeFullscreen} />
  );

  return (
    <SharedPopup
      visible={isFullscreen}
      onClose={closeFullscreen}
      renderInitialLayout={renderInitialLayout}
      renderPopupLayout={renderPopupLayout}
      initialLayout={videoLayout}
      showCloseButton={true}
      animateToCenter={true}
    />
  );
};

const styles = StyleSheet.create({
  previewImage: {
    width: 200,
    height: 200,
    borderRadius: 8,
    marginBottom: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  fullscreenVideo: {
    borderRadius: 8,
  },
  caption: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
    marginBottom: 4,
    lineHeight: 18,
  },
  playIconContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    borderRadius: 100,
    padding: 10,
  },
});

export default MessageVideo;
