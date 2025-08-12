import { ChatSDK } from "@/components";
import type { Message } from "@/components/chat-sdk/types";
import { useChatBackend } from "@/sdk/chat-sdk-backend";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { ActivityIndicator, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ChatScreen() {
  const insets = useSafeAreaInsets();
  const { roomId } = useLocalSearchParams<{ roomId?: string }>();

  const { messages, currentUserId, sendText, isReady } = useChatBackend({
    roomId: (roomId as string) || "",
    historyLimit: 50,
  });

  const handleSend = async (message: Partial<Message>) => {
    const text = (message as any)?.content?.text || (message as any)?.text || "";
    if (!text) return;
    await sendText(text);
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


