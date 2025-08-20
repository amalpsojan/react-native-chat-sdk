import { login as apiLogin } from "@/api/account";
import { useAuthStore } from "@/state/auth";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Button, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{ identifier?: string }>();
  const [email, setEmail] = useState(params.identifier || "");
  const [password, setPassword] = useState("secret123");
  const [loading, setLoading] = useState(false);
  const setToken = useAuthStore((s) => s.setToken);

  const onLogin = async () => {
    if (!email || !password) {
      Alert.alert("Missing credentials", "Please enter email and password");
      return;
    }
    setLoading(true);
    try {
      const res = await apiLogin(email, password);
      const token = res?.token;
      if (!token) throw new Error("No token received");
      setToken(token);
      router.replace("/(main)/(tabs)/rooms");
    } catch (e: any) {
      Alert.alert("Login failed", e?.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, paddingTop: insets.top, padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: "600", marginBottom: 16 }}>Login</Text>

      <Text>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        editable={false}
        selectTextOnFocus={false}
        style={{ borderWidth: 1, borderColor: "#ccc", backgroundColor: "#f4f4f5", borderRadius: 8, padding: 12, marginBottom: 12, color: "#888" }}
      />

      <Text>Password</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 12, marginBottom: 20 }}
      />

      <Button title={loading ? "Logging in..." : "Login"} onPress={onLogin} disabled={loading} />
      <View style={{ height: 12 }} />
      <Button title="Change" onPress={() => router.replace('/prelogin')} />
    </View>
  );
}


