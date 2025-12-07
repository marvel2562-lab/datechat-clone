import React, { useEffect, useState } from 'react';
import { Eye, Heart, X } from 'lucide-react';
import { Notification } from '../types';

interface NotificationToastProps {
  notification: Notification;
  onClose: () => void;
  onClick: () => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({ notification, onClose, onClick }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Small delay to allow enter animation
    requestAnimationFrame(() => setIsVisible(true));
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Wait for animation
  };

  return (
    <div 
      onClick={onClick}
      className={`fixed top-4 left-4 right-4 z-[100] bg-[#333333] text-white rounded-lg shadow-lg p-3 flex items-start gap-3 transition-all duration-300 transform cursor-pointer hover:bg-[#404040] ${
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
      }`}
    >
      <div className="relative shrink-0">
        <img 
          src={notification.avatarUrl} 
          alt={notification.user} 
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#5c9a5f] border-2 border-[#333333] rounded-full"></div>
      </div>

      <div className="flex-1 min-w-0 pt-0.5">
        <h4 className="font-bold text-sm mb-0.5">{notification.user}</h4>
        <div className="flex items-center gap-1.5 text-gray-300 text-sm">
          {notification.type === 'view' ? (
            <Eye className="w-4 h-4" />
          ) : (
            <Heart className="w-4 h-4 fill-white text-white" />
          )}
          <span className="truncate font-medium">{notification.text}</span>
        </div>
      </div>

      <button 
        onClick={(e) => {
          e.stopPropagation();
          handleClose();
        }}
        className="text-gray-400 hover:text-white transition-colors shrink-0 pt-1 p-1"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
};