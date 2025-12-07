import React from 'react';
import { ArrowLeft, MoreVertical } from 'lucide-react';
import { UserProfile } from '../types';

interface ChatHeaderProps {
  user: UserProfile;
  onBack: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ user, onBack }) => {
  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center px-4 justify-between shadow-sm sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <button 
          onClick={onBack}
          className="text-gray-500 hover:text-gray-700 p-1 -ml-1"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        
        <div className="relative">
          <img 
            src={user.avatarUrl} 
            alt={user.name} 
            className="w-10 h-10 rounded-full object-cover border border-gray-100"
          />
          {user.isOnline && (
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#4caf50] border-2 border-white rounded-full"></div>
          )}
        </div>

        <div className="flex flex-col justify-center">
          <div className="flex items-baseline gap-1">
            <h2 className="text-gray-900 font-bold text-sm">{user.name}</h2>
            <span className="text-gray-500 text-xs font-normal">{user.age}</span>
          </div>
          <span className="text-gray-400 text-xs">
            {typeof user.distance === 'number' ? `${user.distance} km daleko` : user.distance}
          </span>
        </div>
      </div>

      <button className="text-gray-400 hover:text-gray-600">
        <MoreVertical className="w-5 h-5" />
      </button>
    </div>
  );
};