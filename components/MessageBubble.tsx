import React from 'react';
import { Message, UserProfile } from '../types';

interface MessageBubbleProps {
  message: Message;
  user: UserProfile;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, user }) => {
  const isMe = message.sender === 'user';

  return (
    <div className={`flex w-full mb-4 ${isMe ? 'justify-end' : 'justify-start'}`}>
      {!isMe && (
        <img 
          src={user.avatarUrl} 
          alt={user.name} 
          className="w-8 h-8 rounded-full object-cover mr-2 self-end mb-1" 
        />
      )}
      <div 
        className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm leading-relaxed ${
          isMe 
            ? 'bg-[#8c67a8] text-white rounded-br-none' 
            : 'bg-gray-100 text-gray-800 rounded-bl-none'
        }`}
      >
        {message.text}
      </div>
    </div>
  );
};
