
export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'match';
  timestamp: Date;
}

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  distance: number | string; // string to handle "Lišeň..."
  isOnline: boolean;
  avatarUrl: string;
}

export interface ChatListItem extends UserProfile {
  lastMessageTime: string;
  unreadCount?: number;
  specialNotification?: string; // For the "21" bell case
  isSystem?: boolean; // For Administrator
}

export interface Notification {
  id: string;
  user: string;
  avatarUrl: string;
  type: 'view' | 'like';
  text: string;
}
