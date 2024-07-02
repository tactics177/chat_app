import React, { useEffect, useState } from 'react';
import { getUsernameById } from '../services/userCache';
import { Message } from '../types/message';

interface MessageListProps {
  messages: Message[];
  token: string;
}

const MessageList: React.FC<MessageListProps> = ({ messages, token }) => {
  const [usernames, setUsernames] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchUsernames = async () => {
      const newUsernameMap: { [key: string]: string } = {};

      for (const message of messages) {
        if (!usernames[message.senderId]) {
          const username = await getUsernameById(message.senderId, token);
          newUsernameMap[message.senderId] = username;
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
    <div className="container mt-4">
      <div className="card">
        <div className="card-header">
          <h5 className="mb-0">Messages</h5>
        </div>
        <div className="card-body">
          {messages.map((message, index) => (
            <div key={index} className="mb-2">
              <div className="d-flex justify-content-between">
                <span className="font-weight-bold">{usernames[message.senderId] || message.senderId}:</span>
                <span className="text-muted small">{new Date(message.timestamp ?? "").toLocaleString()}</span>
              </div>
              <p className="mb-0">{message.content}</p>
              <hr className="my-1" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MessageList;
