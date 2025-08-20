import { login as apiLogin, register as apiRegister } from '@/api/account';
import { useAuthStore } from '@/state/auth';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Button, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function RegisterScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const setToken = useAuthStore((s) => s.setToken);
  const params = useLocalSearchParams<{ identifier?: string }>();
  const [email, setEmail] = useState(params.identifier || '');
  const [password, setPassword] = useState('secret123');
  const [loading, setLoading] = useState(false);

  const onRegister = async () => {
    if (!email || !password) return Alert.alert('Missing', 'Enter email and password');
    setLoading(true);
    try {
      await apiRegister(email, password);
      const res = await apiLogin(email, password);
      const token = res?.token;
      if (!token) throw new Error('No token');
      setToken(token);
      router.replace('/(main)/(tabs)/rooms');
    } catch (e: any) {
      Alert.alert('Register failed', e?.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, paddingTop: insets.top, padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: '600', marginBottom: 16 }}>Register</Text>
      <Text>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        editable={false}
        selectTextOnFocus={false}
        style={{ borderWidth: 1, borderColor: '#ccc', backgroundColor: '#f4f4f5', borderRadius: 8, padding: 12, marginBottom: 12, color: '#888' }}
      />
      <Text>Password</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 20 }}
      />
      <Button title={loading ? 'Creating...' : 'Create account'} onPress={onRegister} disabled={loading} />
      <View style={{ height: 12 }} />
      <Button title="Change" onPress={() => router.replace('/prelogin')} />
    </View>
  );
}


