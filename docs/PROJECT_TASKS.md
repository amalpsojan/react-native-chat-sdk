# 🗂️ Project Tasks, Progress & Guidelines

> This file tracks implementation tasks, current status, project rules, and known library caveats for the Chat SDK.

---

## 📋 Task List

| ID | Description | Status |
|----|-------------|--------|
| task_chatwindow_ui | Build core **ChatWindow** UI container | ✅ completed |
| task_message_list | Implement virtualized **Message List** component | ✅ completed |
| task_message_input | Create **Message Input** bar with text & attachment support | ✅ completed |
| task_context_menu | Add **Contextual Menu** actions (reply, copy, delete, …) | ⏳ pending |
| task_custom_renderers | Provide **custom renderers** for every `MessageType` | ⏳ pending |
| task_theming | Implement **theming system** (colors, fonts, spacing) | 🔄 in-progress |
| task_accessibility | Add **accessibility & localization** features | ⏳ pending |
| task_performance | Performance optimisations (memoisation & virtualisation) | ✅ completed |
| task_examples | Create **example integration** & storybook demos | 🔄 in-progress |
| task_testing | Setup **testing (unit & e2e)** and linter configs | ⏳ pending |

> Status Legend: ✅ completed · 🔄 in-progress · ⏳ pending · 🚫 blocked

---

## 🛠️ Process / Rules

1. **Docs-first**: Finalise documentation _before_ writing production code.
2. **Type Safety**: Use TypeScript everywhere; keep `ContentType`, `MessageType`, etc. in sync with docs.
3. **Expo Friendly**: Avoid native modules that require ejecting; stick to Expo-compatible libs.
4. **Atomic Commits**: One feature or fix per commit; include a descriptive message.
5. **Testing Requirement**: Every new component must have unit tests; user-flows require e2e tests.
6. **Accessibility**: Meet WCAG AA where applicable; ensure screen-reader labels.
7. **Performance**: Default to memoised components and virtualised lists.
8. **Continuous Review**: Update this task table and the `/TODO` list (managed by the assistant) as progress is made.

---

## ⚠️ Known Library Considerations

| Library | Version | Issue / Note | Workaround |
|---------|---------|--------------|-----------|
| `react-native-reanimated@^3` | Expo SDK 53 | Some animations flicker on Android when combined with `expo-router` | Use `useAnimatedReaction` + `React.memo` wrapper; track upstream issue.#
| `react-native-gesture-handler@~2.24` | Expo SDK 53 | Needs `<GestureHandlerRootView>` at root to avoid "Unable to find root view" error | Already wrapped in `_layout.tsx`; document for consumers. |
| `react-native-web` | ~0.20 | `Reanimated` web support still experimental | Disable heavy animations when `Platform.OS === 'web'`. |
| `react-native-keyboard-controller` | ^1.17.5 | Transparent space between input and keyboard | Use Animated.View with translateY transformation based on keyboard height |

> Keep this list up-to-date as you discover new quirks.

---

## 🚧 Progress Log

### 2023-11-01
- Created initial project structure and documentation
- Set up basic component architecture

### 2023-11-15
- Implemented core ChatWindow container component
- Added MessagesList with FlatList virtualization
- Created basic MessageBubble component for text messages

### 2023-11-30
- Implemented InputToolbar with text input and send button
- Added keyboard handling with react-native-keyboard-controller
- Fixed issue with keyboard covering input field using useReanimatedKeyboardAnimation
- Implemented auto-dismissal of keyboard after sending message

### Current Status
- Core chat UI components are functional
- Basic message sending and display working
- Keyboard handling optimized with animations
- Need to implement: contextual menu, custom renderers, accessibility features, and testing 