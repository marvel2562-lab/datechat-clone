import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface LikesViewProps {
  onTriggerCta: () => void;
}

export const LikesView: React.FC<LikesViewProps> = ({ onTriggerCta }) => {
  return (
    <div className="flex-1 bg-white overflow-y-auto p-4">
      <div className="text-center mb-6 mt-4">
        <h2 className="text-2xl font-bold text-gray-800">Kdo vás má rád?</h2>
        <p className="text-gray-500 text-sm">Máte 13 nových lajků</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="relative aspect-square rounded-xl overflow-hidden shadow-md cursor-pointer" onClick={onTriggerCta}>
            {/* Blurring the image to simulate a paid feature commonly found in dating apps, or clear if 'premium' */}
            <img 
              src={`https://picsum.photos/id/${330 + i}/300/300`} 
              className="w-full h-full object-cover blur-sm opacity-80" 
              alt="Hidden match" 
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
               <div className="bg-[#d65b75] p-2 rounded-full shadow-lg">
                  <span className="text-white font-bold text-xs">?? let</span>
               </div>
            </div>
          </div>
        ))}
      </div>

      {/* Changed Bottom Card to "Complete Profile" CTA Trigger */}
      <div 
        onClick={onTriggerCta}
        className="mt-8 p-5 bg-[#f8f9fa] border-2 border-[#d65b75] rounded-xl text-center shadow-lg cursor-pointer transform transition hover:scale-[1.02]"
      >
        <div className="flex justify-center mb-2">
           <ShieldCheck className="w-8 h-8 text-[#d65b75]" />
        </div>
        <h3 className="font-bold text-lg text-gray-800 mb-1">Dokončit profil</h3>
        <p className="text-sm text-gray-600 mb-3">Chcete-li vidět, komu se líbíte, musíte ověřit svůj profil.</p>
        <button className="bg-[#d65b75] text-white px-8 py-2.5 rounded-full font-bold text-sm hover:bg-[#c04861] transition-colors w-full">
          Dokončit profil
        </button>
      </div>
    </div>
  );
};