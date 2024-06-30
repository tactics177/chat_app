import React, { useEffect, useState } from 'react';
import MessageList from './components/MessageList';
import MessageInput from './components/MessageInput';
import { getMessages, sendMessage } from './services/api';
import { connect, disconnect } from './services/websocket';
import { Message } from './types/message';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const userId = '668174f7ca0ef80067939406'; // Replace with actual user ID

  // Function to add a new message, ensuring no duplicates
  const addMessage = (newMessage: Message) => {
    setMessages((prevMessages) => {
      // Check if the message already exists
      if (prevMessages.some((message) => message.id === newMessage.id)) {
        return prevMessages;
      }
      return [...prevMessages, newMessage];
    });
  };

  useEffect(() => {
    // Fetch initial messages
    const fetchMessages = async () => {
      try {
        const fetchedMessages = await getMessages(userId);
        console.log('Fetched messages:', fetchedMessages);
        setMessages(fetchedMessages);
      } catch (error) {
        console.error('Error fetching messages', error);
      }
    };

    fetchMessages();

    // Connect to WebSocket
    connect((message: Message) => {
      console.log('Received WebSocket message:', message);
      addMessage(message);
    });

    // Cleanup on component unmount
    return () => {
      disconnect();
    };
  }, [userId]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) {
      return; // Avoid sending empty messages
    }

    const message: Message = {
      senderId: userId,
      receiverId: '66817617ca0ef80067939408', // Replace with actual receiver ID
      content: content.trim(), // Trim content to remove extra spaces
    };

    try {
      const sentMessage = await sendMessage(message); // Use the HTTP client to send the message
      console.log('Sent message:', sentMessage);
      addMessage(sentMessage);
    } catch (error) {
      console.error('Error sending message', error);
    }
  };

  return (
    <div>
      <h1>Chat App</h1>
      <MessageList messages={messages} />
      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default App;
