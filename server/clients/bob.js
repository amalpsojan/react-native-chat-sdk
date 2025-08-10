'use strict';

const readline = require('readline');
const { io } = require('socket.io-client');

const SERVER_URL = process.env.SERVER_URL || 'http://localhost:4000';
const ROOM_ID = process.env.ROOM_ID || 'room-123';
const USER_ID = process.env.USER_ID || 'bob';

const socket = io(SERVER_URL, { transports: ['websocket'] });

socket.on('connect', () => {
  console.log(`Connected as ${USER_ID} to ${SERVER_URL}`);
  socket.emit('join', { roomId: ROOM_ID, userId: USER_ID });
  console.log(`Joined room ${ROOM_ID}. Type your message and press Enter.`);
});

socket.on('message:new', (msg) => {
  // Do not echo own messages as received
  if (msg.from === USER_ID) return;
  const ts = typeof msg.createdAt === 'number' ? new Date(msg.createdAt).toLocaleTimeString() : new Date(msg.createdAt).toLocaleTimeString();
  console.log(`\n[${ts}] ${msg.from}: ${msg.content?.text ?? '[non-text message]'}\n> `);
});

// Readline for input
const rl = readline.createInterface({ input: process.stdin, output: process.stdout, prompt: '> ' });
rl.prompt();

rl.on('line', (line) => {
  const text = line.trim();
  if (text.length === 0) {
    rl.prompt();
    return;
  }
  const now = Date.now();
  const message = {
    id: now.toString(),
    from: USER_ID,
    isReceived: false,
    type: 'text',
    content: { text },
    createdAt: now,
    status: 'sent',
  };
  socket.emit('message:send', { roomId: ROOM_ID, message });
  rl.prompt();
}).on('close', () => {
  console.log('Exiting...');
  socket.emit('leave', { roomId: ROOM_ID });
  socket.disconnect();
  process.exit(0);
}); 