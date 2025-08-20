import type { Message, MessageStatus } from "@chat-sdk-ui/types";

export interface MessageRepository {
  getMessages(roomId: string): Promise<Message[]>;
  subscribe(roomId: string, cb: (messages: Message[]) => void): () => void;
  addMessage(roomId: string, message: Message): Promise<void>;
  upsertMessages(roomId: string, messages: Message[]): Promise<void>;
  updateStatus(messageId: string, status: MessageStatus): Promise<void>;
}
