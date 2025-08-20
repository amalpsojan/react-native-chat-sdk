import { usePB } from "@/sdk/chat-sdk-backend-client";
import { useAuthStore } from "@/state/auth";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import { Button, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SettingsScreen = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const clearAuth = useAuthStore((s) => s.clear);

  const { pb, isReady } = usePB();
  const userRecord = useMemo(() => {
    return (pb.sdk.authStore.record as any) || null;
  }, [pb]);

  const onLogout = () => {
    clearAuth();
    router.replace("/prelogin");
  };

  return (
    <View style={{ flex: 1, paddingTop: insets.top, padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: "600", marginBottom: 16 }}>Settings</Text>

      <View style={{ backgroundColor: "#f4f4f5", borderRadius: 12, padding: 16, marginBottom: 24 }}>
        <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 8 }}>User</Text>
        {!isReady ? (
          <Text>Loading...</Text>
        ) : userRecord ? (
          <View>
            {userRecord.username ? (
              <Text style={{ marginBottom: 6 }}>Username: {String(userRecord.username)}</Text>
            ) : null}
            {userRecord.email ? (
              <Text style={{ marginBottom: 6 }}>Email: {String(userRecord.email)}</Text>
            ) : null}
            {userRecord.id ? <Text>ID: {String(userRecord.id)}</Text> : null}
          </View>
        ) : (
          <Text>No user loaded.</Text>
        )}
      </View>

      <Button title="Logout" onPress={onLogout} />
    </View>
  );
};

export default SettingsScreen;
