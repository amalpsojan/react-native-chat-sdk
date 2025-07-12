# 📦 Chat SDK – React Native (Expo friendly)

A **re-usable, platform-agnostic Chat Window SDK** focused purely on UI for 1-to-1 messaging.  
Backend, storage, and real-time updates are entirely the host app's responsibility, so you stay in control of your data flow.

---

## Table of Contents
1. Features
2. Public API
3. Message Object
4. Expo Compatibility
5. Responsibilities of the Host App
6. Example Usage
7. Customisation & Theming
8. Accessibility & Localisation
9. Performance Notes
10. Keyboard Handling
11. Contributing

---

## 1. 🚀 Features

### ✅ Message Rendering
• Text, Image, Video, Audio, Document  
• Contact, Location, Sticker, Order, System, Deleted  
• Sender info (name, avatar, role)  
• Quoted-message previews (for replies)  
• Forwarded + deleted indicators  
• Status: *queued ⟶ sending ⟶ sent ⟶ delivered ⟶ read / failed*

### ✅ Message Input
• Text box + send button  
• Attachments (images, files, media)  
• Reply / Edit modes with cancel  
• Typing indicator display
• Auto-expanding input for long messages
• Keyboard-aware input that stays visible

### ✅ User Interactions
• Long-press → contextual menu: **Reply · Copy · Forward · Delete · Edit · Download**  
• Tap media to preview  
• Scroll to quoted message  
• Retry failed messages

### ✅ Performance
• Virtualised list (`RecyclerListView` / `FlatList`)  
• Lazy loading / infinite scroll via `onLoadEarlier`

### ✅ Customisation
• Theme colours, fonts, spacing, bubble styles  
• Toggle actions (enable/disable edit, reply, download, …)  
• Override renderers per message-type

### ✅ Accessibility & Localisation
• RTL layout  
• Screen-reader labels  
• Localised timestamps

---

## 2. 🧩 Public API

```ts
export interface ChatWindowProps {
  messages: Message[];                  // Messages to render
  currentUserId: string;                // Logged-in user ID

  onSendMessage:  (draft: Partial<Message>)                 => void;
  onDeleteMessage?: (messageId: string)                     => void;
  onEditMessage?:   (messageId: string, newText: string)    => void;
  onRetryMessage?:  (failedMessage: Message)                => void;
  onLoadEarlier?:   () => void;          // Pagination callback

  typingIndicator?: {
    isTyping: boolean;
    typingUserName?: string;
  };

  theme?: {
    bubbleColor?:      string;
    userBubbleColor?:  string;
    botBubbleColor?:   string;
    backgroundColor?:  string;
    textColor?:        string;
    fontFamily?:       string;
  };

  customRenderers?: Partial<{
    text:     (m: Message) => JSX.Element;
    image:    (m: Message) => JSX.Element;
    video:    (m: Message) => JSX.Element;
    audio:    (m: Message) => JSX.Element;
    document: (m: Message) => JSX.Element;
    system:   (m: Message) => JSX.Element;
  }>;
}
```

---

## 3. 🧱 Message Object

```ts
// Message "kind" alias
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

// ----------------------------------------------
// Content payload interfaces
// ----------------------------------------------
// Image payload
export interface ImageContent {
  uri: string;
  text?: string;              // Optional caption or alt text
}

// Video payload
export interface VideoContent {
  uri: string;
  text?: string;              // Optional caption/description
}

// Audio payload
export interface AudioContent {
  uri: string;
}

// Document / File payload
export interface DocumentContent {
  uri: string;
  fileName?: string;
  text?: string;              // Optional description
}

export interface ContactContent {
  text: string;   // Display text (e.g., contact name)
  phoneNumbers: Array<{
    name: string;
    phoneNumber: string;
  }>;
}

export interface LocationContent {
  latitude: number;
  longitude: number;
  address: string;
}

export interface InteractiveContent {
  title: string;
  description?: string;
  actions: Array<{
    label: string;
    payload: unknown;
  }>;
}

export interface TemplateContent {
  name: string;               // Template identifier
  variables?: unknown[];      // Runtime variables
}

export interface OrderContent {
  orderId: string;
  itemName: string;
  itemCount: number;
  price: number;
  currency: string;           // ISO 4217
}

export interface StickerContent {
  uri: string;
}

export interface SystemContent {
  text: string;
}

// Message content type alias
export type ContentType =
  | string
  | ImageContent
  | VideoContent
  | AudioContent
  | DocumentContent
  | ContactContent
  | LocationContent
  | InteractiveContent      // quick replies, buttons, etc.
  | TemplateContent         // pre-formatted message templates
  | OrderContent            // commerce orders
  | StickerContent
  | SystemContent;          // system notices / events

export interface Message {
  id: string;
  clientId?:   string;
  localOnly?:  boolean;

  from: string;
  isReceived: boolean;

  type: MessageType;      // ← uses the new alias

  content: ContentType;

  metadata?: Record<string, unknown>;

  createdAt:  number;
  editedAt?:  number;
  expiresAt?: number;

  replyTo?: string;
  quotedMessage?: {
    id: string;
    type: MessageType;
    content: ContentType;
    senderName?: string;
  };

  status: 'queued' | 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
  error?: string;

  deleted?: boolean;   // still available
  edited?:  boolean;   // indicates text was modified
  isForwarded?: boolean;

  senderInfo?: {
    id?:   string;   // now optional
    name?: string;
  };
}
```

