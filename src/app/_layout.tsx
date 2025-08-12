import { PBProvider } from "@/sdk/chat-sdk-backend";
import { useAuthStore } from "@/state/auth";
import { Stack, useRouter } from "expo-router";
import React from "react";
import { KeyboardProvider } from "react-native-keyboard-controller";

export default function RootLayout() {
  const token = useAuthStore((s) => s.token);
  const clear = useAuthStore((s) => s.clear);
  const baseUrl =
    (process as any)?.env?.EXPO_PUBLIC_PB_URL || "http://127.0.0.1:8090";
  const router = useRouter();

  return (
    <PBProvider
      baseUrl={baseUrl}
      token={token}
      onAuthInvalid={() => {
        clear();
        router.replace('/login');
      }}
    >
      <KeyboardProvider>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ title: "Login" }} />
          <Stack.Screen name="rooms" options={{ title: "Rooms" }} />
          <Stack.Screen name="chat" options={{ title: "Chat" }} />
        </Stack>
      </KeyboardProvider>
    </PBProvider>
  );
}
