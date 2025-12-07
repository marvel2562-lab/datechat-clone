import React from 'react';
import { Camera, Settings, Shield, Star, Zap } from 'lucide-react';

export const ProfileView: React.FC = () => {
  return (
    <div className="flex-1 bg-[#f0f0f5] overflow-y-auto">
       <div className="bg-white pb-6 mb-2 shadow-sm">
         <div className="bg-[#462547] h-24 relative"></div>
         <div className="px-4 relative -mt-12 flex justify-between items-end">
           <div className="relative">
             <img src="https://picsum.photos/id/1012/200/200" className="w-24 h-24 rounded-full border-4 border-white object-cover" alt="Profile" />
             <div className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full shadow-md cursor-pointer">
                <Camera className="w-4 h-4 text-gray-600" />
             </div>
           </div>
           <button className="mb-2 bg-white border border-gray-300 px-4 py-1.5 rounded-full text-xs font-bold text-gray-700 shadow-sm">
             Upravit
           </button>
         </div>
         <div className="px-4 mt-3">
           <h2 className="text-xl font-bold text-gray-900">Marek, 42</h2>
           <p className="text-gray-500 text-sm">Praha</p>
         </div>
       </div>

       <div className="mx-4 mb-4 grid grid-cols-2 gap-3">
         <div className="bg-gradient-to-br from-[#d65b75] to-[#c24a64] rounded-xl p-4 text-white shadow-sm flex flex-col items-center justify-center cursor-pointer">
            <Star className="w-8 h-8 mb-2 fill-white/20" />
            <span className="font-bold text-lg">Premium</span>
            <span className="text-xs opacity-90">Aktivovat</span>
         </div>
         <div className="bg-gradient-to-br from-[#8c67a8] to-[#5a325b] rounded-xl p-4 text-white shadow-sm flex flex-col items-center justify-center cursor-pointer">
            <Zap className="w-8 h-8 mb-2 fill-white/20" />
            <span className="font-bold text-lg">Mince</span>
            <span className="text-xs opacity-90">100 dostupných</span>
         </div>
       </div>

       <div className="bg-white">
         <div className="p-4 border-b border-gray-100 flex items-center gap-3 cursor-pointer hover:bg-gray-50">
            <Settings className="text-gray-400 w-5 h-5" />
            <span className="text-gray-700 font-medium">Nastavení</span>
         </div>
         <div className="p-4 border-b border-gray-100 flex items-center gap-3 cursor-pointer hover:bg-gray-50">
            <Shield className="text-gray-400 w-5 h-5" />
            <span className="text-gray-700 font-medium">Bezpečnost</span>
         </div>
         <div className="p-4 flex items-center gap-3 cursor-pointer hover:bg-gray-50">
            <span className="text-red-500 font-medium ml-8">Odhlásit se</span>
         </div>
       </div>
    </div>
  );
};