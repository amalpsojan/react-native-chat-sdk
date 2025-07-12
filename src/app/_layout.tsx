import { Stack } from 'expo-router';
import React from 'react';
import { KeyboardProvider } from 'react-native-keyboard-controller';

export default function RootLayout() {
  return (
    <KeyboardProvider>
      <Stack>
        <Stack.Screen 
          name="index" 
          options={{ 
            title: 'Chat',
            headerShadowVisible: false,
          }} 
        />
      </Stack>
    </KeyboardProvider>
  );
}
