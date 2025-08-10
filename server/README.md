# Chat App Socket.IO Server

## Setup
- Copy `.env.example` to `.env` and adjust values if needed.
- Install dependencies and run:

```sh
cd server
npm install
npm run dev
# or
npm start
```

The server listens on `http://localhost:4000` by default.

## Socket events
- `join` { roomId, userId }
- `leave` { roomId }
- `typing` { roomId, userId }
- `stopTyping` { roomId, userId }
- `message:send` { roomId, message }
- `message:new` { ...message }
- `message:delivered` { roomId, messageId, userId }
- `message:read` { roomId, messageId, userId }
- `presence:update` [userId]

## Health check
- `GET /health` → `{ status: 'ok' }`

## Notes
- Use your machine's LAN IP instead of `localhost` when testing on a physical device.
- CORS is open in dev. Tighten before production. 