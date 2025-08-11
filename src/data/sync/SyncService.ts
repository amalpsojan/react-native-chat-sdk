import { mockBackend } from "@/backend/mockBackend";
import type { Message } from "@/components/chat-sdk/types";
import { database } from "@/data/watermelon/database";
import WMMessage from "@/data/watermelon/models/Message";
import { Q } from "@nozbe/watermelondb";

export class SyncService {
  private lastPulledAtPerRoom: Map<string, number> = new Map();

  async pull(roomId: string): Promise<number> {
    const since = this.lastPulledAtPerRoom.get(roomId);
    const remote = await mockBackend.getMessages(roomId, since);
    if (remote.length === 0) return since || 0;

    // Upsert into WatermelonDB
    const collection = database.get<WMMessage>('messages');
    await database.write(async () => {
      for (const m of remote) {
        const existing = await collection.query(Q.where('id', m.id)).fetch();
        if (existing.length > 0) {
          await existing[0].update((rec) => {
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
          // eslint-disable-next-line no-console
          console.log(`[sync] updated id=${m.id}`);
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
          // eslint-disable-next-line no-console
          console.log(`[sync] created id=${m.id}`);
        }
      }
    });

    const newestTs = Math.max(
      ...remote.map((m) => {
        const created = typeof m.createdAt === 'number' ? m.createdAt : new Date(m.createdAt).getTime();
        const edited = m.editedAt ? (typeof m.editedAt === 'number' ? m.editedAt : new Date(m.editedAt).getTime()) : 0;
        return Math.max(created, edited);
      })
    );
    this.lastPulledAtPerRoom.set(roomId, newestTs);
    return newestTs;
  }

  async push(roomId: string, message: Message): Promise<void> {
    await mockBackend.createMessage(roomId, message);
    await this.pull(roomId);
  }
}
