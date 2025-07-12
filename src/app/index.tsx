import { ChatSDK } from "@/components";
import { Message } from "@/components/chat-sdk/types";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Chat() {
  const currentUserId = "user-1";
  // Generate 100 sample messages
  const generateMessages = () => {
    const result: Message[] = [];
    for (let i = 1; i <= 100; i++) {
      const isFromMe = i % 2 === 0;
      result.push({
        id: `msg-${i}`,
        from: isFromMe ? "user-1" : "user-2",
        isReceived: !isFromMe,
        type: "text",
        content: isFromMe 
          ? `Message from me #${i}: This is a sample message to test performance.` 
          : `Reply from user #${i}: Thanks for your message!`,
        status: "sent",
      });
    }
    return result;
  };

  const [messages, setMessages] = useState<Message[]>(generateMessages());

  const handleSend = (partial: Partial<Message>) => {
    const newMsg: Message = {
      id: Date.now().toString(),
      from: currentUserId,
      isReceived: false,
      type: partial.type || "text",
      content: partial.content ?? "",
      status: "sent",
    };
    // Add new message at the end (FlatList will reverse it with inverted prop)
    setMessages((prev) => [...prev, newMsg]);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ChatSDK
        messages={messages}
        currentUserId={currentUserId}
        onSendMessage={handleSend}
      />
    </SafeAreaView>
  );
}