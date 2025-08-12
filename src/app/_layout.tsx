if (__DEV__) {
  require("../../ReactotronConfig");
}
import { Stack } from "expo-router";
import React from "react";
import { KeyboardProvider } from "react-native-keyboard-controller";

export default function RootLayout() {
  return (
    <KeyboardProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="prelogin" options={{ title: "Welcome" }} />
        <Stack.Screen name="login" options={{ title: "Login" }} />
        <Stack.Screen name="register" options={{ title: "Register" }} />
        <Stack.Screen name="(main)" options={{ headerShown: false }} />
      </Stack>
    </KeyboardProvider>
  );
}
