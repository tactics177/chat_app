import React, { useEffect, useState } from 'react';
import { getUsernameById } from '../services/userCache';
import { Message } from '../types/message';
import '../styles/MessageList.css'; // Import custom CSS for additional styling

interface MessageListProps {
  messages: Message[];
  token: string;
  currentUserId: string | null;
}

const MessageList: React.FC<MessageListProps> = ({ messages, token, currentUserId }) => {
  const [usernames, setUsernames] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchUsernames = async () => {
      const newUsernameMap: { [key: string]: string } = {};

      for (const message of messages) {
        if (message.senderId && !usernames[message.senderId]) {
          const username = await getUsernameById(message.senderId, token);
          newUsernameMap[message.senderId] = username;
        }
        if (message.receiverId && !usernames[message.receiverId]) {
          const username = await getUsernameById(message.receiverId, token);
          newUsernameMap[message.receiverId] = username;
        }
      }

      setUsernames((prevUsernames) => ({
        ...prevUsernames,
        ...newUsernameMap,
      }));
    };

    fetchUsernames();
  }, [messages, token]);

  return (
    <div className="mt-4">
      <div className="card">
        <div className="card-header">
          <h5 className="mb-0">Messages</h5>
        </div>
        <div className="card-body">
          {messages.map((message, index) => (
            <div key={index} className="message-item mb-2">
              <div className="d-flex align-items-center">
                <i className="fas fa-user user-icon"></i>
                <span className={`font-weight-bold ${message.senderId === currentUserId ? 'sender-username' : 'receiver-username'}`}>
                  {usernames[message.senderId] || message.senderId}:
                </span>
              </div>
              <p className="mb-0">{message.content}</p>
              <div className="d-flex justify-content-between">
                <span className="text-muted small">{message.timestamp ? new Date(message.timestamp).toLocaleString() : "Invalid Date"}</span>
                <span className="text-muted small">To: {usernames[message.receiverId] || message.receiverId}</span>
              </div>
              <hr className="my-1" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MessageList;
