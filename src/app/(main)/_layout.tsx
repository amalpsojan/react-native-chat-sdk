import React from "react";
import { PBProvider } from "@/sdk/chat-sdk-backend";
import { useAuthStore } from "@/state/auth";
import { ClientConfig } from "@/config";
import { Stack, useRouter } from "expo-router";
export default function MainLayout() {
  const token = useAuthStore((s) => s.token);
  const clear = useAuthStore((s) => s.clear);
  const router = useRouter();

  return (
    <PBProvider
      baseUrl={ClientConfig.pbBaseUrl}
      token={token}
      onAuthInvalid={() => {
        clear();
        router.replace("/prelogin");
      }}
    >
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="rooms" options={{ title: "Rooms" }} />
        <Stack.Screen name="create-room" options={{ title: "Create Room" }} />
        <Stack.Screen name="chat" options={{ title: "Chat" }} />
      </Stack>
    </PBProvider>
  );
}
