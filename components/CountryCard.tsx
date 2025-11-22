import React from 'react';
import { ThumbsUp, ThumbsDown, Eye } from 'lucide-react';
import { Country, ReactionType } from '../types';

interface CountryCardProps {
  country: Country;
  reaction: ReactionType;
  onReaction: (code: string, type: ReactionType) => void;
  onClick: (country: Country) => void;
}

const CountryCard: React.FC<CountryCardProps> = ({ country, reaction, onReaction, onClick }) => {
  
  // Calculate display value based on user's local reaction only
  // Counts start at 0 and become 1 if selected by the user
  const currentLikes = reaction === ReactionType.LIKE ? 1 : 0;
  const currentDislikes = reaction === ReactionType.DISLIKE ? 1 : 0;

  const formatCount = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num;
  };

  return (
    <div className="group relative bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200 overflow-hidden flex flex-col h-full transform hover:-translate-y-1">
      {/* Flag Image Area */}
      <div 
        className="relative h-40 overflow-hidden cursor-pointer bg-slate-100"
        onClick={() => onClick(country)}
      >
        <img 
          src={country.flags.png} 
          alt={country.flags.alt || `Flag of ${country.name.common}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
           <div className="bg-white/90 text-slate-900 px-4 py-2 rounded-full font-medium text-sm flex items-center gap-2 shadow-lg transform scale-90 group-hover:scale-100 transition-all">
             <Eye size={16} />
             View Analysis
           </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 
            className="font-bold text-slate-800 text-lg leading-tight line-clamp-2 hover:text-indigo-600 cursor-pointer transition-colors"
            onClick={() => onClick(country)}
          >
            {country.name.common}
          </h3>
        </div>
        
        <p className="text-slate-500 text-xs uppercase tracking-wide font-medium mb-4">{country.region}</p>

        {/* Action Footer */}
        <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={(e) => { e.stopPropagation(); onReaction(country.cca3, ReactionType.LIKE); }}
              className={`flex items-center gap-1.5 px-2 py-1.5 rounded-full transition-all duration-200 ${reaction === ReactionType.LIKE ? 'bg-indigo-100 text-indigo-700 ring-1 ring-indigo-200' : 'bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-700'}`}
              aria-label={`Like ${country.name.common}`}
            >
              <ThumbsUp size={16} className={reaction === ReactionType.LIKE ? "fill-current" : ""} />
              <span className="text-xs font-bold">{formatCount(currentLikes)}</span>
            </button>
            
            <button 
              onClick={(e) => { e.stopPropagation(); onReaction(country.cca3, ReactionType.DISLIKE); }}
              className={`flex items-center gap-1.5 px-2 py-1.5 rounded-full transition-all duration-200 ${reaction === ReactionType.DISLIKE ? 'bg-rose-100 text-rose-700 ring-1 ring-rose-200' : 'bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-700'}`}
              aria-label={`Dislike ${country.name.common}`}
            >
              <ThumbsDown size={16} className={reaction === ReactionType.DISLIKE ? "fill-current" : ""} />
              <span className="text-xs font-bold">{formatCount(currentDislikes)}</span>
            </button>
          </div>
          <span className="text-[10px] text-slate-300 font-mono font-medium">
            {country.cca3}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CountryCard;