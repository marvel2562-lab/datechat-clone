import React from 'react';
import { Eye, Heart, MessageCircle, AlertCircle } from 'lucide-react';

interface NotificationsViewProps {
  onTriggerCta: () => void;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({ onTriggerCta }) => {
  const notifs = [
    { id: 1, user: 'Katerina', action: 'view', time: 'před 2 min', img: 'https://picsum.photos/id/342/100/100' },
    { id: 2, user: 'Katerina', action: 'like', time: 'před 5 min', img: 'https://picsum.photos/id/342/100/100' },
    { id: 3, user: 'Monika', action: 'view', time: 'před 12 min', img: 'https://picsum.photos/id/331/100/100' },
    { id: 4, user: 'Anna', action: 'view', time: 'před 2 hod', img: 'https://picsum.photos/id/338/100/100' },
    // Administrator notification at the bottom (oldest)
    { id: 99, user: 'Administrátor', action: 'system', time: 'Včera', img: 'https://picsum.photos/id/65/100/100', text: 'Doplňte svůj profil a začněte randit.' },
  ];

  return (
    <div className="flex-1 bg-white overflow-y-auto">
      <div className="p-4 border-b border-gray-100">
         <h2 className="text-xl font-bold text-gray-800">Upozornění</h2>
      </div>
      <div className="divide-y divide-gray-100 pb-20">
        {notifs.map((n) => (
          <div 
            key={n.id} 
            onClick={onTriggerCta} // Clicking ANY notification triggers CTA
            className={`p-4 flex gap-4 hover:bg-gray-50 cursor-pointer ${n.action === 'like' ? 'bg-[#fff0f3]' : ''}`}
          >
            <div className="relative">
               <img src={n.img} className="w-12 h-12 rounded-full object-cover" alt="" />
               <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center border-2 border-white
                 ${n.action === 'view' ? 'bg-[#5c9a5f]' : n.action === 'like' ? 'bg-[#d65b75]' : 'bg-[#8c67a8]'}
               `}>
                 {n.action === 'view' && <Eye className="w-3 h-3 text-white" />}
                 {n.action === 'like' && <Heart className="w-3 h-3 text-white fill-white" />}
                 {n.action === 'system' && <AlertCircle className="w-3 h-3 text-white" />}
               </div>
            </div>
            <div className="flex-1">
               <div className="flex justify-between items-start">
                 <span className="font-bold text-gray-900">{n.user}</span>
                 <span className="text-gray-400 text-xs">{n.time}</span>
               </div>
               <p className="text-gray-600 text-sm mt-0.5">
                 {n.action === 'view' && 'Zobrazila váš profil'}
                 {n.action === 'like' && 'Líbíte se jí! Klikněte pro zprávu.'}
                 {n.action === 'system' && n.text}
               </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};