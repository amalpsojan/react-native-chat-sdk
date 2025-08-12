import { setAuthToken } from '@/api/http';
import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type AuthState = {
  token?: string;
  user?: { id: string; email?: string; username?: string } | null;
  setToken: (token?: string) => void;
  setUser: (user?: AuthState['user']) => void;
  clear: () => void;
};

const secureStorage = {
  getItem: async (name: string) => {
    const v = await SecureStore.getItemAsync(name);
    return v ?? null;
  },
  setItem: async (name: string, value: string) => {
    await SecureStore.setItemAsync(name, value);
  },
  removeItem: async (name: string) => {
    await SecureStore.deleteItemAsync(name);
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: undefined,
      user: null,
      setToken: (token) => {
        setAuthToken(token);
        set({ token });
      },
      setUser: (user) => set({ user }),
      clear: () => {
        setAuthToken(undefined);
        set({ token: undefined, user: null });
      },
    }),
    {
      name: 'auth_store',
      storage: createJSONStorage(() => secureStorage),
      partialize: (state) => ({ token: state.token, user: state.user }),
      onRehydrateStorage: () => (state) => {
        if (state?.token) {
          setAuthToken(state.token);
        }
      },
    }
  )
);


