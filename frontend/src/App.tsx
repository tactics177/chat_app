import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MessageList from './components/MessageList';
import MessageInput from './components/MessageInput';
import UserSidebar from './components/UserSidebar';
import { getMessages, getUserByUsername, sendMessage } from './services/api';
import { connect, disconnect } from './services/websocket';
import { Message } from './types/message';
import LoginForm from './components/LoginForm';
import Signup from './components/Signup';
import './App.css'; // Import custom CSS for additional styling

const ChatApp: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [token, setToken] = useState<string | null>(localStorage.getItem('jwtToken'));
  const [username, setUsername] = useState<string | null>(localStorage.getItem('username'));
  const [userId, setUserId] = useState<string | null>(localStorage.getItem('userId'));
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUsername, setSelectedUsername] = useState<string | null>(null);

  const addMessage = (newMessage: Message) => {
    if (newMessage && newMessage.id && newMessage.content && newMessage.timestamp) {
      setMessages((prevMessages) => {
        if (prevMessages.some((message) => message.id === newMessage.id)) {
          return prevMessages;
        }
        return [...prevMessages, newMessage];
      });
    }
  };

  useEffect(() => {
    if (token && username) {
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
    if (token && userId && selectedUserId) {
      const fetchMessages = async () => {
        try {
          const fetchedMessages = await getMessages(userId, selectedUserId, token);
          setMessages(fetchedMessages);
        } catch (error) {
          console.error('Error fetching messages', error);
        }
      };

      fetchMessages();

      connect(
        (message: Message) => {
          addMessage(message);
        }
      );

      return () => {
        disconnect();
      };
    }
  }, [token, userId, selectedUserId]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || !token || !userId || !selectedUserId) {
      return;
    }

    const message: Message = {
      senderId: userId,
      receiverId: selectedUserId,
      content: content.trim(),
      timestamp: new Date()
    };

    try {
      const sentMessage = await sendMessage(message, token);
      addMessage(sentMessage);
    } catch (error) {
      console.error('Error sending message', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    setToken(null);
    setUsername(null);
    setUserId(null);
    setSelectedUserId(null);
    setSelectedUsername(null);
  };

  const handleSelectUser = (userId: string, username: string) => {
    setSelectedUserId(userId);
    setSelectedUsername(username);
  };

  return (
    <div className="app">
      <header className="header bg-primary text-white p-3 d-flex justify-content-between align-items-center">
        <div>
          <h1 className="mb-0">Chat App</h1>
        </div>
        {token && (
          <div className="d-flex align-items-center">
            <i className="fas fa-user-circle mr-2"></i>
            <span className="mr-3">{username}</span>
            <button onClick={handleLogout} className="btn btn-secondary">Logout</button>
          </div>
        )}
      </header>
      {!token ? (
        <LoginForm onLogin={(token, username, userId) => {
          setToken(token);
          setUsername(username);
          setUserId(userId);
        }} />
      ) : (
        <div className="chat-container d-flex">
          <div className="sidebar bg-dark text-white p-3">
            <h5>Users</h5>
            <UserSidebar token={token} onSelectUser={handleSelectUser} />
          </div>
          <div className="chat flex-grow-1 p-3">
            {selectedUserId ? (
              <>
                <h2>Conversation with {selectedUsername}</h2>
                <MessageList messages={messages} token={token} currentUserId={userId} />
                <MessageInput onSendMessage={handleSendMessage} />
              </>
            ) : (
              <p>Select a user to start a conversation</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginForm onLogin={() => {}} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<ChatApp />} />
      </Routes>
    </Router>
  );
};

export default App;
