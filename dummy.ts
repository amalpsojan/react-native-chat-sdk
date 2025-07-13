import { Message, MessageType } from "@/components/chat-sdk/types";

// Helper function to create dates for different days
const createDate = (daysAgo: number, hours: number = 12, minutes: number = 0) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  date.setHours(hours, minutes, 0, 0);
  return date.getTime();
};

export const messages: Message[] = [
  // Today's messages
  {
    id: "15",
    content: { text: "Perfect! See you there! " },
    createdAt: createDate(0, 14, 30), // Today 2:30 PM
    from: "user-1",
    isReceived: false,
    type: MessageType.TEXT,
    status: "read",
  },
  {
    id: "14",
    content: { text: "I'll bring the popcorn " },
    createdAt: createDate(0, 14, 25), // Today 2:25 PM
    from: "user-1",
    isReceived: false,
    type: MessageType.TEXT,
    status: "read",
  },
  {
    id: "13",
    content: { text: "Great idea!" },
    createdAt: createDate(0, 14, 20), // Today 2:20 PM
    from: "user-1",
    isReceived: false,
    type: MessageType.TEXT,
    status: "read",
  },
  {
    id: "12",
    content: { text: "Time to go to the movies!" },
    createdAt: createDate(0, 14, 15), // Today 2:15 PM
    from: "user-1",
    isReceived: false,
    type: MessageType.TEXT,
    status: "read",
  },
  {
    id: "11",
    content: { text: "��" },
    createdAt: createDate(0, 14, 10), // Today 2:10 PM
    from: "user-1",
    isReceived: false,
    type: MessageType.TEXT,
    status: "read",
  },
  {
    id: "10",
    content: { text: "😁" },
    createdAt: createDate(0, 14, 5), // Today 2:05 PM
    from: "user-2",
    isReceived: true,
    type: MessageType.TEXT,
  },
  {
    id: "9",
    content: { text: "Let's go to the movies!" },
    createdAt: createDate(0, 14, 0), // Today 2:00 PM
    from: "user-2",
    isReceived: true,
    type: MessageType.TEXT,
  },
  
  // Yesterday's messages
  {
    id: "8",
    content: { text: "Yes, I would like to go to the movies!" },
    createdAt: createDate(1, 16, 30), // Yesterday 4:30 PM
    from: "user-1",
    isReceived: false,
    type: MessageType.TEXT,
    status: "delivered",
  },
  {
    id: "7",
    content: { text: "Would you like to go to the movies?" },
    createdAt: createDate(1, 16, 25), // Yesterday 4:25 PM
    from: "user-2",
    isReceived: true,
    type: MessageType.TEXT,
  },
  {
    id: "6",
    content: { text: "I'm good, thank you!" },
    createdAt: createDate(1, 16, 20), // Yesterday 4:20 PM
    from: "user-2",
    isReceived: true,
    type: MessageType.TEXT,
  },
  
  // 3 days ago messages
  {
    id: "5",
    content: { text: "Nice to meet you, John!" },
    createdAt: createDate(3, 15, 45), // 3 days ago 3:45 PM
    from: "user-1",
    isReceived: false,
    type: MessageType.TEXT,
    status: "sent",
  },
  {
    id: "4",
    content: { text: "My name is John Doe" },
    createdAt: createDate(3, 15, 40), // 3 days ago 3:40 PM
    from: "user-2",
    isReceived: true,
    type: MessageType.TEXT,
  },
  {
    id: "3",
    content: { text: "What's your name?" },
    createdAt: createDate(3, 15, 35), // 3 days ago 3:35 PM
    from: "user-1",
    isReceived: false,
    type: MessageType.TEXT,
    status: "sent",
  },
  
  // 1 week ago messages
  {
    id: "2",
    content: { text: "I'm good, thank you!" },
    createdAt: createDate(7, 10, 30), // 1 week ago 10:30 AM
    from: "user-2",
    isReceived: true,
    type: MessageType.TEXT,
  },
  {
    id: "1",
    content: { text: "Hello, how are you?" },
    createdAt: createDate(7, 10, 25), // 1 week ago 10:25 AM
    from: "user-1",
    isReceived: false,
    type: MessageType.TEXT,
    status: "sent",
  },
];