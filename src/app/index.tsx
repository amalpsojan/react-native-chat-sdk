import { ChatSDK } from "@/components";
import { Message, MessageType } from "@/components/chat-sdk/types";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { io, Socket } from "socket.io-client";
import { messages as dummyMessages } from "../../dummy";

export default function Chat() {
  const insets = useSafeAreaInsets();
  const currentUserId = "user-1";
  const roomId = "room-123";

  const [messages, setMessages] = useState<Message[]>(dummyMessages);
  const socketRef = useRef<Socket | null>(null);

  const SERVER_URL = useMemo(() => {
    // Replace with your LAN IP when testing on a real device
    // e.g., http://192.168.x.x:4000
    return "http://localhost:4000";
  }, []);

  useEffect(() => {
    const socket = io(SERVER_URL, { transports: ["websocket"], forceNew: true });
    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("join", { roomId, userId: currentUserId });
    });

    socket.on("message:new", (incoming: Message) => {
      const normalized: Message = {
        ...incoming,
        isReceived: incoming.from !== currentUserId,
      } as Message;
      setMessages((prev) => {
        if (prev.some((m) => m.id === normalized.id)) return prev;
        return [normalized, ...prev];
      });
    });

    return () => {
      socket.emit("leave", { roomId });
      socket.removeAllListeners();
      socket.disconnect();
    };
  }, [SERVER_URL, roomId, currentUserId]);

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

    // Optional optimistic update
    setMessages((prev) => [newMsg, ...prev]);

    // Emit to server
    socketRef.current?.emit("message:send", { roomId, message: newMsg });
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