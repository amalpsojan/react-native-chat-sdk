import type { Message, MessageStatus } from "@/components/chat-sdk/types";
import type { MessageRepository } from "./MessageRepository";

export class InMemoryMessageRepository implements MessageRepository {
  private roomIdToMessages: Map<string, Message[]> = new Map();
  private roomIdToSubscribers: Map<string, Set<(messages: Message[]) => void>> = new Map();

  private notify(roomId: string) {
    const msgs = this.roomIdToMessages.get(roomId) || [];
    const subs = this.roomIdToSubscribers.get(roomId);
    if (subs) subs.forEach((cb) => cb(msgs));
  }

  async getMessages(roomId: string): Promise<Message[]> {
    return this.roomIdToMessages.get(roomId) || [];
  }

  subscribe(roomId: string, cb: (messages: Message[]) => void): () => void {
    if (!this.roomIdToSubscribers.has(roomId)) this.roomIdToSubscribers.set(roomId, new Set());
    this.roomIdToSubscribers.get(roomId)!.add(cb);
    cb(this.roomIdToMessages.get(roomId) || []);
    return () => {
      this.roomIdToSubscribers.get(roomId)?.delete(cb);
    };
  }

  async addMessage(roomId: string, message: Message): Promise<void> {
    const existing = this.roomIdToMessages.get(roomId) || [];
    if (existing.some((m) => m.id === message.id)) return;
    this.roomIdToMessages.set(roomId, [message, ...existing]);
    this.notify(roomId);
  }

  async upsertMessages(roomId: string, messages: Message[]): Promise<void> {
    const existing = this.roomIdToMessages.get(roomId) || [];
    const map = new Map(existing.map((m) => [m.id, m] as const));
    for (const m of messages) map.set(m.id, m);
    const merged = Array.from(map.values()).sort((a, b) => {
      const at = typeof a.createdAt === 'number' ? a.createdAt : new Date(a.createdAt).getTime();
      const bt = typeof b.createdAt === 'number' ? b.createdAt : new Date(b.createdAt).getTime();
      return bt - at;
    });
    this.roomIdToMessages.set(roomId, merged);
    this.notify(roomId);
  }

  async updateStatus(messageId: string, status: MessageStatus): Promise<void> {
    for (const [roomId, msgs] of this.roomIdToMessages.entries()) {
      const idx = msgs.findIndex((m) => m.id === messageId);
      if (idx >= 0) {
        const updated = [...msgs];
        updated[idx] = { ...updated[idx], status } as Message;
        this.roomIdToMessages.set(roomId, updated);
        this.notify(roomId);
        break;
      }
    }
  }
}
