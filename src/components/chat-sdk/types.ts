// Chat SDK minimal type definitions – version 0.1

export type MessageType =
  | 'text'
  | 'image'
  | 'video'
  | 'audio'
  | 'document'
  | 'location'
  | 'contact'
  | 'interactive'
  | 'template'
  | 'sticker'
  | 'order'
  | 'system';

export interface Message {
  id: string;
  from: string;
  isReceived: boolean;
  type: MessageType;
  content: any; // For now – will be strong-typed later
  status?: 'queued' | 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
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