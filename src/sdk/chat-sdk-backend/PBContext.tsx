import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { PBClient } from './pbClient';

type PBContextValue = {
  pb: PBClient;
  isReady: boolean;
  error: unknown | null;
};

const PBContext = createContext<PBContextValue | undefined>(undefined);

type PBProviderProps = {
  baseUrl: string;
  token?: string;
  children: React.ReactNode;
  onAuthInvalid?: () => void;
};

export function PBProvider({ baseUrl, token, children, onAuthInvalid }: PBProviderProps) {
  const pb = useMemo(() => new PBClient(baseUrl), [baseUrl]);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<unknown | null>(null);

  // Apply token whenever it changes
  useEffect(() => {
    pb.setToken(token);
  }, [pb, token]);

  // Attempt a best-effort auth refresh to validate the token and warm the client
  useEffect(() => {
    let isActive = true;
    setIsReady(false);
    setError(null);
    (async () => {
      try {
        await pb.ensureAuth();
        if (!isActive) return;
        const valid = !!pb.sdk.authStore.token && !!pb.sdk.authStore.record && pb.sdk.authStore.isValid;
        if (valid) {
          setIsReady(true);
        } else {
          onAuthInvalid?.();
          setIsReady(false);
        }
      } catch (e) {
        if (!isActive) return;
        setError(e);
        onAuthInvalid?.();
        setIsReady(false);
      }
    })();
    return () => {
      isActive = false;
    };
  }, [pb, token]);

  const value = useMemo<PBContextValue>(() => ({ pb, isReady, error }), [pb, isReady, error]);

  return <PBContext.Provider value={value}>{children}</PBContext.Provider>;
}

export function usePB(): PBContextValue {
  const ctx = useContext(PBContext);
  if (!ctx) throw new Error('usePB must be used within a PBProvider');
  return ctx;
}


