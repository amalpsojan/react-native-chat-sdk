import { ChatSDK } from "@/components";
import { Message, MessageType, TextContent } from "@/components/chat-sdk/types";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Chat() {
  const currentUserId = "user-1";
  // Generate 100 sample messages
  const generateMessages = () => {
    const result: Message[] = [];
    // Base timestamp - 2 hours ago
    const baseTime = Date.now() - (2 * 60 * 60 * 1000);
    
    for (let i = 1; i <= 100; i++) {
      const isFromMe = i % 2 === 0;
      // Add messages with increasing timestamps (1 minute apart)
      const createdAt = baseTime + (i * 60 * 1000);
      
      // Determine status for outgoing messages
      let status: Message['status'] = 'sent';
      if (isFromMe) {
        if (i > 90) status = 'sent';
        else if (i > 80) status = 'delivered';
        else if (i > 70) status = 'read';
        else if (i === 50) status = 'failed';
      }
      
      // Add editedAt for some messages
      let editedAt: number | undefined = undefined;
      if ((i % 10 === 0) && i > 20) {
        // Message was edited 5 minutes after creation
        editedAt = createdAt + (5 * 60 * 1000);
      }
      
      result.push({
        id: `msg-${i}`,
        from: isFromMe ? "user-1" : "user-2",
        isReceived: !isFromMe,
        type: MessageType.TEXT,
        content: {
          text: isFromMe 
            ? `Message from me #${i}: This is a sample message to test performance.${editedAt ? ' (This was edited)' : ''}` 
            : `Reply from user #${i}: Thanks for your message!${editedAt ? ' (This was edited)' : ''}`
        } as TextContent,
        createdAt: createdAt,
        editedAt: editedAt,
        status: status,
      });
    }
    return result;
  };

  const [messages, setMessages] = useState<Message[]>(generateMessages());

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