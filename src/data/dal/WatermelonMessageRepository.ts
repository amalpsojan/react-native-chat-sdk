import type { Message as ChatMessage, MessageStatus } from "@/components/chat-sdk/types";
import { SyncService } from "@/data/sync/SyncService";
import { database } from "@/data/watermelon/database";
import WMMessage from "@/data/watermelon/models/Message";
import { Q } from "@nozbe/watermelondb";
import type { MessageRepository } from "./MessageRepository";

export class WatermelonMessageRepository implements MessageRepository {
  private subscribers: Map<string, Set<(messages: ChatMessage[]) => void>> = new Map();
  private roomObservers: Map<string, { unsubscribe: () => void } | { remove: () => void } | any> = new Map();
  private readonly syncService = new SyncService();

  private mapRecord(r: WMMessage): ChatMessage {
    return {
      id: r.id,
      from: r.from,
      isReceived: r.isReceived,
      type: r.type as any,
      content: r.content,
      createdAt: r.createdAt,
      editedAt: r.editedAt,
      status: r.status as any,
      referenceMessage: r.refMessageId
        ? { referenceMessageId: r.refMessageId, type: r.refType as any, content: r.refContent }
        : undefined,
    } as ChatMessage;
  }

  async getMessages(roomId: string): Promise<ChatMessage[]> {
    const collection = database.get<WMMessage>('messages');
    const rows = await collection.query(Q.where('room_id', roomId), Q.sortBy('created_at', Q.desc)).fetch();
    return rows.map((r) => ({
      id: r.id,
      from: r.from,
      isReceived: r.isReceived,
      type: r.type as any,
      content: r.content,
      createdAt: r.createdAt,
      editedAt: r.editedAt,
      status: r.status as any,
      referenceMessage: r.refMessageId
        ? { referenceMessageId: r.refMessageId, type: r.refType as any, content: r.refContent }
        : undefined,
    } as ChatMessage));
  }

  subscribe(roomId: string, cb: (messages: ChatMessage[]) => void): () => void {
    if (!this.subscribers.has(roomId)) this.subscribers.set(roomId, new Set());
    this.subscribers.get(roomId)!.add(cb);

    if (!this.roomObservers.has(roomId)) {
      const collection = database.get<WMMessage>('messages');
      const query = collection.query(Q.where('room_id', roomId), Q.sortBy('created_at', Q.desc));
      const subscription = query.observe().subscribe((rows: WMMessage[]) => {
        const list = rows.map((r) => this.mapRecord(r));
        // eslint-disable-next-line no-console
        console.log(`[repo] room=${roomId} rows=${rows.length}`);
        const subs = this.subscribers.get(roomId);
        subs?.forEach((fn) => fn(list));
      });
      this.roomObservers.set(roomId, subscription);
    }

    return () => {
      const set = this.subscribers.get(roomId);
      if (set) {
        set.delete(cb);
        if (set.size === 0) {
          // No more listeners for this room; stop observing DB changes
          const sub = this.roomObservers.get(roomId);
          if (sub?.unsubscribe) sub.unsubscribe();
          else if (sub?.remove) sub.remove();
          this.roomObservers.delete(roomId);
        }
      }
    };
  }

  async syncNow(roomId: string): Promise<void> {
    try {
      await this.syncService.pull(roomId);
    } catch {}
  }

  async addMessage(roomId: string, message: ChatMessage): Promise<void> {
    const collection = database.get<WMMessage>('messages');
    await database.write(async () => {
      await collection.create((rec) => {
        rec._raw.id = message.id; // use client id for consistency with repo
        (rec as any).roomId = roomId;
        (rec as any).from = message.from;
        (rec as any).isReceived = !!message.isReceived;
        (rec as any).type = message.type;
        (rec as any).content = message.content;
        (rec as any).createdAt = typeof message.createdAt === 'number' ? message.createdAt : new Date(message.createdAt).getTime();
        (rec as any).editedAt = message.editedAt ? (typeof message.editedAt === 'number' ? message.editedAt : new Date(message.editedAt).getTime()) : null;
        (rec as any).status = message.status || null;
        if (message.referenceMessage) {
          (rec as any).refMessageId = message.referenceMessage.referenceMessageId;
          (rec as any).refType = message.referenceMessage.type;
          (rec as any).refContent = message.referenceMessage.content;
        }
      });
    });
    // DB observers will notify subscribers
    // Trigger background sync to backend and reconcile
    try {
      await this.syncService.push(roomId, message);
    } catch {
      // ignore mock sync errors for now
    }
  }

  async upsertMessages(roomId: string, messages: ChatMessage[]): Promise<void> {
    const collection = database.get<WMMessage>('messages');
    await database.write(async () => {
      for (const m of messages) {
        const existing = await collection.query(Q.where('id', m.id)).fetch();
        if (existing.length > 0) {
          await existing[0].update((rec) => {
            (rec as any).from = m.from;
            (rec as any).isReceived = !!m.isReceived;
            (rec as any).type = m.type;
            (rec as any).content = m.content;
            (rec as any).createdAt = typeof m.createdAt === 'number' ? m.createdAt : new Date(m.createdAt).getTime();
            (rec as any).editedAt = m.editedAt ? (typeof m.editedAt === 'number' ? m.editedAt : new Date(m.editedAt).getTime()) : null;
            (rec as any).status = m.status || null;
            if (m.referenceMessage) {
              (rec as any).refMessageId = m.referenceMessage.referenceMessageId;
              (rec as any).refType = m.referenceMessage.type;
              (rec as any).refContent = m.referenceMessage.content;
            }
          });
        } else {
          await collection.create((rec) => {
            rec._raw.id = m.id;
            (rec as any).roomId = roomId;
            (rec as any).from = m.from;
            (rec as any).isReceived = !!m.isReceived;
            (rec as any).type = m.type;
            (rec as any).content = m.content;
            (rec as any).createdAt = typeof m.createdAt === 'number' ? m.createdAt : new Date(m.createdAt).getTime();
            (rec as any).editedAt = m.editedAt ? (typeof m.editedAt === 'number' ? m.editedAt : new Date(m.editedAt).getTime()) : null;
            (rec as any).status = m.status || null;
            if (m.referenceMessage) {
              (rec as any).refMessageId = m.referenceMessage.referenceMessageId;
              (rec as any).refType = m.referenceMessage.type;
              (rec as any).refContent = m.referenceMessage.content;
            }
          });
        }
      }
    });
    // DB observers will notify subscribers
  }

  async updateStatus(messageId: string, status: MessageStatus): Promise<void> {
    const collection = database.get<WMMessage>('messages');
    const existing = await collection.find(messageId).catch(() => null);
    if (!existing) return;
    await database.write(async () => {
      await existing.update((rec) => {
        (rec as any).status = status;
      });
    });
    // we need roomId to emit; fetch record again
    const roomId = (existing as any).roomId as string;
    // DB observers will notify subscribers
  }
}
