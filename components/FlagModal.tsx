import React, { useEffect, useState } from 'react';
import { X, Loader2, Sparkles, BookOpen, Info } from 'lucide-react';
import { Country, FlagFactResponse } from '../types';
import { getFlagDetails } from '../services/geminiService';

interface FlagModalProps {
  country: Country;
  onClose: () => void;
}

const FlagModal: React.FC<FlagModalProps> = ({ country, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState<FlagFactResponse | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchDetails = async () => {
      setLoading(true);
      const data = await getFlagDetails(country.name.common);
      if (isMounted) {
        setDetails(data);
        setLoading(false);
      }
    };

    fetchDetails();

    return () => {
      isMounted = false;
    };
  }, [country.name.common]);

  // Prevent background scrolling
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="relative h-48 sm:h-64 bg-slate-100 flex items-center justify-center overflow-hidden shrink-0">
          <img 
            src={country.flags.svg} 
            alt={country.flags.alt || `Flag of ${country.name.common}`}
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/30 hover:bg-black/50 text-white rounded-full backdrop-blur-md transition-colors"
          >
            <X size={20} />
          </button>
          <div className="absolute bottom-4 left-6 text-white">
            <h2 className="text-3xl font-bold tracking-tight">{country.name.common}</h2>
            <p className="text-slate-200 opacity-90">{country.region}</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar grow space-y-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4 text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
              <p className="text-sm font-medium animate-pulse">Consulting AI historian...</p>
            </div>
          ) : details ? (
            <>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-indigo-600 font-semibold text-sm uppercase tracking-wider">
                  <BookOpen size={16} />
                  History
                </div>
                <p className="text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-100">
                  {details.history}
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-emerald-600 font-semibold text-sm uppercase tracking-wider">
                  <Sparkles size={16} />
                  Symbolism
                </div>
                <p className="text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-100">
                  {details.symbolism}
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-amber-600 font-semibold text-sm uppercase tracking-wider">
                  <Info size={16} />
                  Fun Fact
                </div>
                <p className="text-slate-700 leading-relaxed italic border-l-4 border-amber-400 pl-4 py-1">
                  "{details.funFact}"
                </p>
              </div>
            </>
          ) : (
            <div className="text-center text-red-500 py-8">
              Failed to load information. Please try again.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 text-xs text-center text-slate-400 shrink-0">
          Powered by Google Gemini
        </div>
      </div>
    </div>
  );
};

export default FlagModal;
