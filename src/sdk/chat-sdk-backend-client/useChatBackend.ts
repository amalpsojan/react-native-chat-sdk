import type { Message } from '@chat-sdk-ui/types';
import { useEffect, useMemo, useState } from 'react';
import { loadHistory, sendMessage as sendMessageSdk, subscribeMessages } from './messages';
import { usePB } from './PBContext';
import { listRooms, type Room } from './rooms';

type UseChatBackendOptions = {
  roomId?: string;
  historyLimit?: number;
};

type UseChatBackendResult = {
  // session
  isReady: boolean;
  error: unknown | null;
  currentUserId: string;

  // rooms
  rooms: Room[];
  roomsLoading: boolean;
  roomsError: unknown | null;

  // messages
  messages: Message[];
  messagesLoading: boolean;
  messagesError: unknown | null;
  sendMessage: (input: Pick<Message, 'type' | 'content'> & {
    status?: Message['status'];
    editedAtMs?: number;
    refMessageId?: string;
    refType?: string;
    refContent?: any;
  }) => Promise<void>;
};

export function useChatBackend(options: UseChatBackendOptions = {}): UseChatBackendResult {
  const { roomId, historyLimit = 50 } = options;
  const { pb, isReady, error } = usePB();

  const [currentUserId, setCurrentUserId] = useState('');

  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomsLoading, setRoomsLoading] = useState(false);
  const [roomsError, setRoomsError] = useState<unknown | null>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState<unknown | null>(null);

  // Derive current user id when ready
  useEffect(() => {
    if (!isReady) return;
    const user = pb.sdk.authStore.record as any;
    const id = user?.id || '';
    console.log('[chat-backend] user', id);
    setCurrentUserId(id);
  }, [isReady, pb]);

  useEffect(() => {
    if (!isReady) return;
    (async () => {
      try {
        setRoomsError(null);
        setRoomsLoading(true);
        const list = await listRooms(pb);
        console.log('[chat-backend] rooms loaded', list.length);
        setRooms(list);
      } catch (e) {
        console.error('[chat-backend] rooms error', e);
        setRoomsError(e);
      } finally {
        setRoomsLoading(false);
      }
    })();
    (async () => {
      // Subscribe and update local state directly for realtime UX
      await pb.sdk.collection('rooms').subscribe('*', (e: any) => {
        const rec = e?.record as Room | undefined;
        console.log('[chat-backend] rooms event', e?.action, rec?.id);
        if (!rec) return;
        setRooms((prev) => {
          if (e.action === 'create') {
            if (prev.some((r) => r.id === rec.id)) return prev;
            return [rec, ...prev];
          }
          if (e.action === 'update') {
            return prev.map((r) => (r.id === rec.id ? { ...r, ...rec } : r));
          }
          if (e.action === 'delete') {
            return prev.filter((r) => r.id !== rec.id);
          }
          return prev;
        });
      });
    })();
    return () => {
      try {
        pb.sdk.collection('rooms').unsubscribe('*');
      } catch {}
    };
  }, [isReady, pb]);

  // (removed) AppState foreground refresh; not needed now that realtime is working reliably

  useEffect(() => {
    if (!isReady || !roomId) return;
    let unsub: (() => Promise<void>) | null = null;
    (async () => {
      try {
        setMessagesError(null);
        setMessagesLoading(true);
        console.log('[chat-backend] load history', { roomId, historyLimit });
        const hist = await loadHistory(pb, roomId, historyLimit);
        console.log('[chat-backend] history loaded', hist.length);
        // Invert order so newest appears first in the list
        setMessages([...hist].reverse());
      } catch (e) {
        console.error('[chat-backend] messages error', e);
        setMessagesError(e);
      } finally {
        setMessagesLoading(false);
      }
    })();
    (async () => {
      unsub = await subscribeMessages(pb, roomId, (m) => {
        console.log('[chat-backend] message create', m.id);
        // Prepend new message when using inverted order
        setMessages((prev) => [m, ...prev]);
      });
    })();
    return () => {
      if (unsub) unsub().catch(() => {});
    };
  }, [isReady, pb, roomId, historyLimit]);

  const sendMessage = useMemo(
    () =>
      async (input: Pick<Message, 'type' | 'content'> & {
        status?: Message['status'];
        editedAtMs?: number;
        refMessageId?: string;
        refType?: string;
        refContent?: any;
      }) => {
        if (!roomId) return;
        await sendMessageSdk(pb, roomId, input);
      },
    [pb, roomId]
  );

  return {
    isReady,
    error,
    currentUserId,
    rooms,
    roomsLoading,
    roomsError,
    messages,
    messagesLoading,
    messagesError,
    sendMessage,
  };
}


