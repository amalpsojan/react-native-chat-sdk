import { useChatBackend } from "@/sdk/chat-sdk-backend";
import { useAuthStore } from "@/state/auth";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TOKEN_KEY = "pb_user_token";

type Room = { id: string; title: string };

export default function RoomsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const { rooms, roomsLoading, refreshRooms } = useChatBackend();
  const token = useAuthStore((s) => s.token);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        if (!token) {
          router.replace("/prelogin");
          return;
        }
        await refreshRooms();
      } catch (e: any) {
        Alert.alert("Error", e?.message || "Failed to load rooms");
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  const onSelect = (room: Room) => {
    router.push({ pathname: "/chat", params: { roomId: room.id } });
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingTop: insets.top }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, paddingTop: insets.top }}>
      <FlatList
        data={rooms}
        keyExtractor={(r) => r.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => onSelect(item)} style={{ padding: 16, borderBottomWidth: 1, borderColor: "#eee" }}>
            <Text style={{ fontSize: 16 }}>{item.title}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={{ padding: 16 }}>No rooms</Text>}
      />
    </View>
  );
}


