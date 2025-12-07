import React from 'react';
import { Search, MessageCircle, Bell, Heart, User } from 'lucide-react';

export type ViewState = 'search' | 'list' | 'chat' | 'notifications' | 'likes' | 'profile';

interface NavbarProps {
  onNavigate: (view: ViewState) => void;
  activeView: ViewState;
  unreadCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, activeView, unreadCount = 0 }) => {
  
  const getTabClass = (viewName: ViewState) => {
    // Treat 'chat' as part of the 'list' tab group for visual indication
    const isActive = activeView === viewName || (viewName === 'list' && activeView === 'chat');
    
    return `flex-1 flex items-center justify-center h-full relative cursor-pointer border-b-4 transition-all ${
      isActive 
        ? 'bg-[#5a325b] border-[#bfa3d1]' 
        : 'bg-[#462547] border-transparent hover:bg-[#5a325b]'
    }`;
  };

  const getIconColor = (viewName: ViewState) => {
    const isActive = activeView === viewName || (viewName === 'list' && activeView === 'chat');
    return isActive ? "text-white fill-white" : "text-[#a88aa9] fill-[#a88aa9]";
  };

  return (
    <nav className="h-14 bg-[#462547] flex items-center justify-between px-0 relative z-50 shadow-md shrink-0">
      {/* Search */}
      <div 
        onClick={() => onNavigate('search')}
        className={getTabClass('search')}
      >
        <Search className={`${getIconColor('search')} w-6 h-6`} />
      </div>

      {/* Messages */}
      <div 
        onClick={() => onNavigate('list')}
        className={getTabClass('list')}
      >
        <div className="relative">
          <MessageCircle className={`${getIconColor('list')} w-7 h-7`} />
          {unreadCount > 0 && (
            <div className="absolute -top-1 -right-2 bg-white text-[#8c67a8] text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center shadow-sm">
              {unreadCount > 99 ? '99+' : unreadCount}
            </div>
          )}
        </div>
      </div>

      {/* Notifications */}
      <div 
        onClick={() => onNavigate('notifications')}
        className={getTabClass('notifications')}
      >
        <div className="relative">
          <Bell className={`${getIconColor('notifications')} w-6 h-6`} />
          <div className="absolute -top-1 -right-1 bg-[#d65b75] text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
            13
          </div>
        </div>
      </div>

      {/* Likes */}
      <div 
        onClick={() => onNavigate('likes')}
        className={getTabClass('likes')}
      >
        <Heart className={`${getIconColor('likes')} w-6 h-6`} />
      </div>

      {/* Profile */}
      <div 
        onClick={() => onNavigate('profile')}
        className={getTabClass('profile')}
      >
        <User className={`${getIconColor('profile')} w-6 h-6`} />
      </div>
    </nav>
  );
};