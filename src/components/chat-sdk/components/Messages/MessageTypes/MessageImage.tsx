import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import { Dimensions, Image, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SharedElement } from 'react-native-shared-element';
import { ImageContent } from '../../../types/types';

const IMAGE_ID_PREFIX = 'chat-image-';

const MessageImage = ({ content }: { content: ImageContent }) => {
  const insets = useSafeAreaInsets();
  const [modalVisible, setModalVisible] = useState(false);
  // Refs for shared element
  const startAncestorRef = useRef<View>(null);
  const startNodeRef = useRef<any>(null);
  const endAncestorRef = useRef<View>(null);
  const endNodeRef = useRef<any>(null);

  // These will be used by the overlay (to be implemented at a higher level)
  // For now, just demonstrate the correct usage of refs and onNode

  const sharedId = IMAGE_ID_PREFIX + content.image;

  return (
    <View style={styles.container}>
      <View ref={ref => {
        startAncestorRef.current = ref;
      }}>
        <Pressable onPress={() => setModalVisible(true)}>
          <SharedElement id={sharedId} onNode={node => { startNodeRef.current = node; }}>
            <Image source={{ uri: content.image }} style={styles.image} resizeMode="cover" />
          </SharedElement>
        </Pressable>
      </View>
      {content.caption ? <Text style={styles.caption}>{content.caption}</Text> : null}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={[styles.modalBackground]} ref={ref => { endAncestorRef.current = ref; }}>
          {/* Close Button */}
          <Pressable
            style={[styles.closeButton]}
            onPress={() => setModalVisible(false)}
            hitSlop={10}
          >
            <MaterialCommunityIcons name="close" size={28} color="#fff" />
          </Pressable>
          <Pressable style={styles.modalBackground} onPress={() => setModalVisible(false)}>
            <SharedElement id={sharedId} onNode={node => { endNodeRef.current = node; }} style={styles.modalImageWrapper}>
              <Image
                source={{ uri: content.image }}
                resizeMode="contain"
                style={{
                  width: Dimensions.get('window').width * 0.95,
                  height: Dimensions.get('window').height * 0.7 - (insets.top + insets.bottom),
                  borderRadius: 12,
                }}
              />
            </SharedElement>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center' },
  image: { width: 200, height: 200, borderRadius: 8, marginBottom: 4 },
  caption: { fontSize: 12, color: '#555', textAlign: 'center' },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImageWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  modalImage: {
    borderRadius: 12,
  },
  closeButton: {
    position: 'absolute',
    top: 32,
    right: 24,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 20,
    padding: 4,
  },
});

export default MessageImage; 