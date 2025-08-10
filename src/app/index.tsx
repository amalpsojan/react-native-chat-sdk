import { ChatSDK } from "@/components"; // re-export of src/components/chat-sdk
import { Message, MessageType } from "@/components/chat-sdk/types";
import React, { useState } from "react";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";

function ChatScreen() {
  const insets = useSafeAreaInsets();
  const currentUserId = "user-1";

  const initial: Message[] = [
    // Text (received)
    {
      id: "m-text-1",
      from: "user-2",
      isReceived: true,
      type: MessageType.TEXT,
      content: { text: "Hey! 👋" },
      createdAt: Date.now() - 60_000,
      status: "delivered",
    },
    // Text (own)
    {
      id: "m-text-2",
      from: currentUserId,
      isReceived: false,
      type: MessageType.TEXT,
      content: { text: "Hi there!" },
      createdAt: Date.now() - 50_000,
      status: "read",
    },
    // Image
    {
      id: "m-img",
      from: "user-2",
      isReceived: true,
      type: MessageType.IMAGE,
      content: {
        image: "https://sample-videos.com/img/Sample-jpg-image-1mb.jpg",
        caption: "A sample JPG image",
      },
      createdAt: Date.now() - 45_000,
      status: "sent",
    },
    // Video
    {
      id: "m-vid",
      from: "user-2",
      isReceived: true,
      type: MessageType.VIDEO,
      content: {
        video: "https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4",
        caption: "Sample MP4 video",
      },
      createdAt: Date.now() - 40_000,
      status: "delivered",
    },
    // Audio (voice note)
    {
      id: "m-aud",
      from: currentUserId,
      isReceived: false,
      type: MessageType.AUDIO,
      content: {
        audio: "https://sample-videos.com/audio/mp3/crowd-cheering.mp3",
        voice: true,
      },
      createdAt: Date.now() - 35_000,
      status: "read",
    },
    // Document
    {
      id: "m-doc",
      from: "user-2",
      isReceived: true,
      type: MessageType.DOCUMENT,
      content: {
        document: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        fileName: "dummy.pdf",
        caption: "Sample PDF document",
      },
      createdAt: Date.now() - 30_000,
      status: "sent",
    },
    // Sticker
    {
      id: "m-sticker",
      from: currentUserId,
      isReceived: false,
      type: MessageType.STICKER,
      content: {
        sticker: "https://raw.githubusercontent.com/expo/expo/main/.github/resources/banner.png",
      },
      createdAt: Date.now() - 25_000,
      status: "delivered",
    },
    // System (info)
    {
      id: "m-sys",
      from: "system",
      isReceived: true,
      type: MessageType.SYSTEM,
      content: { system: { type: "info", text: "This is an informational system message." } },
      createdAt: Date.now() - 20_000,
      status: "sent",
    },
    // Reply example (text replying to the image above)
    {
      id: "m-reply",
      from: currentUserId,
      isReceived: false,
      type: MessageType.TEXT,
      content: { text: "Looks good to me." },
      referenceMessage: {
        referenceMessageId: "m-img",
        type: MessageType.IMAGE,
        content: {
          image: "https://sample-videos.com/img/Sample-jpg-image-1mb.jpg",
          caption: "A sample JPG image",
        },
      },
      createdAt: Date.now() - 10_000,
      status: "sent",
    },
  ];

  const [messages, setMessages] = useState<Message[]>(initial);

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
    setMessages(prev => [newMsg, ...prev]);
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