import PocketBase from 'pocketbase';

// Configure your local/dev PocketBase URL (adjust if self-hosted elsewhere)
export const PB_URL = process.env.EXPO_PUBLIC_PB_URL || 'http://127.0.0.1:8090';

export const pb = new PocketBase(PB_URL);

// Collections naming (adjust to your PocketBase schema)
export const Collections = {
  Conversations: 'conversations',
  Members: 'conversation_members',
  Messages: 'messages',
  PushTokens: 'push_tokens',
} as const;

export type PBMessage = {
  id: string;
  conversation_id: string;
  from_user: string;
  created_at: string;
  type: string;
  content: any;
  reference_message?: any;
  status?: string;
};

export async function insertMessage(msg: Omit<PBMessage, 'id' | 'created_at'>) {
  const rec = await pb.collection(Collections.Messages).create({
    conversation_id: msg.conversation_id,
    from_user: msg.from_user,
    type: msg.type,
    content: msg.content,
    reference_message: msg.reference_message ?? null,
    status: msg.status ?? 'sent',
  });
  return (rec as unknown) as PBMessage;
}

export async function subscribeMessages(conversationId: string, onInsert: (m: PBMessage) => void) {
  const unsub = await pb.collection(Collections.Messages).subscribe('*', (e) => {
    if (e.action === 'create' && e.record?.conversation_id === conversationId) {
      onInsert((e.record as unknown) as PBMessage);
    }
  });
  return () => {
    try { unsub(); } catch {}
  };
}

export async function upsertPushToken(userId: string, deviceId: string, expoToken: string) {
  const coll = pb.collection(Collections.PushTokens);
  const list = await coll.getList(1, 1, { filter: `user_id = "${userId}" && device_id = "${deviceId}"` });
  if (list.items.length) {
    const id = list.items[0].id;
    await coll.update(id, { expo_token: expoToken });
    return id;
  }
  const rec = await coll.create({ user_id: userId, device_id: deviceId, expo_token: expoToken });
  return rec.id as string;
} 