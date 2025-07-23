// Chat SDK minimal type definitions – version 0.1

export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  DOCUMENT = 'document',
  LOCATION = 'location',
  CONTACT = 'contact',
  INTERACTIVE = 'interactive',
  TEMPLATE = 'template',
  STICKER = 'sticker',
  ORDER = 'order',
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

export interface Message {
  id: string;
  from: string;
  isReceived: boolean;
  type: MessageType;
  content: TextContent | SystemContent | ImageContent | VideoContent | AudioContent | DocumentContent; // Will add more specific types as we implement them
  createdAt: Date | string | number;
  editedAt?: Date | string | number;
  status?: 'pending' | 'sent' | 'delivered' | 'read' | 'failed';
}

export interface ChatWindowProps {
  messages: Message[];
  currentUserId: string;

  onSendMessage: (message: Partial<Message>) => void;
  onDeleteMessage?: (messageId: string) => void;
  onEditMessage?: (messageId: string, newText: string) => void;
  onRetryMessage?: (message: Message) => void;
  onLoadEarlier?: () => void;

  // Later: typingIndicator, theme, customRenderers, etc.
} 