import { ChatSDK } from "@/components";
import type { Message } from "@/components/chat-sdk/types";
import { usePocketBaseChat } from "@/hooks/usePocketBaseChat";
import { useAuthStore } from "@/state/auth";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ChatScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { roomId } = useLocalSearchParams<{ roomId?: string }>();
  const token = useAuthStore((s) => s.token);

  useEffect(() => {
    if (!token) router.replace('/login');
  }, [token, router]);

  const { messages, currentUserId, sendText } = usePocketBaseChat({
    baseUrl: "http://127.0.0.1:8090",
    token,
    roomId: (roomId as string) || "",
    historyLimit: 50,
  });

  const handleSend = async (message: Partial<Message>) => {
    const text = (message as any)?.content?.text || (message as any)?.text || "";
    if (!text) return;
    await sendText(text);
  };

  if (!roomId || !token) {
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


