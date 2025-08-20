import type { Message } from "@chat-sdk-ui/types";
import PocketBase from "pocketbase";
import { useEffect, useMemo, useRef, useState } from "react";
import RNEventSource from "react-native-sse";

type UsePocketBaseChatOptions = {
  baseUrl: string;
  // Auth token (required for protected rules)
  token?: string;
  // Target room id to chat in
  roomId: string;
  historyLimit?: number; // default 50
};

type UsePocketBaseChatResult = {
  messages: Message[];
  currentUserId: string;
  isReady: boolean;
  error: unknown | null;
  sendText: (text: string) => Promise<void>;
};

export function usePocketBaseChat(options: UsePocketBaseChatOptions): UsePocketBaseChatResult {
  const { baseUrl, token, roomId: targetRoomId, historyLimit = 50 } = options;

  // Polyfill EventSource for React Native so PocketBase realtime works
  if (typeof (global as any).EventSource === "undefined") {
    (global as any).EventSource = RNEventSource as any;
  }

  const pbRef = useRef(new PocketBase(baseUrl));
  const pb = pbRef.current;

  const [currentUserId, setCurrentUserId] = useState("");
  const [roomId, setRoomId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<unknown | null>(null);

  useEffect(() => {
    let unsubscribe: (() => Promise<void>) | null = null;
    let isActive = true;

    async function init() {
      try {
        setError(null);
        setIsReady(false);

        // Auth: prefer token when provided
        console.log('[pbchat] init start. hasToken=', !!token);
        if (token) {
          console.log('[pbchat] using token -> refresh');
          pb.authStore.save(token, null);
          try {
            await pb.collection("users").authRefresh();
            console.log('[pbchat] token refresh OK');
          } catch (e) {
            console.error('[pbchat] token refresh failed', e);
            throw e;
          }
        } else {
          throw new Error("Missing auth token");
        }

        const user = pb.authStore.record as any;
        const userId = user?.username || user?.email || user?.id || '';
        if (!isActive) return;
        setCurrentUserId(userId);

        // Resolve room id by title (must exist)
        const roomIdResolved = targetRoomId;
        if (!roomIdResolved) throw new Error('Missing roomId');
        if (!isActive) return;
        setRoomId(roomIdResolved);
        console.log('[pbchat] room id', roomIdResolved);

        // Load recent history
        const sort = "createdAtMs"; // oldest first
        console.log('[pbchat] loading history', { limit: historyLimit, sort });
        const res = await pb.collection("messages").getList(1, historyLimit, {
          query: { filter: `roomId = "${roomIdResolved}"`, sort },
        });
        if (!isActive) return;
        let initial: Message[] = res.items.map((r: any) => ({
          id: r.id,
          from: r.from,
          isReceived: r.from !== userId,
          createdAt: r.createdAtMs ?? Date.now(),
          editedAt: r.editedAtMs,
          status: r.status,
          type: r.type,
          content: r.content,
        }));
        setMessages(initial);
        console.log('[pbchat] history loaded', initial.length);

        // Subscribe to realtime message creates in this room
        unsubscribe = await pb.collection("messages").subscribe("*", (e: any) => {
          console.log('[pbchat] event', e?.action, e?.record?.id);
          const rec = e?.record;
          if (!rec || rec.roomId !== roomIdResolved) return;
          if (e.action === "create") {
            const next: Message = {
              id: rec.id,
              from: rec.from,
              isReceived: rec.from !== userId,
              createdAt: rec.createdAtMs ?? Date.now(),
              editedAt: rec.editedAtMs,
              status: rec.status,
              type: rec.type,
              content: rec.content,
            } as Message;
            setMessages((prev) => [...prev, next]);
          }
        });

        if (!isActive) return;
        setIsReady(true);
        console.log('[pbchat] ready');
      } catch (e) {
        if (!isActive) return;
        console.error('[pbchat] init error', e);
        setError(e);
        setIsReady(false);
      }
    }

    init();

    return () => {
      isActive = false;
      if (unsubscribe) {
        console.log('[pbchat] cleanup unsubscribe');
        unsubscribe().catch(() => {});
      }
    };
  }, [baseUrl, token, targetRoomId, historyLimit]);

  const sendText = useMemo(
    () =>
      async (text: string) => {
        if (!text || !roomId) return;
        await pb.collection("messages").create({
          roomId,
          from: currentUserId,
          type: "text",
          content: { text },
          createdAtMs: Date.now(),
          status: "sent",
        });
      },
    [pb, roomId, currentUserId]
  );

  return { messages, currentUserId, isReady, error, sendText };
}


