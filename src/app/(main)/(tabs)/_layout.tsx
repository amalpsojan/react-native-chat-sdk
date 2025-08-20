import { Tabs } from "expo-router";
import React from "react";
export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" redirect options={{ headerShown: false }} />
      <Tabs.Screen name="rooms" options={{ title: "Rooms" }} />
      <Tabs.Screen name="settings" options={{ title: "Settings" }} />
    </Tabs>
  );
}
