import { ChatSDK } from "@/components";
import { Message, MessageType } from "@/components/chat-sdk/types";
import { useMessageRepository } from "@/data/dal/useMessageRepository";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Chat() {
  const insets = useSafeAreaInsets();
  const currentUserId = "user-1";
  const roomId = "room-123";

  const [messages, setMessages] = useState<Message[]>([]);

  const repo = useMessageRepository(roomId);

  useEffect(() => {
    const unsub = repo.subscribe(roomId, (msgs) => {
      // eslint-disable-next-line no-console
      console.log(`[ui] received ${msgs.length} messages`);
      setMessages(msgs.map((m) => ({ ...m, isReceived: m.from !== currentUserId })));
    });

    return () => {
      unsub();
    };
  }, [repo, roomId, currentUserId]);

  const handleSend = async (partial: Partial<Message>) => {
    const now = Date.now();
    const newMsg: Message = {
      id: now.toString(),
      from: currentUserId,
      isReceived: false,
      type: partial.type || MessageType.TEXT,
      content: partial.content || { text: "" },
      createdAt: now,
      status: "sent",
      referenceMessage: partial.referenceMessage,
    } as Message;

    await repo.addMessage(roomId, newMsg);
  };

  return (
    <View style={{ flex: 1, marginBottom: insets.bottom }}>
      <ChatSDK messages={messages} currentUserId={currentUserId} onSendMessage={handleSend} />
    </View>
  );
}