---

## 4. 🧰 Expo Compatibility
The SDK relies only on Expo-compatible libraries (`react-native-gesture-handler`, `react-native-reanimated`, etc.).  
No need to eject or add native modules.

---

## 5. 📎 Responsibilities of the Host App
• **Networking / WebSocket / Push** – send & receive messages  
• **Persistence** – offline cache, MMKV, SQLite, etc.  
• **Media upload & download** – signed URLs, presigned S3, …  
• Pass updated `messages[]` props whenever data changes  
• Implement `onSendMessage`, `onEditMessage`, `onDeleteMessage`, etc.

---

## 6. 📚 Example Usage

```tsx
import ChatWindow from '@your-org/chat-sdk';

export default function ChatScreen() {
  const { messages, handleSend, handleDelete, handleEdit, handleRetry, loadOlder } = useChatLogic();

  return (
    <ChatWindow
      messages={messages}
      currentUserId="user-123"

      onSendMessage={handleSend}
      onDeleteMessage={handleDelete}
      onEditMessage={handleEdit}
      onRetryMessage={handleRetry}
      onLoadEarlier={loadOlder}

      typingIndicator={{ isTyping: true, typingUserName: 'Alice' }}

      theme={{
        userBubbleColor: '#DCF8C6',
        botBubbleColor:  '#EDEDED',
        backgroundColor: '#FFFFFF',
      }}
    />
  );
}
```

---

## 7. 🎨 Customisation & Theming
| Area            | Prop                                    | Notes                          |
|-----------------|-----------------------------------------|--------------------------------|
| Bubble colours  | `theme.userBubbleColor`<br>`theme.botBubbleColor` | Hex/RGB                       |
| Fonts           | `theme.fontFamily`                      | Use any loaded Expo font       |
| Custom render   | `customRenderers.text` (etc.)           | Return your own JSX            |
| Feature toggles | `showDelete`, `allowForward` *(coming)* | Planned granular flags         |

---

## 8. ♿ Accessibility & 🌐 Localisation
• **RTL**: Flexbox flips automatically; bubbles mirror.  
• **Screen readers**: `accessibilityLabel` / `role='text'`.  
• **Dates**: Pass your own formatting fn or rely on `Intl`.  

---

## 9. ⚡ Performance Notes
• Large lists virtualised via `FlatList` by default.  
• `onLoadEarlier()` paginates older messages.  
• Image/video thumbnails are memoised.  
• Components use React.memo to prevent unnecessary re-renders.

---

## 10. ⌨️ Keyboard Handling
The Chat SDK includes sophisticated keyboard handling to ensure a smooth user experience:

• **Auto-adjusting input**: Input toolbar automatically moves with the keyboard
• **Animated transitions**: Smooth animations when keyboard appears/disappears
• **Auto-expanding input**: Text input grows as user types longer messages (up to a maximum height)
• **Auto-dismissal**: Keyboard automatically dismisses after sending a message
• **Keyboard gap elimination**: Uses react-native-reanimated and react-native-keyboard-controller to eliminate gaps between input and keyboard

Implementation details:
```tsx
// Keyboard-aware input implementation
const InputToolbar = () => {
  // Get keyboard height using react-native-keyboard-controller
  const { height } = useReanimatedKeyboardAnimation();
  
  // Create animated style that moves with keyboard
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: height.value + (height.value > 0 ? 0 : 30) }],
  }));
  
  // Auto-dismiss keyboard when sending messages
  const handleSend = () => {
    // Send message logic
    Keyboard.dismiss();
  };
  
  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      {/* Input components */}
    </Animated.View>
  );
};
```

---

## 11. 🤝 Contributing
1. `yarn` – install deps  
2. `yarn dev` – run example app  
3. Lint & test before PRs: `yarn lint && yarn test`  

---

*Made with ❤️ & ☕ by the Chat SDK team.* 