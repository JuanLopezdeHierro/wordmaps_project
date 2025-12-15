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
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-center bg-white p-6 rounded-lg shadow-md w-full max-w-4xl">
            <div className="flex-1 w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Word</label>
                <input
                    type="text"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 uppercase"
                    placeholder="e.g. CAT"
                    maxLength={5}
                />
            </div>

            <div className="flex-1 w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">Target Word</label>
                <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 uppercase"
                    placeholder="e.g. DOG"
                    maxLength={5}
                />
            </div>

            <button
                type="submit"
                disabled={isLoading || !origin || !destination}
                className={`mt-6 px-6 py-2 rounded-md text-white font-medium flex items-center gap-2 
                    ${isLoading || !origin || !destination
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700'}`}
            >
                {isLoading ? 'Searching...' : <><Search size={20} /> Find Path</>}
            </button>
        </form>
    );
};

export default SearchBar;
