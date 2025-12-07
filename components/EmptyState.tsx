import React from 'react';

export const EmptyState: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-white p-6 pt-8">
      <h3 className="text-gray-800 font-bold text-sm mb-4">Začněte flirtovat</h3>
      <ul className="space-y-3">
        <li className="flex items-center gap-2 text-gray-500 text-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-[#8c67a8]"></span>
          Pošlete jí kompliment
        </li>
        <li className="flex items-center gap-2 text-gray-500 text-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-[#8c67a8]"></span>
          Zeptejte se, co ji zajímá
        </li>
        <li className="flex items-center gap-2 text-gray-500 text-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-[#8c67a8]"></span>
          Řekněte něco o sobě
        </li>
      </ul>
    </div>
  );
};