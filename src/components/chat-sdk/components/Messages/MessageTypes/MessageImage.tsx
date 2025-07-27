import React, { useState } from "react";
import {
  Dimensions,
  Image,
  Modal,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { ImageContent } from "../../../types/types";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const MessageImage = ({ content }: { content: ImageContent }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [imageLayout, setImageLayout] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  // Animation values
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0);

  const openFullscreen = (event) => {
    // Get the image position for smooth transition
    event.target.measure((x, y, width, height, pageX, pageY) => {
      setImageLayout({ x: pageX, y: pageY, width, height });

      // Calculate the center offset
      const centerX = screenWidth / 2 - pageX - width / 2;
      const centerY = screenHeight / 2 - pageY - height / 2;

      setIsFullscreen(true);

      // Start animation
      opacity.value = withTiming(1, { duration: 300 });
      translateX.value = withSpring(centerX, { damping: 20, stiffness: 100 });
      translateY.value = withSpring(centerY, { damping: 20, stiffness: 100 });
      scale.value = withSpring(
        Math.min(screenWidth / width, screenHeight / height) * 0.9,
        { damping: 20, stiffness: 100 }
      );
    });
  };

  const closeFullscreen = () => {
    // Animate back to original position
    scale.value = withSpring(1, { damping: 20, stiffness: 100 });
    translateX.value = withSpring(0, { damping: 20, stiffness: 100 });
    translateY.value = withSpring(0, { damping: 20, stiffness: 100 });
    opacity.value = withTiming(0, { duration: 300 }, () => {
      runOnJS(setIsFullscreen)(false);
    });
  };

  // Pinch gesture for zoom
  const pinchGesture = Gesture.Pinch()
    .onUpdate((event) => {
      scale.value = Math.max(0.5, Math.min(event.scale, 3));
    })
    .onEnd(() => {
      if (scale.value < 1) {
        runOnJS(closeFullscreen)();
      } else if (scale.value > 2) {
        scale.value = withSpring(2);
      }
    });

  // Pan gesture for dragging
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    })
    .onEnd((event) => {
      // Snap back to center or close if dragged far enough
      const distance = Math.sqrt(
        event.translationX ** 2 + event.translationY ** 2
      );
      if (distance > 100) {
        runOnJS(closeFullscreen)();
      } else {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    });

  const composedGesture = Gesture.Simultaneous(pinchGesture, panGesture);

  // Animated styles
  const animatedImageStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  const backgroundStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* Preview Image in Chat */}
      <TouchableOpacity
        onPress={openFullscreen}
        activeOpacity={0.9}
      >
        <Image
          source={{ uri: content.image }}
          style={[
            styles.previewImage,
          ]}
          resizeMode="cover"
        />
      </TouchableOpacity>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <Modal
          visible={isFullscreen}
          transparent={true}
          animationType="none" // We handle all animations ourselves
          onRequestClose={closeFullscreen}
        >
          <View style={styles.modalContainer}>
            <StatusBar hidden />

            {/* Dark Background */}
            <Animated.View style={[styles.modalBackground, backgroundStyle]}>
              <TouchableOpacity
                style={StyleSheet.absoluteFillObject}
                onPress={closeFullscreen}
                activeOpacity={1}
              />
            </Animated.View>

            {/* Animated Image */}
            <View
              style={[
                styles.imageContainer,
                {
                  left: imageLayout.x,
                  top: imageLayout.y,
                  width: imageLayout.width,
                  height: imageLayout.height,
                },
              ]}
            >
              <GestureDetector gesture={composedGesture}>
                <Animated.View style={animatedImageStyle}>
                  <Image
                    source={{ uri: content.image }}
                    style={[
                      styles.animatedImage,
                      { width: imageLayout.width, height: imageLayout.height },
                    ]}
                    resizeMode="cover"
                  />
                </Animated.View>
              </GestureDetector>
            </View>
          </View>
        </Modal>
      )}
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  previewImage: {
    width: 200,
    height: 200,
    borderRadius: 8,
    marginBottom: 4,
  },
  modalContainer: {
    flex: 1,
  },
  modalBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
  },
  imageContainer: {
    position: "absolute",
  },
  animatedImage: {
    borderRadius: 8,
  },
});

export default MessageImage;
