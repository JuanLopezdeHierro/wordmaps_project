import React, { useState } from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ onSearch, isLoading }) => {
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (origin && destination) {
            onSearch(origin, destination);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-6 items-center tron-panel p-10 rounded-xl w-full relative overflow-hidden">
            {/* Decorative line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon-blue to-transparent opacity-50"></div>

            <div className="flex-1 w-full relative">
                <label className="block text-sm font-mono font-bold text-neon-blue mb-2 tracking-wider uppercase">Start Node</label>
                <input
                    type="text"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    className="w-full px-6 py-5 bg-dark-bg/50 border-2 border-gray-700 rounded-lg focus:border-neon-blue focus:shadow-[0_0_15px_rgba(0,243,255,0.3)] text-white text-2xl font-mono uppercase tracking-widest transition-all outline-none"
                    placeholder="ENTER WORD..."
                    maxLength={5}
                />
            </div>

            <div className="hidden md:block text-neon-blue opacity-50 text-2xl mt-6">
                &gt;&gt;
            </div>

            <div className="flex-1 w-full relative">
                <label className="block text-sm font-mono font-bold text-neon-pink mb-2 tracking-wider uppercase">Target Node</label>
                <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full px-6 py-5 bg-dark-bg/50 border-2 border-gray-700 rounded-lg focus:border-neon-pink focus:shadow-[0_0_15px_rgba(188,19,254,0.3)] text-white text-2xl font-mono uppercase tracking-widest transition-all outline-none"
                    placeholder="ENTER WORD..."
                    maxLength={5}
                />
            </div>

            <button
                type="submit"
                disabled={isLoading || !origin || !destination}
                className={`mt-6 md:mt-0 px-10 py-5 rounded-lg font-mono font-bold text-xl tracking-widest flex items-center justify-center gap-3 border-2 transition-all duration-300 h-full self-end
                    ${isLoading || !origin || !destination
                        ? 'border-gray-700 text-gray-600 cursor-not-allowed bg-dark-bg'
                        : 'border-neon-blue text-dark-bg bg-neon-blue hover:bg-white hover:shadow-[0_0_20px_rgba(0,243,255,0.8)]'}`}
            >
                {isLoading ? 'SCANNING...' : <><Search size={24} /> EXECUTE</>}
            </button>
        </form>
    );
};

export default SearchBar;
