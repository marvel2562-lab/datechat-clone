import React, { useState, useRef, useEffect } from 'react';
import { Navbar, ViewState } from './components/Navbar';
import { ChatHeader } from './components/ChatHeader';
import { ChatInput } from './components/ChatInput';
import { EmptyState } from './components/EmptyState';
import { MessageBubble } from './components/MessageBubble';
import { ChatListView } from './components/ChatListView';
import { SearchView } from './components/SearchView';
import { NotificationsView } from './components/NotificationsView';
import { LikesView } from './components/LikesView';
import { ProfileView } from './components/ProfileView';
import { NotificationToast } from './components/NotificationToast';
import { CtaModal } from './components/CtaModal';
import { Message, UserProfile, ChatListItem, Notification } from './types';
import { generateResponse } from './services/gemini';

// --- DATA POOLS ---

// Initial User (The one we start with)
const EDITA_USER: ChatListItem = {
    id: 'edita',
    name: 'Edita',
    age: 40, // Updated age
    distance: 5,
    isOnline: true,
    avatarUrl: 'https://picsum.photos/id/64/200/200',
    lastMessageTime: 'teď',
    unreadCount: 0 
};

// Pending users who will appear over time
const PENDING_CHATS_POOL: ChatListItem[] = [
  {
    id: 'katerina',
    name: 'Katerina',
    age: 28,
    distance: 10,
    isOnline: true,
    avatarUrl: 'https://picsum.photos/id/342/200/200',
    lastMessageTime: '1 min',
    unreadCount: 1
  },
  {
    id: 'hana',
    name: 'Hana',
    age: 31,
    distance: 'Líšeň, Jihomoravský kraj',
    isOnline: true,
    avatarUrl: 'https://picsum.photos/id/447/200/200',
    lastMessageTime: 'teď',
    unreadCount: 1
  },
  {
    id: 'kayla',
    name: 'Kayla',
    age: 29,
    distance: 'Maloměřice, Jihomoravský kraj',
    isOnline: true,
    avatarUrl: 'https://picsum.photos/id/338/200/200',
    lastMessageTime: 'teď',
    specialNotification: '21'
  },
  {
    id: 'monika',
    name: 'Monika',
    age: 27,
    distance: 'Maloměřice, Jihomoravský kraj',
    isOnline: true,
    avatarUrl: 'https://picsum.photos/id/331/200/200',
    lastMessageTime: '2 min',
    unreadCount: 1
  },
  {
    id: 'radka',
    name: 'radkakolbuchq7k',
    age: 35,
    distance: 25,
    isOnline: true,
    avatarUrl: 'https://picsum.photos/id/433/200/200',
    lastMessageTime: '5 min',
    unreadCount: 1
  },
  {
    id: 'rosik',
    name: 'rosikzle4m',
    age: 40,
    distance: 30,
    isOnline: false,
    avatarUrl: 'https://picsum.photos/id/399/200/200',
    lastMessageTime: '8 min'
  }
];

const STARTER_POOL = [
  "ahoj",
  "co delas?",
  "jsi tu? :)",
  "cauky",
  "zdravim",
  "nudim se...",
  "odepis :P",
  "ahoj krasavce",
  "co delas v tenhle nudny den?",
  "hledam nekoho konkretniho",
  "ahoj odkud jsi?",
  "je tu dneska ticho...",
  "ahoj, mas chvilku?",
  "libis se mi ;)", 
  "halo halo",
  "hadej co ted delam...",
  "napis neco zajimaveho :)",
  "hezky nick, odkud jsi?",
  "hledam milou spolecnost",
  "jsi volny?",
  "AHOJ!!!",
  "napis mi...",
  "cekam na zpravu :*",
  "co delas vecer?",
  "nebud tak stydlivy ;)",
  "JSI TAM??",
  "hledam nekoho na dnesek",
  "strasne se nudim",
  "cau co u tebe?",
  "mam navrh ;)"
];

// --- SOUND UTILS ---
const playNotificationSound = () => {
  try {
    const audio = new Audio('https://cdn.freesound.org/previews/536/536108_1415754-lq.mp3');
    audio.volume = 0.5;
    audio.play().catch(e => console.log("Audio play blocked (user gesture required):", e));
  } catch (e) {
    console.error("Audio error", e);
  }
};

