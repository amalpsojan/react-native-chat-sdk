import type { Message, MessageStatus } from "@chat-sdk-ui/types";
import { messages as seedMessages } from "../../dummy";

class MockBackend {
  private roomIdToMessages: Map<string, Message[]> = new Map();

  constructor() {
    // Seed default room
    this.roomIdToMessages.set("room-123", [...seedMessages]);
  }

  async getMessages(roomId: string, since?: number): Promise<Message[]> {
    const list = this.roomIdToMessages.get(roomId) || [];
    const filtered = since ? list.filter((m) => {
      const ts = typeof m.createdAt === 'number' ? m.createdAt : new Date(m.createdAt).getTime();
      return ts > since;
    }) : list;
    // Return newest first
    return [...filtered].sort((a, b) => {
      const at = typeof a.createdAt === 'number' ? a.createdAt : new Date(a.createdAt).getTime();
      const bt = typeof b.createdAt === 'number' ? b.createdAt : new Date(b.createdAt).getTime();
      return bt - at;
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
    return message;
  }

  async updateStatus(roomId: string, messageId: string, status: MessageStatus): Promise<void> {
    const list = this.roomIdToMessages.get(roomId) || [];
    const idx = list.findIndex((m) => m.id === messageId);
    if (idx >= 0) {
      const updated = [...list];
      updated[idx] = { ...updated[idx], status } as Message;
      this.roomIdToMessages.set(roomId, updated);
    }
  }
}

export const mockBackend = new MockBackend();
