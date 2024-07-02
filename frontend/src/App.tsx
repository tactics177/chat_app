import React, { useEffect, useState } from 'react';
import MessageList from './components/MessageList';
import MessageInput from './components/MessageInput';
import { getMessages, getUserByUsername, sendMessage } from './services/api';
import { connect, disconnect } from './services/websocket';
import { Message } from './types/message';
import LoginForm from './components/LoginForm';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [token, setToken] = useState<string | null>(localStorage.getItem('jwtToken'));
  const [username, setUsername] = useState<string | null>(localStorage.getItem('username'));
  const [userId, setUserId] = useState<string | null>(null);

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
    if (token && username) {
      // Fetch user data to get the userId
      const fetchUserData = async () => {
        try {
          const user = await getUserByUsername(username, token);
          setUserId(user.id);
        } catch (error) {
          console.error('Error fetching user data', error);
        }
      };

      fetchUserData();
    }
  }, [token, username]);

  useEffect(() => {
    if (token && userId) {
      // Fetch initial messages
      const fetchMessages = async () => {
        try {
          const fetchedMessages = await getMessages(userId, token);
          console.log('Fetched messages:', fetchedMessages);
          setMessages(fetchedMessages);
        } catch (error) {
          console.error('Error fetching messages', error);
        }
      };

      fetchMessages();

      // Connect to WebSocket
      connect(
        (message: Message) => {
          console.log('Received WebSocket message:', message);
          addMessage(message);
        },
      );

      // Cleanup on component unmount
      return () => {
        disconnect();
      };
    }
  }, [token, userId]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || !token) {
      return; // Avoid sending empty messages or if not logged in
    }

    const message: Message = {
      senderId: userId!,
      receiverId: '66817617ca0ef80067939408', // Replace with actual receiver ID
      content: content.trim(), // Trim content to remove extra spaces
    };

    try {
      const sentMessage = await sendMessage(message, token); // Use the HTTP client to send the message
      console.log('Sent message:', sentMessage);
      addMessage(sentMessage);
    } catch (error) {
      console.error('Error sending message', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('username');
    setToken(null);
    setUsername(null);
    setUserId(null);
  };

  return (
    <div>
      <h1>Chat App</h1>
      {!token ? (
        <LoginForm onLogin={(token, username) => {
          setToken(token);
          setUsername(username);
        }} />
      ) : (
        <>
          <button onClick={handleLogout} className="btn btn-secondary">Logout</button>
          <MessageList messages={messages} token={token} />
          <MessageInput onSendMessage={handleSendMessage} />
        </>
      )}
    </div>
  );
};

export default App;
