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

// Text message content
export interface TextContent {
  text: string;
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


export interface Message {
  id: string;
  from: string;
  isReceived: boolean;
  type: MessageType;
  content: TextContent | SystemContent | any; // Will add more specific types as we implement them
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