const App: React.FC = () => {
  // START WITH CHAT VIEW OPEN ON EDITA
  const [view, setView] = useState<ViewState>('chat');
  const [showCta, setShowCta] = useState(false);
  
  // Current active chat user (Start with Edita)
  const [currentUser, setCurrentUser] = useState<UserProfile>(EDITA_USER);

  // --- DYNAMIC CHAT LIST STATE ---
  const [activeChats, setActiveChats] = useState<ChatListItem[]>([EDITA_USER]);
  const [pendingChats, setPendingChats] = useState<ChatListItem[]>(PENDING_CHATS_POOL);

  // Messages & History
  const [messagesByChat, setMessagesByChat] = useState<Record<string, Message[]>>({});
  const [historyByChat, setHistoryByChat] = useState<Record<string, { role: 'user' | 'model'; parts: [{ text: string }] }[]>>({});
  const [usedStarters, setUsedStarters] = useState<Set<string>>(new Set());

  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [notification, setNotification] = useState<Notification | null>(null);

  // Helpers
  const currentMessages = messagesByChat[currentUser.id] || [];
  
  // Calculate total unread (sum of unreadCount of all active chats)
  const totalUnreadCount = activeChats.reduce((sum, chat) => sum + (chat.unreadCount || 0), 0);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (view === 'chat') {
      scrollToBottom();
    }
  }, [messagesByChat, isTyping, view, currentUser.id]);

  // --- INITIAL EDITA GREETING ---
  // If Edita has no messages yet, trigger one immediately on mount
  useEffect(() => {
    if (!messagesByChat['edita']) {
        const initialMsg: Message = {
            id: 'init-edita',
            text: "ahoj ;)",
            sender: 'match',
            timestamp: new Date()
        };
        setMessagesByChat(prev => ({ ...prev, 'edita': [initialMsg] }));
        setHistoryByChat(prev => ({ ...prev, 'edita': [{ role: 'model', parts: [{ text: "ahoj ;)" }] }] }));
    }
  }, []);

  // --- SIMULATE NEW MATCHES ARRIVING ---
  useEffect(() => {
    // Every 12 seconds, pop a user from pending and add to active
    const interval = setInterval(() => {
        setPendingChats(prevPending => {
            if (prevPending.length === 0) return prevPending;

            const [newChat, ...remaining] = prevPending;

            // 1. Generate a starter message for this new chat
            // Ensure unique starter
            let randomStarter = STARTER_POOL[Math.floor(Math.random() * STARTER_POOL.length)];
            // Simple uniqueness check (in real app, use loop)
            
            const initialMsg: Message = {
                id: `init-${newChat.id}-${Date.now()}`,
                text: randomStarter,
                sender: 'match',
                timestamp: new Date()
            };

            // 2. Add message to storage
            setMessagesByChat(prevMsg => ({
                ...prevMsg,
                [newChat.id]: [initialMsg]
            }));
            
            setHistoryByChat(prevHist => ({
                ...prevHist,
                [newChat.id]: [{ role: 'model', parts: [{ text: randomStarter }] }]
            }));

            // 3. Add to Active Chats list
            setActiveChats(prevActive => [newChat, ...prevActive]); // Add to top

            // 4. Play Sound & Show Notification Toast (if not in notifications view)
            playNotificationSound();
            
            // Optional: Show top toast for the new match
            setNotification({
                id: `new-${newChat.id}`,
                user: newChat.name,
                avatarUrl: newChat.avatarUrl,
                type: 'like', // or 'message'
                text: 'Nová zpráva: ' + randomStarter
            });

            return remaining;
        });
    }, 12000); // 12 seconds delay between new chats

    return () => clearInterval(interval);
  }, []); // Run once on mount to set up interval

  // --- NOTIFICATIONS LOGIC ---
  useEffect(() => {
    // Independent notifications (Profile Views/Likes)
    const timer1 = setTimeout(() => {
      setNotification({
        id: 'n1',
        user: 'Katerina',
        avatarUrl: 'https://picsum.photos/id/342/200/200',
        type: 'view',
        text: 'Zobrazila váš profil'
      });
    }, 25000); // delayed

    return () => clearTimeout(timer1);
  }, []);

  const handleNavigate = (newView: ViewState) => {
    if (newView === 'profile') {
      setShowCta(true);
      return; 
    }
    setView(newView);
  };

  const handleTriggerCta = () => {
    setShowCta(true);
  };

  // Mark chat as read when opening it
  const markAsRead = (chatId: string) => {
    setActiveChats(prev => prev.map(c => 
        c.id === chatId ? { ...c, unreadCount: 0 } : c
    ));
  };

  const handleMatchResponse = async (overrideText?: string, isInit?: boolean, targetChatId?: string) => {
    const chatId = targetChatId || currentUser.id;
    const startTypingDelay = isInit ? 0 : Math.random() * 2000 + 2000; 

    setTimeout(async () => {
      // Only show typing if we are still looking at this chat
      if (currentUser.id === chatId && view === 'chat') {
        setIsTyping(true);
      }

      let responseText = overrideText;
      const chatMessages = messagesByChat[chatId] || [];
      const messageCount = chatMessages.length;

      if (!responseText) {
          if (messageCount >= 4 && messageCount <= 6) {
             responseText = "nechces zajit na rychlou kavu v centru? ;p";
          } else {
             const lastUserMsg = chatMessages.filter(m => m.sender === 'user').slice(-1)[0]?.text || "ahoj";
             const chatHistory = historyByChat[chatId] || [];
             responseText = await generateResponse(chatHistory, lastUserMsg);
          }
      }

      const typingDuration = isInit ? 1000 : Math.max(1500, (responseText?.length || 0) * 30);

      setTimeout(() => {
        const newMessage: Message = {
          id: Date.now().toString(),
          text: responseText || "ahojky",
          sender: 'match',
          timestamp: new Date(),
        };

        setMessagesByChat(prev => ({
            ...prev,
            [chatId]: [...(prev[chatId] || []), newMessage]
        }));

        setHistoryByChat(prev => ({
            ...prev,
            [chatId]: [...(prev[chatId] || []), { role: 'model', parts: [{ text: responseText! }] }]
        }));

        if (currentUser.id === chatId) {
            setIsTyping(false);
        } else {
            // Received message in background -> Play Sound & Increment Badge
            playNotificationSound();
            setActiveChats(prev => prev.map(c => 
                c.id === chatId ? { ...c, unreadCount: (c.unreadCount || 0) + 1, lastMessageTime: 'teď' } : c
            ));
        }

        // TRIGGER CTA logic
        if ((responseText?.includes('kavu') || responseText?.includes('kávu') || responseText?.includes('setka') || responseText?.includes('sejit')) && currentUser.id === chatId) {
            setTimeout(() => {
                setShowCta(true);
            }, 2000); 
        }

      }, typingDuration);

    }, startTypingDelay);
  };

  const handleSendMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };

    // Update messages
    setMessagesByChat(prev => ({
        ...prev,
        [currentUser.id]: [...(prev[currentUser.id] || []), newMessage]
    }));

    // Update history
    setHistoryByChat(prev => ({
        ...prev,
        [currentUser.id]: [...(prev[currentUser.id] || []), { role: 'user', parts: [{ text }] }]
    }));

    // Move this chat to top of list
    setActiveChats(prev => {
        const chatIndex = prev.findIndex(c => c.id === currentUser.id);
        if (chatIndex === -1) return prev;
        const updatedChat = { ...prev[chatIndex], lastMessageTime: 'teď' };
        const newArr = [...prev];
        newArr.splice(chatIndex, 1);
        return [updatedChat, ...newArr];
    });

    handleMatchResponse(undefined, undefined, currentUser.id);
  };

  const handleChatSelect = (chat: ChatListItem) => {
    setCurrentUser(chat);
    markAsRead(chat.id);
    setView('chat');
  };

  const renderContent = () => {
    switch (view) {
      case 'list':
        return <ChatListView chats={activeChats} onChatSelect={handleChatSelect} />;
      case 'chat':
        return (
          <>
            <ChatHeader user={currentUser} onBack={() => setView('list')} />
            <div className="flex-1 overflow-y-auto bg-white scrollbar-hide relative">
              {currentMessages.length === 0 ? (
                <EmptyState />
              ) : (
                <div className="p-4 pb-2">
                   {currentMessages.map((msg) => (
                     <MessageBubble key={msg.id} message={msg} user={currentUser} />
                   ))}
                   {isTyping && (
                     <div className="flex items-center gap-2 mb-4">
                       <img src={currentUser.avatarUrl} className="w-8 h-8 rounded-full" />
                       <div className="bg-gray-100 rounded-2xl rounded-bl-none px-4 py-3 flex gap-1">
                         <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                         <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                         <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                       </div>
                     </div>
                   )}
                   <div ref={messagesEndRef} />
                </div>
              )}
            </div>
            <ChatInput onSendMessage={handleSendMessage} />
          </>
        );
      case 'search':
        return <SearchView onTriggerCta={handleTriggerCta} />;
      case 'notifications':
        return <NotificationsView onTriggerCta={handleTriggerCta} />;
      case 'likes':
        return <LikesView onTriggerCta={handleTriggerCta} />;
      default:
        return <ChatListView chats={activeChats} onChatSelect={handleChatSelect} />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white max-w-md mx-auto shadow-2xl overflow-hidden relative">
      <Navbar onNavigate={handleNavigate} activeView={view} unreadCount={totalUnreadCount} />
      
      {/* Notifications Layer - Only show if NOT in chat */}
      {notification && view !== 'chat' && (
        <NotificationToast 
          notification={notification} 
          onClose={() => setNotification(null)} 
          onClick={() => {
            setNotification(null);
            // If it was a message notification, maybe go to list? 
            // For now, default to notifications tab as requested previously
            setView('notifications');
          }}
        />
      )}

      {/* CTA Modal Layer */}
      <CtaModal isOpen={showCta} onClose={() => setShowCta(false)} />

      {renderContent()}
    </div>
  );
};

export default App;