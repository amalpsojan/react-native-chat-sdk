import { ChatSDK } from "@/components"; // re-export of src/components/chat-sdk
import { Message, MessageType } from "@/components/chat-sdk/types";
import { insertMessage, subscribeMessages } from "@/server/pocketbase";
import { registerForPushNotificationsAsync } from "@/server/push";
import React, { useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

function ChatScreen() {
  const insets = useSafeAreaInsets();
  const currentUserId = "user-1";
  const conversationId = "demo-conv-1";
  const deviceId = useMemo(
    () => `dev-${Math.random().toString(36).slice(2, 10)}`,
    []
  );

  const initial: Message[] = [
    // Text (received)
    {
      id: "m-text-1",
      from: "user-2",
      isReceived: true,
      type: MessageType.TEXT,
      content: { text: "Hey! 👋" },
      //Today
      createdAt: Date.now(),
      status: "delivered",
    },
    {
      id: "m-text-2",
      from: "user-2",
      isReceived: true,
      type: MessageType.TEXT,
      content: { text: "Hello! 👋" },
      //Today
      createdAt: Date.now(),
      status: "delivered",
    },
    {
      id: "m-text-3",
      from: "user-2",
      isReceived: true,
      type: MessageType.TEXT,
      content: { text: "Yesterday" },
      //Yesterday
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).getTime(),
      status: "delivered",
    },
  ];

  const [messages, setMessages] = useState<Message[]>(initial);

  // Register push token once
  useEffect(() => {
    registerForPushNotificationsAsync(currentUserId, deviceId).catch(() => {});
  }, [currentUserId, deviceId]);

  // Realtime subscription
  useEffect(() => {
    let cleanup: (() => void) | undefined;
    (async () => {
      cleanup = await subscribeMessages(conversationId, (rec) => {
        const m: Message = {
          id: rec.id,
          from: rec.from_user,
          isReceived: rec.from_user !== currentUserId,
          type: rec.type as any as Message["type"],
          content: rec.content,
          createdAt: new Date(rec.created_at).getTime(),
          status: rec.status as any,
          referenceMessage: rec.reference_message,
        } as Message;
        setMessages((prev) => [m, ...prev]);
      });
    })();
    return () => {
      try {
        cleanup?.();
      } catch {}
    };
  }, [conversationId, currentUserId]);

  const handleSend = async (partial: Partial<Message>) => {
    const now = Date.now();
    // Optimistic UI
    const optimistic: Message = {
      id: `tmp-${now}`,
      from: currentUserId,
      isReceived: false,
      type: partial.type || MessageType.TEXT,
      content: partial.content || { text: "" },
      createdAt: now,
      status: "sent",
      referenceMessage: partial.referenceMessage,
    } as Message;
    setMessages((prev) => [optimistic, ...prev]);

    // Persist to PocketBase (fire-and-forget minimal)
    try {
      await insertMessage({
        conversation_id: conversationId,
        from_user: currentUserId,
        type: optimistic.type,
        content: optimistic.content,
        reference_message: optimistic.referenceMessage,
        status: optimistic.status,
      } as any);
    } catch {}
  };

  return (
    <View style={{ flex: 1, marginBottom: insets.bottom }}>
      <ChatSDK
        messages={messages}
        currentUserId={currentUserId}
        onSendMessage={handleSend}
      />
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ChatScreen />
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
