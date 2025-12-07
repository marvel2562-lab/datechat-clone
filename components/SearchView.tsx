import React from 'react';

interface SearchViewProps {
  onTriggerCta: () => void;
}

export const SearchView: React.FC<SearchViewProps> = ({ onTriggerCta }) => {
  const recommendations = [
    { id: 1, name: 'Anna', age: 29, img: 'https://picsum.photos/id/342/200/300' },
    { id: 2, name: 'Eva', age: 34, img: 'https://picsum.photos/id/338/200/300' },
    { id: 3, name: 'Karolína', age: 25, img: 'https://picsum.photos/id/64/200/300' },
    { id: 4, name: 'Marta', age: 31, img: 'https://picsum.photos/id/447/200/300' },
    { id: 5, name: 'Zuzka', age: 22, img: 'https://picsum.photos/id/65/200/300' },
    { id: 6, name: 'Anežka', age: 38, img: 'https://picsum.photos/id/433/200/300' },
  ];

  return (
    <div className="flex-1 bg-[#f0f0f5] overflow-y-auto p-2">
      <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-3 ml-1 mt-2">Objevujte v okolí</h3>
      <div className="grid grid-cols-2 gap-2">
        {recommendations.map((user) => (
          <div 
            key={user.id} 
            onClick={onTriggerCta}
            className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-sm group cursor-pointer"
          >
            <img 
              src={user.img} 
              alt={user.name} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-3">
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 bg-[#4caf50] rounded-full border border-white"></div>
                 <span className="text-white font-bold text-lg">{user.name}, {user.age}</span>
              </div>
              <span className="text-gray-300 text-xs">12 km daleko</span>
            </div>
          </div>
        ))}
      </div>
      <button 
        onClick={onTriggerCta}
        className="w-full mt-4 bg-[#8c67a8] text-white py-3 rounded-full font-bold shadow-md hover:bg-[#7a5994] transition-colors"
      >
        Načíst další
      </button>
    </div>
  );
};