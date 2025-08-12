import { Stack } from "expo-router";
import React from "react";
import { KeyboardProvider } from "react-native-keyboard-controller";

export default function RootLayout() {
  return (
    <KeyboardProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen
          name="login"
          options={{
            title: "Login",
          }}
        />
        <Stack.Screen
          name="rooms"
          options={{
            title: "Rooms",
          }}
        />
        <Stack.Screen
          name="chat"
          options={{
            title: "Chat",
          }}
        />
      </Stack>
    </KeyboardProvider>
  );
}
