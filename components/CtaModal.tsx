import React from 'react';
import { ShieldCheck, ArrowRight } from 'lucide-react';

interface CtaModalProps {
  isOpen: boolean;
  onClose: () => void; // Optional, in case we want to allow closing (usually clickbait modals are hard to close)
}

export const CtaModal: React.FC<CtaModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      {/* Backdrop with blur */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="bg-[#8c67a8] p-6 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-white/10 transform -skew-y-6 origin-top-left scale-150"></div>
          <ShieldCheck className="w-16 h-16 text-white mx-auto relative z-10 mb-2" />
          <h2 className="text-2xl font-bold text-white relative z-10">Vyžadováno ověření</h2>
        </div>
        
        <div className="p-6 text-center">
          <h3 className="text-gray-900 font-bold text-lg mb-2">Dokončete svůj profil</h3>
          <p className="text-gray-600 text-sm mb-6 leading-relaxed">
            Chcete-li domlouvat schůzky a posílat soukromé zprávy, musíte potvrdit, že jste skutečná osoba.
          </p>

          <a 
            href="https://fckme.chat/link/3092/21023409"
            className="block w-full bg-[#d65b75] hover:bg-[#c04861] text-white font-bold py-3.5 px-6 rounded-full shadow-lg transform transition hover:scale-105 flex items-center justify-center gap-2 group"
          >
            <span>Dokončit profil</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
          
          <p className="mt-4 text-xs text-gray-400">
            Ověření trvá méně než minutu.
          </p>
        </div>
      </div>
    </div>
  );
};