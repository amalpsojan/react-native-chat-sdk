// Chat SDK minimal type definitions – version 0.1

import type { MessageRenderers } from '../components/Messages/Message';

export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  DOCUMENT = 'document',
  STICKER = 'sticker',
  SYSTEM = 'system',
}
// System message content
export interface SystemContent {
  system: SystemMessageInfo | SystemMessageReminder | SystemMessageMention;
}

// System message type info
export interface SystemMessageInfo {
  type: 'info'
  text: string;
}

export interface SystemMessageReminder {
  type: 'reminder'
  title: string;
  description: string;
}

export interface SystemMessageMention {
  type: 'mention'
  title: string;
  description: string;
}

// Text message content
export interface TextContent {
  text: string;
}

// Image message content
export interface ImageContent {
  image: string;
  caption: string;
}

// Sticker message content
export interface StickerContent {
  sticker: string;
}

// Video message content
export interface VideoContent {
  video: string;
  caption: string;
}

// Audio message content
export interface AudioContent {
  audio: string;
  voice?: boolean;
}

// Document message content
export interface DocumentContent {
  document: string;
  fileName: string;
  caption: string;
}

export interface MessageBase {
  id: string;
  from: string;
  isReceived: boolean;
  createdAt: Date | string | number;
  editedAt?: Date | string | number;
  status?: MessageStatus;
}

export type Message =
  | (MessageBase & { type: MessageType.TEXT; content: TextContent })
  | (MessageBase & { type: MessageType.SYSTEM; content: SystemContent })
  | (MessageBase & { type: MessageType.IMAGE; content: ImageContent })
  | (MessageBase & { type: MessageType.STICKER; content: StickerContent })
  | (MessageBase & { type: MessageType.VIDEO; content: VideoContent })
  | (MessageBase & { type: MessageType.AUDIO; content: AudioContent })
  | (MessageBase & { type: MessageType.DOCUMENT; content: DocumentContent });

export type MessageStatus = 'pending' | 'sent' | 'delivered' | 'read' | 'failed';

export interface ChatWindowProps {
  messages: Message[];
  currentUserId: string;
  onSendMessage: (message: Partial<Message>) => void;
  onDeleteMessage?: (messageId: string) => void;
  onEditMessage?: (messageId: string, newText: string) => void;
  onRetryMessage?: (message: Message) => void;
  onLoadEarlier?: () => void;
  messageRenderers?: MessageRenderers;
  // Later: typingIndicator, theme, customRenderers, etc.
} 