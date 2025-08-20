import type { Message } from "@chat-sdk-ui/types";
import type { PBClient } from "./pbClient";

type ListResponse<T> = {
  page: number;
  perPage: number;
  totalItems: number;
  items: any[];
};

export async function loadHistory(
  pb: PBClient,
  roomId: string,
  limit = 50
): Promise<Message[]> {
  await pb.ensureAuth();
  const res = (await pb.sdk.collection("messages").getList(1, limit, {
    query: { filter: `roomId = "${roomId}"`, sort: "createdAtMs" },
  })) as unknown as ListResponse<any>;

  const user = pb.sdk.authStore.record as any;
  const userId = user?.id;
  return res.items.map((r: any) => ({
    id: r.id,
    from: r.from,
    isReceived: r.from !== userId,
    createdAt: r.createdAtMs ?? Date.now(),
    editedAt: r.editedAtMs,
    status: r.status,
    type: r.type,
    content: r.content,
  }));
}

export async function sendText(
  pb: PBClient,
  roomId: string,
  text: string
): Promise<void> {
  await pb.ensureAuth();
  const user = pb.sdk.authStore.record as any;
  const userId = user?.id;
  if (!userId) {
    console.error("[chat-backend] missing auth record; abort send");
    throw new Error("Not authenticated");
  }
  const payload = {
    roomId,
    from: userId,
    type: "text",
    content: { text },
    createdAtMs: Date.now(),
    status: "sent",
  } as any;
  console.log("[chat-backend] send payload", payload);
  try {
    await pb.sdk.collection("messages").create(payload);
  } catch (e: any) {
    const details = (e?.data?.data || e?.response?.data || e) as any;
    const msg = e?.data?.message || e?.message || "send failed";
    console.error("[chat-backend] send error", msg, details);
    throw e;
  }
}

/** Send any message type supported by the Chat SDK. */
export async function sendMessage(
  pb: PBClient,
  roomId: string,
  input: Pick<Message, "type" | "content"> & {
    status?: Message["status"];
    editedAtMs?: number;
    refMessageId?: string;
    refType?: string;
    refContent?: any;
  }
): Promise<void> {
  await pb.ensureAuth();
  const user = pb.sdk.authStore.record as any;
  const userId = user?.id;
  if (!userId) throw new Error("Not authenticated");
  const payload: any = {
    roomId,
    from: userId,
    type: input.type,
    content: input.content,
    createdAtMs: Date.now(),
    status: input.status ?? "sent",
  };
  if (input.editedAtMs) payload.editedAtMs = input.editedAtMs;
  if (input.refMessageId) payload.refMessageId = input.refMessageId;
  if (input.refType) payload.refType = input.refType;
  if (typeof input.refContent !== "undefined")
    payload.refContent = input.refContent;
  console.log("[chat-backend] send payload", payload);
  await pb.sdk
    .collection("messages")
    .create(payload)
    .catch((e: any) => {
      console.error("[chat-backend] send error", e);
      throw e;
    });
}

export async function subscribeMessages(
  pb: PBClient,
  roomId: string,
  onCreate: (m: Message) => void
): Promise<() => Promise<void>> {
  await pb.ensureAuth();
  const user = pb.sdk.authStore.record as any;
  const userId = user?.id;
  return pb.sdk.collection("messages").subscribe("*", (e: any) => {
    const rec = e?.record;
    if (!rec || rec.roomId !== roomId) return;
    if (e.action === "create") {
      onCreate({
        id: rec.id,
        from: rec.from,
        isReceived: rec.from !== userId,
        createdAt: rec.createdAtMs ?? Date.now(),
        editedAt: rec.editedAtMs,
        status: rec.status,
        type: rec.type,
        content: rec.content,
      });
    }
  });
}
