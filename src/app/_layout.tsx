if (__DEV__) {
  require("../../ReactotronConfig");
}
import { ClientConfig } from "@/config";
import { PBProvider } from "@/sdk/chat-sdk-backend";
import { useAuthStore } from "@/state/auth";
import { Stack, useRouter } from "expo-router";
import React from "react";
import { KeyboardProvider } from "react-native-keyboard-controller";

export default function RootLayout() {
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
      <KeyboardProvider>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="prelogin" options={{ title: "Welcome" }} />
          <Stack.Screen name="login" options={{ title: "Login" }} />
          <Stack.Screen name="register" options={{ title: "Register" }} />
          <Stack.Screen name="rooms" options={{ title: "Rooms" }} />
          <Stack.Screen name="create-room" options={{ title: "Create Room" }} />
          <Stack.Screen name="chat" options={{ title: "Chat" }} />
        </Stack>
      </KeyboardProvider>
    </PBProvider>
  );
}
