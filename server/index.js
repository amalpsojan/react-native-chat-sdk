'use strict';

const path = require('path');
const express = require('express');
const http = require('http');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '.env') });

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const { Server } = require('socket.io');

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

const PORT = process.env.PORT || 4000;

// Online presence tracking
const onlineUsers = new Map(); // socket.id -> { userId, rooms: Set<string> }
const roomToUsers = new Map(); // roomId -> Set<userId>

function joinRoom(socket, roomId, userId) {
  socket.join(roomId);
  const socketState = onlineUsers.get(socket.id) || { userId, rooms: new Set() };
  socketState.userId = userId;
  socketState.rooms.add(roomId);
  onlineUsers.set(socket.id, socketState);

  if (!roomToUsers.has(roomId)) roomToUsers.set(roomId, new Set());
  roomToUsers.get(roomId).add(userId);
  io.to(roomId).emit('presence:update', Array.from(roomToUsers.get(roomId)));
}

function leaveRoom(socket, roomId) {
  socket.leave(roomId);
  const socketState = onlineUsers.get(socket.id);
  if (!socketState) return;
  socketState.rooms.delete(roomId);
  if (roomToUsers.has(roomId)) {
    roomToUsers.get(roomId).delete(socketState.userId);
    if (roomToUsers.get(roomId).size === 0) roomToUsers.delete(roomId);
  }
  io.to(roomId).emit('presence:update', Array.from(roomToUsers.get(roomId) || []));
}

io.on('connection', (socket) => {
  // Join a chat room
  socket.on('join', ({ roomId, userId }) => {
    if (!roomId || !userId) return;
    joinRoom(socket, roomId, userId);
    socket.emit('joined', { roomId });
  });

  // Leave a chat room
  socket.on('leave', ({ roomId }) => {
    if (!roomId) return;
    leaveRoom(socket, roomId);
    socket.emit('left', { roomId });
  });

  // Typing indicators
  socket.on('typing', ({ roomId, userId }) => {
    if (!roomId || !userId) return;
    socket.to(roomId).emit('typing', { userId });
  });
  socket.on('stopTyping', ({ roomId, userId }) => {
    if (!roomId || !userId) return;
    socket.to(roomId).emit('stopTyping', { userId });
  });

  // Send a new chat message
  socket.on('message:send', ({ roomId, message }) => {
    if (!roomId || !message) return;
    const enriched = {
      id: message.id || `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      createdAt: message.createdAt || new Date().toISOString(),
      ...message,
    };
    io.to(roomId).emit('message:new', enriched);
  });

  // Delivery/read receipts
  socket.on('message:delivered', ({ roomId, messageId, userId }) => {
    if (!roomId || !messageId || !userId) return;
    socket.to(roomId).emit('message:delivered', { messageId, userId });
  });
  socket.on('message:read', ({ roomId, messageId, userId }) => {
    if (!roomId || !messageId || !userId) return;
    socket.to(roomId).emit('message:read', { messageId, userId });
  });

  // Cleanup on disconnect
  socket.on('disconnect', () => {
    const socketState = onlineUsers.get(socket.id);
    if (socketState) {
      for (const roomId of socketState.rooms) {
        if (roomToUsers.has(roomId)) {
          roomToUsers.get(roomId).delete(socketState.userId);
          if (roomToUsers.get(roomId).size === 0) roomToUsers.delete(roomId);
          io.to(roomId).emit('presence:update', Array.from(roomToUsers.get(roomId) || []));
        }
      }
      onlineUsers.delete(socket.id);
    }
  });
});

// Simple health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Socket.IO server running on http://localhost:${PORT}`);
}); 