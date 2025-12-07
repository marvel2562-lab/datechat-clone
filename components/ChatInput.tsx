import React, { useState, useRef, useEffect } from 'react';
import { Smile } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, disabled }) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    // Auto-resize
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 100)}px`;
  };

  const hasText = message.trim().length > 0;

  return (
    // Changed: Removed 'sticky bottom-0'. Added shrink-0 and pb-[env(safe-area-inset-bottom)]
    <div className="bg-white border-t border-gray-200 px-3 py-2 flex items-center gap-2 z-50 shrink-0 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
      <button className="text-gray-400 hover:text-gray-600 p-1">
        <Smile className="w-6 h-6" />
      </button>
      
      <div className="flex-1 relative">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Napište zprávu"
          rows={1}
          className="w-full bg-transparent text-gray-800 placeholder-gray-400 text-sm resize-none focus:outline-none py-2 max-h-24 overflow-y-auto"
          disabled={disabled}
        />
      </div>

      <button 
        onClick={handleSubmit}
        disabled={disabled || !hasText}
        className={`px-4 py-1.5 rounded-full font-bold text-sm transition-colors ${
          hasText && !disabled 
            ? "bg-[#8c67a8] text-white hover:bg-[#6f4e85] shadow-sm" 
            : "bg-gray-200 text-gray-400 cursor-default"
        }`}
      >
        Odeslat
      </button>
    </div>
  );
};