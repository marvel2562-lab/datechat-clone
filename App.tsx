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

// Mock Data for the Chat List
const MOCK_CHATS: ChatListItem[] = [
  {
    id: 'katerina',
    name: 'Katerina',
    age: 28,
    distance: 10,
    isOnline: true,
    avatarUrl: 'https://picsum.photos/id/342/200/200',
    lastMessageTime: 'před 3 min',
    unreadCount: 1
  },
  {
    id: 'edita',
    name: 'Edita',
    age: 25,
    distance: 5,
    isOnline: true,
    avatarUrl: 'https://picsum.photos/id/64/200/200',
    lastMessageTime: 'před 4 min',
    unreadCount: 1
  },
  {
    id: 'hana',
    name: 'Hana',
    age: 31,
    distance: 'Líšeň, Jihomoravský kraj',
    isOnline: true,
    avatarUrl: 'https://picsum.photos/id/447/200/200',
    lastMessageTime: 'před 5 min',
    unreadCount: 1
  },
  {
    id: 'kayla',
    name: 'Kayla',
    age: 29,
    distance: 'Maloměřice, Jihomoravský kraj',
    isOnline: true,
    avatarUrl: 'https://picsum.photos/id/338/200/200',
    lastMessageTime: 'před 5 min',
    specialNotification: '21'
  },
  {
    id: 'monika',
    name: 'Monika',
    age: 27,
    distance: 'Maloměřice, Jihomoravský kraj',
    isOnline: true,
    avatarUrl: 'https://picsum.photos/id/331/200/200',
    lastMessageTime: 'před 7 min',
    unreadCount: 1
  },
  {
    id: 'radka',
    name: 'radkakolbuchq7k',
    age: 35,
    distance: 25,
    isOnline: true,
    avatarUrl: 'https://picsum.photos/id/433/200/200',
    lastMessageTime: 'před 7 min',
    unreadCount: 1
  },
  {
    id: 'rosik',
    name: 'rosikzle4m',
    age: 40,
    distance: 30,
    isOnline: false,
    avatarUrl: 'https://picsum.photos/id/399/200/200',
    lastMessageTime: 'před 8 min'
  }
];

