import React, { useCallback, useState } from "react";
import { Keyboard, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useReanimatedKeyboardAnimation } from "react-native-keyboard-controller";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { Message, MessageType, TextContent } from "../../types";
import ReplyPreview from "./ReplyPreview";

interface InputToolbarProps {
  onSendMessage: (message: Partial<Message>) => void;
  onScrollToBottom?: () => void;
  replyTo?: Message | null;
  onCancelReply?: () => void;
}

/**
 * InputToolbar - Message input and send button
 * 
 * Handles text input, attachments, and sending messages
 */
const InputToolbar: React.FC<InputToolbarProps> = ({
  onSendMessage,
  onScrollToBottom,
  replyTo,
  onCancelReply,
}) => {
  const [draft, setDraft] = useState("");
  const inputRef = React.useRef<TextInput>(null);
  const { height } = useReanimatedKeyboardAnimation();

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: height.value + (height.value > 0 ? 0 : 30) }],
    };
  });

  const handleSend = useCallback(() => {
    const trimmed = draft.trim();
    if (!trimmed) return;

    onSendMessage({ 
      type: MessageType.TEXT, 
      content: { text: trimmed } as TextContent,
      referenceMessage: replyTo
        ? {
            referenceMessageId: replyTo.id,
            type: replyTo.type,
            content: (replyTo as any).content as any, 
          }
        : undefined,
    });
    setDraft("");
    if (onCancelReply) onCancelReply();
    
    // Dismiss keyboard
    Keyboard.dismiss();

    // Scroll to bottom after sending
    if (onScrollToBottom) {
      setTimeout(onScrollToBottom, 50);
    }
  }, [draft, onSendMessage, onScrollToBottom, onCancelReply, replyTo]);

  return (
    <Animated.View
      style={[
        styles.container,
        animatedStyle,
      ]}
    >
      {!!replyTo && (
        <ReplyPreview message={replyTo} onCancel={onCancelReply || (() => {})} />
      )}
      <View style={styles.inputBar}>
        <TextInput
          ref={inputRef}
          style={[styles.input]}
          value={draft}
          onChangeText={setDraft}
          placeholder="Message..."
          placeholderTextColor="#888"
          multiline={true}
          returnKeyType="default"
        />
        <Pressable 
          style={styles.sendButton} 
          onPress={handleSend}
          disabled={!draft.trim()}
        >
          <Text
            style={[
              styles.sendButtonText,
              !draft.trim() && styles.sendButtonDisabled,
            ]}
          >
            Send
          </Text>
        </Pressable>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#fff",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: "#ccc",
  },
  inputBar: {
    flexDirection: "row",
    padding: 10,
    paddingBottom: 14, // Extra padding at the bottom for more space
    alignItems: "center",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    padding: 10,
    paddingTop: 10,
    fontSize: 16,
    backgroundColor: "#f8f8f8",
    borderRadius: 18,
    minHeight: 40,
    maxHeight: 100
  },
  sendButton: {
    marginLeft: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#007AFF",
    borderRadius: 18,
    alignSelf: "flex-end",
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});

export default InputToolbar;
