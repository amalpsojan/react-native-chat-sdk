import { ClientConfig } from "@/config";
import { PBProvider } from "@/sdk/chat-sdk-backend-client";
import { useAuthStore } from "@/state/auth";
import { Stack, useRouter } from "expo-router";
import React from "react";
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
        <Stack.Screen name="index" redirect options={{ headerShown: false }} />
        <Stack.Screen name="create-room" options={{ title: "Create Room" }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </PBProvider>
  );
}
