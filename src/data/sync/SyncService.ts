import { database } from "@/data/watermelon/database";
import WMMessage from "@/data/watermelon/models/Message";
import type { Message } from "@chat-sdk-ui/types";
import { Q } from "@nozbe/watermelondb";
import PocketBase from "pocketbase";

const POCKETBASE_URL = process.env.EXPO_PUBLIC_PB_URL || "http://127.0.0.1:8090";

export class SyncService {
  private lastPulledAtPerRoom: Map<string, number> = new Map();
  private pb: PocketBase;
  private roomIdToUnsubscribe: Map<string, () => void> = new Map();

  constructor() {
    this.pb = new PocketBase(POCKETBASE_URL);
  }

  private async upsertRemoteRecord(roomId: string, m: any): Promise<void> {
    const collection = database.get<WMMessage>('messages');
    const existing = await collection.query(Q.where('id', m.id)).fetch();
    if (existing.length > 0) {
      await existing[0].update((rec) => {
        (rec as any).roomId = roomId;
        (rec as any).from = m.from;
        (rec as any).isReceived = m.from !== 'user-1';
        (rec as any).type = m.type;
        (rec as any).content = m.content;
        (rec as any).createdAt = m.createdAtMs;
        (rec as any).editedAt = m.editedAtMs || null;
        (rec as any).status = m.status || null;
        if (m.refMessageId) {
          (rec as any).refMessageId = m.refMessageId;
          (rec as any).refType = m.refType;
          (rec as any).refContent = m.refContent;
        }
      });
    } else {
      await collection.create((rec) => {
        rec._raw.id = m.id;
        (rec as any).roomId = roomId;
        (rec as any).from = m.from;
        (rec as any).isReceived = m.from !== 'user-1';
        (rec as any).type = m.type;
        (rec as any).content = m.content;
        (rec as any).createdAt = m.createdAtMs;
        (rec as any).editedAt = m.editedAtMs || null;
        (rec as any).status = m.status || null;
        if (m.refMessageId) {
          (rec as any).refMessageId = m.refMessageId;
          (rec as any).refType = m.refType;
          (rec as any).refContent = m.refContent;
        }
      });
    }
  }

  async subscribeToRoom(roomId: string): Promise<void> {
    if (this.roomIdToUnsubscribe.has(roomId)) return;
    const unsub = await this.pb
      .collection('messages')
      .subscribe("*", async (e: any) => {
        const record = e?.record;
        if (!record || record.roomId !== roomId) return;
        await database.write(async () => {
          await this.upsertRemoteRecord(roomId, record);
        });
        const newestTs = Number(record.createdAtMs) || 0;
        const prev = this.lastPulledAtPerRoom.get(roomId) || 0;
        if (newestTs > prev) this.lastPulledAtPerRoom.set(roomId, newestTs);
      }, { filter: `roomId = "${roomId}"` as any });
    // PocketBase returns a function to unsubscribe
    this.roomIdToUnsubscribe.set(roomId, unsub as unknown as () => void);
  }

  unsubscribeFromRoom(roomId: string): void {
    const unsub = this.roomIdToUnsubscribe.get(roomId);
    if (unsub) {
      try { unsub(); } catch {}
      this.roomIdToUnsubscribe.delete(roomId);
    }
  }

  async pull(roomId: string): Promise<number> {
    const since = this.lastPulledAtPerRoom.get(roomId);
    const filter = since ? `roomId = "${roomId}" && createdAtMs > ${since}` : `roomId = "${roomId}"`;
    const page = await this.pb.collection("messages").getList(1, 200, { filter, sort: "-createdAtMs" });
    const remote = page.items as any[];
    if (remote.length === 0) return since || 0;

    await database.write(async () => {
      for (const m of remote) {
        await this.upsertRemoteRecord(roomId, m);
      }
    });

    const newestTs = Math.max(...remote.map((m) => m.createdAtMs as number));
    this.lastPulledAtPerRoom.set(roomId, newestTs);
    return newestTs;
  }

  async push(roomId: string, message: Message): Promise<void> {
    try {
      await this.pb.collection('messages').create({
        roomId,
        from: message.from,
        type: message.type,
        content: message.content,
        createdAtMs: typeof message.createdAt === 'number' ? message.createdAt : new Date(message.createdAt).getTime(),
        editedAtMs: message.editedAt ? (typeof message.editedAt === 'number' ? message.editedAt : new Date(message.editedAt).getTime()) : null,
        status: message.status,
        refMessageId: message.referenceMessage?.referenceMessageId,
        refType: message.referenceMessage?.type,
        refContent: message.referenceMessage?.content,
      });
    } catch {}
    await this.pull(roomId);
  }
}
