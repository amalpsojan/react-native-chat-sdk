import { useChatBackend } from "@/sdk/chat-sdk-backend-client";
import { default as ChatSDK } from "@chat-sdk-ui/index";
import type { Message } from "@chat-sdk-ui/types";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { ActivityIndicator, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ChatScreen() {
  const insets = useSafeAreaInsets();
  const { roomId } = useLocalSearchParams<{ roomId?: string }>();

  const { messages, currentUserId, sendMessage, isReady } = useChatBackend({
    roomId: (roomId as string) || "",
    historyLimit: 50,
  });

  const handleSend = async (message: Partial<Message>) => {
    const type = (message as any)?.type || 'text';
    const content = (message as any)?.content || { text: (message as any)?.text || '' };
    if (type === 'text' && !content.text) return;
    await sendMessage({ type: type as any, content });
  };

  if (!roomId || !isReady) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingTop: insets.top }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, marginBottom: insets.bottom }}>
      <ChatSDK messages={messages} currentUserId={currentUserId} onSendMessage={handleSend} />
    </View>
  );
}


