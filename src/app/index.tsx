import { ChatSDK } from "@/components";
import { Message, MessageType, TextContent } from "@/components/chat-sdk/types";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Chat() {
  const currentUserId = "user-1";
  
  // Generate sample messages
  const generateMessages = () => {
    const result: Message[] = [];
    
    // Sample conversation content to make testing more realistic
    const userMessages = [
      "Hey, how are you doing today?",
      "I was thinking about that project we discussed last week.",
      "Did you get a chance to look at the designs I sent?",
      "What do you think about meeting tomorrow to discuss the next steps?",
      "I'm free anytime after 2pm if that works for you.",
      "Great! I'll send a calendar invite shortly.",
      "By the way, have you seen the latest updates to the framework?",
      "They added some really cool new features that might help us.",
      "I'll send you the link so you can check it out.",
      "Let me know what you think!",
      "Should we include the marketing team in our next meeting?",
      "I think they'd have some valuable input on the user acquisition strategy.",
      "Also, I finished the report you asked for. I'll email it to you in a bit.",
      "Do you need anything else from me before the presentation?",
      "I can help prepare some slides if needed.",
    ];
    
    const otherUserMessages = [
      "Hi! I'm doing well, thanks for asking. How about you?",
      "Yes, I've been thinking about it too. I have some ideas to share.",
      "I did review the designs. They look great overall!",
      "Tomorrow works for me. How about 3pm?",
      "Perfect! Looking forward to it.",
      "No, I haven't seen them yet. What's new?",
      "That sounds really promising!",
      "Thanks, I'll take a look at it tonight.",
      "I think including marketing is a great idea.",
      "They've been asking to be more involved in the early stages.",
      "The report isn't urgent, but it would be helpful to have before Friday.",
      "I think we're good for the presentation, but maybe we could use some more user testimonials?",
      "Thanks for offering to help with the slides. That would be great!",
      "Let's touch base again after the meeting tomorrow.",
      "Have a great evening!",
    ];
    
    // Long messages for testing text wrapping
    const longMessages = [
      "I've been researching the market trends for our industry and found some interesting patterns that might affect our strategy. The data shows that users are increasingly looking for integrated solutions rather than standalone products. This could be an opportunity for us to expand our offering and create a more comprehensive ecosystem. What do you think about pivoting slightly to address this trend?",
      "The technical requirements for the new feature are more complex than we initially estimated. After discussing with the development team, we realized we need to refactor some of the core components before we can implement it. This might push our timeline back by about two weeks, but it will result in a more stable and scalable solution in the long run. Should we adjust the roadmap or try to find a way to stick to the original schedule?",
      "I attended the conference last weekend and had the chance to speak with several industry experts. The consensus seems to be that AI integration is becoming essential for products in our space. Many competitors are already working on implementing machine learning models to enhance user experience. We should probably start exploring options for how we can incorporate similar technologies into our platform without compromising on performance or privacy.",
    ];
    
    // Generate messages across multiple days
    // Today
    const today = new Date();
    today.setHours(9, 0, 0, 0); // Start at 9 AM today
    
    // Yesterday
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Two days ago
    const twoDaysAgo = new Date(today);
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    
    // Last week
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);
    
    // Last month
    const lastMonth = new Date(today);
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    
    // Create message batches for different days
    const createMessageBatch = (baseDate: Date, count: number, startIndex: number) => {
      const baseTime = baseDate.getTime();
      
      for (let i = 0; i < count; i++) {
        const index = startIndex + i;
        const isFromMe = index % 2 === 0;
        // Add messages with increasing timestamps (5 minutes apart)
        const createdAt = baseTime + (i * 5 * 60 * 1000);
        
        // Determine status for outgoing messages
        let status: Message['status'] = 'sent';
        if (isFromMe) {
          if (baseDate === today) {
            if (i < 3) status = 'sent';
            else if (i < 6) status = 'delivered';
            else status = 'read';
          } else {
            status = 'read'; // Older messages are all read
          }
        }
        
        // Add editedAt for some messages
        let editedAt: number | undefined = undefined;
        if (i % 7 === 0 && i > 0) {
          // Message was edited 10 minutes after creation
          editedAt = createdAt + (10 * 60 * 1000);
        }
        
        // Select message content based on index
        let messageContent: string;
        
        if (i % 15 === 0 && i > 0) {
          // Every 15th message is a long message
          messageContent = longMessages[i % longMessages.length];
        } else {
          // Regular messages from the sample arrays
          messageContent = isFromMe 
            ? userMessages[i % userMessages.length] 
            : otherUserMessages[i % otherUserMessages.length];
        }
        
        // Add edited indicator to edited messages
        if (editedAt) {
          messageContent += ' (edited)';
        }
        
        // Add a failed message occasionally
        if (isFromMe && i === 5 && baseDate === today) {
          status = 'failed';
        }
        
        // Add a sending message at the end of today's messages
        if (isFromMe && i === count - 2 && baseDate === today) {
          status = 'sending';
        }
        
        result.push({
          id: `msg-${index}`,
          from: isFromMe ? "user-1" : "user-2",
          isReceived: !isFromMe,
          type: MessageType.TEXT,
          content: {
            text: messageContent
          } as TextContent,
          createdAt: createdAt,
          editedAt: editedAt,
          status: status,
        });
      }
    };
    
    // Create message batches for different time periods
    createMessageBatch(lastMonth, 10, 1); // 10 messages from last month
    createMessageBatch(lastWeek, 15, 11); // 15 messages from last week
    createMessageBatch(twoDaysAgo, 20, 26); // 20 messages from two days ago
    createMessageBatch(yesterday, 25, 46); // 25 messages from yesterday
    createMessageBatch(today, 30, 71); // 30 messages from today
    
    return result;
  };

  const [messages, setMessages] = useState<Message[]>(generateMessages());

  const handleSend = (partial: Partial<Message>) => {
    const now = Date.now();
    const newMsg: Message = {
      id: now.toString(),
      from: currentUserId,
      isReceived: false,
      type: partial.type || MessageType.TEXT,
      content: partial.content || { text: "" },
      createdAt: now,
      status: "sent",
    };
    // Add new message at the end (FlatList will reverse it with inverted prop)
    setMessages((prev) => [...prev, newMsg]);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ChatSDK
        messages={messages}
        currentUserId={currentUserId}
        onSendMessage={handleSend}
      />
    </SafeAreaView>
  );
}