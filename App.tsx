import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Search, Globe, Github, Heart, AlertCircle } from 'lucide-react';
import { fetchAllCountries } from './services/countryService';
import { Country, ReactionType } from './types';
import CountryCard from './components/CountryCard';
import FlagModal from './components/FlagModal';

const App: React.FC = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [reactions, setReactions] = useState<Record<string, ReactionType>>({});
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [filter, setFilter] = useState<'ALL' | 'LIKED'>('ALL');

  // Initial Data Fetch
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await fetchAllCountries();
        setCountries(data);
      } catch (err) {
        setError('Failed to load countries. Please check your internet connection.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
    
    // Load reactions from local storage
    const storedReactions = localStorage.getItem('flagReactions');
    if (storedReactions) {
      try {
        setReactions(JSON.parse(storedReactions));
      } catch (e) {
        console.error("Failed to parse local storage", e);
      }
    }
  }, []);

  // Handler for Likes/Dislikes
  const handleReaction = useCallback((cca3: string, type: ReactionType) => {
    setReactions(prev => {
      // Toggle if clicking the same reaction
      const newType = prev[cca3] === type ? ReactionType.NONE : type;
      
      const nextState = { ...prev };
      if (newType === ReactionType.NONE) {
        delete nextState[cca3];
      } else {
        nextState[cca3] = newType;
      }
      
      // Persist to local storage
      localStorage.setItem('flagReactions', JSON.stringify(nextState));
      return nextState;
    });
  }, []);

  // Filter Logic
  const filteredCountries = useMemo(() => {
    return countries.filter(country => {
      const matchesSearch = country.name.common.toLowerCase().includes(searchTerm.toLowerCase());
      if (filter === 'LIKED') {
        return matchesSearch && reactions[country.cca3] === ReactionType.LIKE;
      }
      return matchesSearch;
    });
  }, [countries, searchTerm, filter, reactions]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="bg-indigo-600 p-2 rounded-lg text-white">
                <Globe size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">WorldFlagExplorer</h1>
                <p className="text-xs text-slate-500">Discover flags & AI insights</p>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-1 md:max-w-md">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="Search countries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-100 border-transparent focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 rounded-full transition-all text-sm outline-none"
                />
              </div>
              <button
                onClick={() => setFilter(filter === 'ALL' ? 'LIKED' : 'ALL')}
                className={`p-2 rounded-full transition-all border ${
                  filter === 'LIKED' 
                    ? 'bg-rose-50 border-rose-200 text-rose-600' 
                    : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'
                }`}
                title="Show Liked Only"
              >
                <Heart size={20} fill={filter === 'LIKED' ? "currentColor" : "none"} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-400">
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
            <p className="font-medium">Loading countries...</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-64 text-rose-500 gap-2">
            <AlertCircle />
            <p>{error}</p>
          </div>
        ) : filteredCountries.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
             <div className="inline-block p-4 bg-slate-100 rounded-full mb-4">
               <Globe size={40} className="text-slate-300" />
             </div>
             <p className="text-lg">No countries found.</p>
             {filter === 'LIKED' && <p className="text-sm mt-2">Try liking some flags first!</p>}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredCountries.map(country => (
              <CountryCard
                key={country.cca3}
                country={country}
                reaction={reactions[country.cca3] || ReactionType.NONE}
                onReaction={handleReaction}
                onClick={setSelectedCountry}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
               <Globe size={20} className="text-indigo-600" />
               <span className="font-bold text-slate-900 text-lg">WorldFlagExplorer</span>
            </div>
            <p className="text-slate-500 text-sm max-w-xs">
              Exploring the symbolism and history of nations through their flags.
            </p>
          </div>

          <div className="text-center md:text-right text-sm text-slate-500">
            <p className="font-medium text-slate-900 mb-1">Copyright &copy; {new Date().getFullYear()}</p>
            <p>All rights reserved by WorldFlagExplorer.</p>
            <p className="text-xs mt-2 opacity-75">
              Data provided by REST Countries. <br/>
              AI insights generated by Google Gemini.
            </p>
          </div>
        </div>
      </footer>

      {/* Modal */}
      {selectedCountry && (
        <FlagModal 
          country={selectedCountry} 
          onClose={() => setSelectedCountry(null)} 
        />
      )}
    </div>
  );
};

export default App;