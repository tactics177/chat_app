import React from 'react';
import { Message } from '../types/message';

interface MessageListProps {
  messages: Message[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
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
                <span className="font-weight-bold">{message.senderId}:</span>
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
