import type { Message, MessageStatus } from "@/components/chat-sdk/types";
import { messages as seedMessages } from "../../dummy";

class MockBackend {
  private roomIdToMessages: Map<string, Message[]> = new Map();

  constructor() {
    // Seed default room
    this.roomIdToMessages.set("room-123", [...seedMessages]);
  }

  async getMessages(roomId: string, since?: number): Promise<Message[]> {
    const list = this.roomIdToMessages.get(roomId) || [];
    const filtered = since
      ? list.filter((m) => {
          const created = typeof m.createdAt === 'number' ? m.createdAt : new Date(m.createdAt).getTime();
          const edited = m.editedAt
            ? typeof m.editedAt === 'number'
              ? m.editedAt
              : new Date(m.editedAt).getTime()
            : 0;
          const lastModified = Math.max(created, edited);
          return lastModified > since;
        })
      : list;
    // Return newest first
    return [...filtered].sort((a, b) => {
      const aCreated = typeof a.createdAt === 'number' ? a.createdAt : new Date(a.createdAt).getTime();
      const aEdited = a.editedAt ? (typeof a.editedAt === 'number' ? a.editedAt : new Date(a.editedAt).getTime()) : 0;
      const bCreated = typeof b.createdAt === 'number' ? b.createdAt : new Date(b.createdAt).getTime();
      const bEdited = b.editedAt ? (typeof b.editedAt === 'number' ? b.editedAt : new Date(b.editedAt).getTime()) : 0;
      const aMod = Math.max(aCreated, aEdited);
      const bMod = Math.max(bCreated, bEdited);
      return bMod - aMod;
    });
  }

  async createMessage(roomId: string, partial: Partial<Message>): Promise<Message> {
    const now = Date.now();
    const message: Message = {
      id: partial.id || now.toString(),
      from: partial.from || 'unknown',
      isReceived: !!partial.isReceived,
      type: partial.type || 'text' as any,
      content: partial.content || { text: '' },
      createdAt: partial.createdAt || now,
      editedAt: partial.editedAt,
      status: (partial.status as MessageStatus) || 'sent',
      referenceMessage: partial.referenceMessage,
    } as Message;
    const list = this.roomIdToMessages.get(roomId) || [];
    this.roomIdToMessages.set(roomId, [message, ...list]);
    // eslint-disable-next-line no-console
    console.log(`[mockBackend] createMessage room=${roomId} id=${message.id}`);
    return message;
  }

  async updateStatus(roomId: string, messageId: string, status: MessageStatus): Promise<void> {
    const list = this.roomIdToMessages.get(roomId) || [];
    const idx = list.findIndex((m) => m.id === messageId);
    if (idx >= 0) {
      const updated = [...list];
      updated[idx] = { ...updated[idx], status } as Message;
      this.roomIdToMessages.set(roomId, updated);
      // eslint-disable-next-line no-console
      console.log(`[mockBackend] updateStatus room=${roomId} id=${messageId} status=${status}`);
    }
  }
}

export const mockBackend = new MockBackend();
