import type { Message } from '@/components/chat-sdk/types';
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
  refreshRooms: () => Promise<void>;

  // messages
  messages: Message[];
  messagesLoading: boolean;
  messagesError: unknown | null;
  refreshMessages: () => Promise<void>;
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

  // Rooms: initial load + realtime updates
  const refreshRooms = useMemo(
    () =>
      async () => {
        if (!isReady) return;
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
      },
    [isReady, pb]
  );

  useEffect(() => {
    if (!isReady) return;
    let unsub: (() => Promise<void>) | null = null;
    refreshRooms();
    (async () => {
      // subscribe to rooms collection for simple invalidation
      unsub = await pb.sdk.collection('rooms').subscribe('*', (e: any) => {
        console.log('[chat-backend] rooms event', e?.action, e?.record?.id);
        if (e?.action === 'create' || e?.action === 'update' || e?.action === 'delete') {
          refreshRooms();
        }
      });
    })();
    return () => {
      if (unsub) unsub().catch(() => {});
    };
  }, [isReady, pb, refreshRooms]);

  // Messages: load and subscribe when roomId provided
  const refreshMessages = useMemo(
    () =>
      async () => {
        if (!isReady || !roomId) return;
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
      },
    [isReady, pb, roomId, historyLimit]
  );

  useEffect(() => {
    if (!isReady || !roomId) return;
    let unsub: (() => Promise<void>) | null = null;
    refreshMessages();
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
  }, [isReady, pb, roomId, refreshMessages]);

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
    refreshRooms,
    messages,
    messagesLoading,
    messagesError,
    refreshMessages,
    sendMessage,
  };
}


