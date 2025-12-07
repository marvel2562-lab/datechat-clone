import React from 'react';
import { ChatListItem } from '../types';
import { Bell } from 'lucide-react';

interface ChatListViewProps {
  chats: ChatListItem[];
  onChatSelect: (chat: ChatListItem) => void;
}

export const ChatListView: React.FC<ChatListViewProps> = ({ chats, onChatSelect }) => {
  return (
    <div className="flex-1 bg-[#f0f0f5] overflow-y-auto">
      {/* Date Separator */}
      <div className="bg-white py-1 flex justify-center border-b border-gray-100">
        <span className="text-gray-400 text-xs">Dnes</span>
      </div>

      <div className="divide-y divide-gray-200">
        {chats.map((chat) => (
          <div 
            key={chat.id} 
            onClick={() => onChatSelect(chat)}
            className="bg-[#f0eaf2] hover:bg-white active:bg-white transition-colors p-3 flex items-center gap-3 cursor-pointer"
          >
            <div className="relative shrink-0">
              <img 
                src={chat.avatarUrl} 
                alt={chat.name} 
                className="w-14 h-14 rounded-full object-cover"
              />
              {chat.isOnline && (
                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#4caf50] border-2 border-white rounded-full"></div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="font-bold text-gray-900 text-[15px]">{chat.name}</h3>
                <span className="text-gray-500 text-xs">{chat.lastMessageTime}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <p className="text-gray-500 text-xs truncate max-w-[80%]">
                  {typeof chat.distance === 'number' 
                    ? `${chat.distance} km daleko` 
                    : chat.distance}
                </p>
                
                {/* Badges */}
                {chat.specialNotification ? (
                   <div className="bg-[#8c67a8] text-white px-2 py-1 rounded-md flex items-center gap-1 shadow-sm">
                     <Bell className="w-3 h-3 fill-white" />
                     <span className="text-xs font-bold">{chat.specialNotification}</span>
                   </div>
                ) : chat.unreadCount ? (
                  <div className={`
                    ${chat.isSystem ? 'bg-[#9c27b0]' : 'bg-[#9c27b0]'} 
                    text-white text-xs font-bold min-w-[20px] h-5 rounded-full flex items-center justify-center px-1.5
                  `}>
                    {chat.unreadCount}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};