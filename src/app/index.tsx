import { ChatSDK } from "@/components";
import { Message, MessageType } from "@/components/chat-sdk/types";
import React, { useState } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { messages as dummyMessages } from "../../dummy";

export default function Chat() {
  const insets = useSafeAreaInsets();
  const currentUserId = "user-1";

  const [messages, setMessages] = useState<Message[]>(dummyMessages);

  const handleSend = (partial: Partial<Message>) => {
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
    setMessages((prev) => [newMsg, ...prev]);
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