import React, { useState } from 'react';
import { Network, HelpCircle } from 'lucide-react';
import { getNeighbors, searchWords } from '../services/api';

const WordExplorer = () => {
    const [targetWord, setTargetWord] = useState('');
    const [pattern, setPattern] = useState('');
    const [neighbors, setNeighbors] = useState(null); // Use null to indicate no search yet
    const [matches, setMatches] = useState(null); // Use null to indicate no search yet
    const [loading, setLoading] = useState(false);

    const handleNeighbors = async () => {
        setLoading(true);
        setNeighbors([]); // Clear previous results
        try {
            const data = await getNeighbors(targetWord);
            setNeighbors(data);
        } catch (error) {
            console.error("Error fetching neighbors:", error);
            setNeighbors([]); // Set to empty array on error
        } finally {
            setLoading(false);
        }
    };

    const handlePattern = async () => {
        setLoading(true);
        setMatches([]); // Clear previous results
        try {
            const data = await searchWords(pattern);
            setMatches(data);
        } catch (error) {
            console.error("Error searching pattern:", error);
            setMatches([]); // Set to empty array on error
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center animate-fadeIn w-full gap-8">
            <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-3 font-mono">NODE INSPECTOR</h2>
                <p className="text-gray-500 font-mono text-base tracking-[0.2em] uppercase">Analyze neighbors & patterns</p>
            </div>

            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Neighbor Scan */}
                <div className="bg-white/60 p-8 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all">
                    <h3 className="font-bold text-gray-800 font-mono text-xl uppercase mb-6 flex items-center gap-3">
                        NEIGHBOR_SCAN
                    </h3>
                    <div className="flex gap-4 mb-6">
                        <input
                            type="text"
                            value={targetWord}
                            onChange={(e) => setTargetWord(e.target.value)}
                            className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-800 font-mono uppercase focus:border-neon-blue focus:shadow shadow-sm outline-none transition-all"
                            placeholder="TARGET NODE..."
                            maxLength={5}
                        />
                        <button
                            onClick={handleNeighbors}
                            disabled={loading || !targetWord}
                            className="px-6 py-3 bg-neon-blue text-white rounded-lg font-mono font-bold hover:bg-sky-600 disabled:bg-gray-200 disabled:text-gray-400 transition-colors shadow-sm"
                        >
                            SCAN
                        </button>
                    </div>

                    {neighbors !== null && ( // Only show if a search has been performed
                        <div className="mt-4">
                            <h4 className="text-sm font-mono text-gray-400 mb-3 uppercase">Direct Connections ({neighbors.length})</h4>
                            <div className="flex flex-wrap gap-2 max-h-[300px] overflow-y-auto custom-scrollbar p-1">
                                {neighbors.map((w, i) => (
                                    <span key={i} className="px-3 py-1 bg-sky-50 text-sky-700 border border-sky-100 rounded-md font-mono text-sm hover:bg-sky-100 transition-colors cursor-default">
                                        {w}
                                    </span>
                                ))}
                                {neighbors.length === 0 && <span className="text-gray-400 font-mono italic">NO CONNECTIONS FOUND</span>}
                            </div>
                        </div>
                    )}
                </div>

                {/* Pattern Match */}
                <div className="bg-white/60 p-8 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all">
                    <h3 className="font-bold text-gray-800 font-mono text-xl uppercase mb-6 flex items-center gap-3">
                        PATTERN_MATCH
                    </h3>
                    <div className="flex gap-4 mb-6">
                        <input
                            type="text"
                            value={pattern}
                            onChange={(e) => setPattern(e.target.value)}
                            className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-800 font-mono uppercase focus:border-neon-pink focus:shadow shadow-sm outline-none transition-all"
                            placeholder="Use '?' for wildcards (e.g. B??K)"
                            maxLength={5}
                        />
                        <button
                            onClick={handlePattern}
                            disabled={loading || !pattern}
                            className="px-6 py-3 bg-neon-pink text-white rounded-lg font-mono font-bold hover:bg-fuchsia-600 disabled:bg-gray-200 disabled:text-gray-400 transition-colors shadow-sm"
                        >
                            MATCH
                        </button>
                    </div>

                    {matches !== null && ( // Only show if a search has been performed
                        <div className="mt-4">
                            <h4 className="text-sm font-mono text-gray-400 mb-3 uppercase">Matches Found ({matches.length})</h4>
                            <div className="flex flex-wrap gap-2 max-h-[300px] overflow-y-auto custom-scrollbar p-1">
                                {matches.map((w, i) => (
                                    <span key={i} className="px-3 py-1 bg-fuchsia-50 text-fuchsia-700 border border-fuchsia-100 rounded-md font-mono text-sm hover:bg-fuchsia-100 transition-colors cursor-default">
                                        {w}
                                    </span>
                                ))}
                                {matches.length === 0 && <span className="text-gray-400 font-mono italic">NO MATCHES IDENTIFIED</span>}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WordExplorer;
