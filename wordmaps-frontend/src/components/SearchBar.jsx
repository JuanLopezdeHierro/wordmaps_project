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
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-6 items-center tron-panel p-10 rounded-xl w-full relative overflow-hidden bg-white/60">
            {/* Decorative line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon-blue to-transparent opacity-80"></div>

            <div className="flex-1 w-full relative">
                <label className="block text-sm font-mono font-bold text-gray-500 mb-2 tracking-wider uppercase">Start Node</label>
                <input
                    type="text"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    className="w-full px-6 py-5 bg-white border-2 border-gray-200 rounded-lg focus:border-neon-blue focus:shadow-lg focus:shadow-sky-100 text-gray-800 text-2xl font-mono uppercase tracking-widest transition-all outline-none"
                    placeholder="ENTER WORD..."
                    maxLength={5}
                />
            </div>

            <div className="hidden md:block text-gray-300 text-2xl mt-6">
                &gt;&gt;
            </div>

            <div className="flex-1 w-full relative">
                <label className="block text-sm font-mono font-bold text-gray-500 mb-2 tracking-wider uppercase">Target Node</label>
                <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full px-6 py-5 bg-white border-2 border-gray-200 rounded-lg focus:border-neon-pink focus:shadow-lg focus:shadow-fuchsia-100 text-gray-800 text-2xl font-mono uppercase tracking-widest transition-all outline-none"
                    placeholder="ENTER WORD..."
                    maxLength={5}
                />
            </div>

            <button
                type="submit"
                disabled={isLoading || !origin || !destination}
                className={`mt-6 md:mt-0 px-10 py-5 rounded-lg font-mono font-bold text-xl tracking-widest flex items-center justify-center gap-3 border-2 transition-all duration-300 h-full self-end shadow-md
                    ${isLoading || !origin || !destination
                        ? 'border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50'
                        : 'border-neon-blue text-white bg-neon-blue hover:bg-sky-500 hover:shadow-lg hover:shadow-sky-200'}`}
            >
                {isLoading ? 'SCANNING...' : <><Search size={24} /> EXECUTE</>}
            </button>
        </form>
    );
};

export default SearchBar;
