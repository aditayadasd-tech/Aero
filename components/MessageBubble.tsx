
import React from 'react';
import { Message, Role } from '../types';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === Role.USER;

  return (
    <div className={`flex w-full mb-6 animate-in fade-in slide-in-from-bottom-2 duration-300 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[85%] sm:max-w-[70%] px-5 py-3 rounded-2xl text-sm sm:text-base leading-relaxed ${
        isUser 
          ? 'bg-blue-600 text-white rounded-br-none shadow-lg shadow-blue-900/20' 
          : 'glass text-blue-50 rounded-bl-none border-blue-500/10'
      }`}>
        <p className="whitespace-pre-wrap">{message.content}</p>
        <div className={`text-[10px] mt-2 opacity-50 flex ${isUser ? 'justify-end' : 'justify-start'}`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
