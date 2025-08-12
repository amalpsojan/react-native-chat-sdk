import { createRoom } from "@/api/rooms";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Button, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function CreateRoomScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const onCreate = async () => {
    if (!title) return Alert.alert("Missing", "Enter a room title");
    setLoading(true);
    try {
      const room = await createRoom(title);
      router.replace({
        pathname: "/(main)/chat",
        params: { roomId: room.room.id },
      });
    } catch (e: any) {
      Alert.alert("Create room failed", e?.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, paddingTop: insets.top, padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: "600", marginBottom: 16 }}>
        Create Room
      </Text>
      <Text>Title</Text>
      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="eg. General"
        autoCapitalize="none"
        autoCorrect={false}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 8,
          padding: 12,
          marginBottom: 20,
        }}
      />
      <Button
        title={loading ? "Creating..." : "Create"}
        onPress={onCreate}
        disabled={loading}
      />
    </View>
  );
}
