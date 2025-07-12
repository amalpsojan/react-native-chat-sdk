# 🗂️ Project Tasks, Progress & Guidelines

> This file tracks implementation tasks, current status, project rules, and known library caveats for the Chat SDK.

---

## 📋 Task List

| ID | Description | Status |
|----|-------------|--------|
| task_chatwindow_ui | Build core **ChatWindow** UI container | ⏳ pending |
| task_message_list | Implement virtualized **Message List** component | ⏳ pending |
| task_message_input | Create **Message Input** bar with text & attachment support | ⏳ pending |
| task_context_menu | Add **Contextual Menu** actions (reply, copy, delete, …) | ⏳ pending |
| task_custom_renderers | Provide **custom renderers** for every `MessageType` | ⏳ pending |
| task_theming | Implement **theming system** (colors, fonts, spacing) | ⏳ pending |
| task_accessibility | Add **accessibility & localization** features | ⏳ pending |
| task_performance | Performance optimisations (memoisation & virtualisation) | ⏳ pending |
| task_examples | Create **example integration** & storybook demos | ⏳ pending |
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

> Keep this list up-to-date as you discover new quirks.

---

## 🚧 Progress Log

*Initial file created – all tasks pending.*

Update this section with daily/weekly notes on what moved forward, what’s blocked, and next steps. 