// Diverse pool of starter messages (Czech)
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

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('list');
  const [showCta, setShowCta] = useState(false);
  
  // Current active chat user
  const [currentUser, setCurrentUser] = useState<UserProfile>({
    id: 'birgit',
    name: 'Birgit826',
    age: 33,
    distance: 10,
    isOnline: true,
    avatarUrl: 'https://picsum.photos/id/64/200/200',
  });

  // State to store messages per chat ID
  const [messagesByChat, setMessagesByChat] = useState<Record<string, Message[]>>({});
  
  // State to store AI context history per chat ID
  const [historyByChat, setHistoryByChat] = useState<Record<string, { role: 'user' | 'model'; parts: [{ text: string }] }[]>>({});

  // Track used starters to avoid repetition across different chats
  const [usedStarters, setUsedStarters] = useState<Set<string>>(new Set());

  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Notifications state
  const [notification, setNotification] = useState<Notification | null>(null);

  // Helper to get messages for current user safely
  const currentMessages = messagesByChat[currentUser.id] || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (view === 'chat') {
      scrollToBottom();
    }
  }, [messagesByChat, isTyping, view, currentUser.id]);

  // Initial fake engagement delay for default Birgit (only if no messages)
  useEffect(() => {
    if (view === 'chat' && (!messagesByChat['birgit'] || messagesByChat['birgit'].length === 0) && currentUser.id === 'birgit') {
      const timer = setTimeout(() => {
        handleMatchResponse("ahoj, vidim ze koukas na muj profil... nestyd se ;)", true, 'birgit');
      }, 3000); 
      return () => clearTimeout(timer);
    }
  }, [view, currentUser.id]);

  // Handle Notifications Sequence
  useEffect(() => {
    // Only run this once on mount
    const timer1 = setTimeout(() => {
      setNotification({
        id: 'n1',
        user: 'Katerina',
        avatarUrl: 'https://picsum.photos/id/342/200/200',
        type: 'view',
        text: 'Zobrazila váš profil'
      });
    }, 8000); 

    const timer2 = setTimeout(() => {
      setNotification({
        id: 'n2',
        user: 'Katerina',
        avatarUrl: 'https://picsum.photos/id/342/200/200',
        type: 'like',
        text: 'Právě vám dala lajk'
      });
    }, 20000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  // Intercept Navigation to Profile to show CTA
  const handleNavigate = (newView: ViewState) => {
    if (newView === 'profile') {
      setShowCta(true);
      // We do NOT setView('profile'). We keep the user where they are.
      return; 
    }
    setView(newView);
  };

  const handleTriggerCta = () => {
    setShowCta(true);
  };

  const handleMatchResponse = async (overrideText?: string, isInit?: boolean, targetChatId?: string) => {
    const chatId = targetChatId || currentUser.id;
    const startTypingDelay = isInit ? 0 : Math.random() * 2000 + 2000; 

    setTimeout(async () => {
      // Only show typing if we are still looking at this chat
      if (currentUser.id === chatId) {
        setIsTyping(true);
      }

      let responseText = overrideText;
      
      const chatMessages = messagesByChat[chatId] || [];
      const messageCount = chatMessages.length;

      if (!responseText) {
          // Force coffee topic on 4th or 5th message interaction
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
        }

        // TRIGGER CTA if the bot mentions coffee/meeting and we are viewing it
        // Updated strings for Czech triggers
        if ((responseText?.includes('kavu') || responseText?.includes('kávu') || responseText?.includes('setka') || responseText?.includes('sejit')) && currentUser.id === chatId) {
            setTimeout(() => {
                setShowCta(true);
            }, 2000); // Wait 2s after the message is displayed
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

    setMessagesByChat(prev => ({
        ...prev,
        [currentUser.id]: [...(prev[currentUser.id] || []), newMessage]
    }));

    setHistoryByChat(prev => ({
        ...prev,
        [currentUser.id]: [...(prev[currentUser.id] || []), { role: 'user', parts: [{ text }] }]
    }));

    handleMatchResponse(undefined, undefined, currentUser.id);
  };

  const handleChatSelect = (chat: ChatListItem) => {
    setCurrentUser(chat);
    setView('chat');
    
    // Check if we already have messages for this chat
    const existingMessages = messagesByChat[chat.id];

    if (existingMessages && existingMessages.length > 0) {
        // History exists, do nothing, it will render automatically
        return;
    }

    // Seed chat with a random unique message if it has unread counts AND no history yet
    if (chat.unreadCount && chat.unreadCount > 0) {
       // Filter out starters that have already been used in this session
       const availableStarters = STARTER_POOL.filter(msg => !usedStarters.has(msg));
       
       // Fallback to full pool if we run out (unlikely)
       const pool = availableStarters.length > 0 ? availableStarters : STARTER_POOL;
       
       const randomStarter = pool[Math.floor(Math.random() * pool.length)];
       
       // Mark this starter as used
       setUsedStarters(prev => new Set(prev).add(randomStarter));
       
       const initialMsg: Message = {
         id: `init-${chat.id}-${Date.now()}`,
         text: randomStarter,
         sender: 'match',
         timestamp: new Date(Date.now() - 1000 * 60 * 5) // 5 mins ago
       };
       
       setMessagesByChat(prev => ({
           ...prev,
           [chat.id]: [initialMsg]
       }));

       setHistoryByChat(prev => ({
           ...prev,
           [chat.id]: [{ role: 'model', parts: [{ text: randomStarter }] }]
       }));
    }
  };

  const renderContent = () => {
    switch (view) {
      case 'list':
        return <ChatListView chats={MOCK_CHATS} onChatSelect={handleChatSelect} />;
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
      // Profile case removed from render since we don't navigate there anymore
      default:
        return <ChatListView chats={MOCK_CHATS} onChatSelect={handleChatSelect} />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white max-w-md mx-auto shadow-2xl overflow-hidden relative">
      <Navbar onNavigate={handleNavigate} activeView={view} />
      
      {/* Notifications Layer - Only show if NOT in chat */}
      {notification && view !== 'chat' && (
        <NotificationToast 
          notification={notification} 
          onClose={() => setNotification(null)} 
          onClick={() => {
            setNotification(null);
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