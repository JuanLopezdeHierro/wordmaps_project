import React, { useState } from 'react';
import { Network, HelpCircle } from 'lucide-react';
import { getNeighbors, searchWords } from '../services/api';

const WordExplorer = () => {
    const [word, setWord] = useState('');
    const [pattern, setPattern] = useState('');
    const [results, setResults] = useState([]);
    const [mode, setMode] = useState('neighbors');
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
        setLoading(true);
        setResults([]);
        try {
            if (mode === 'neighbors') {
                const data = await getNeighbors(word);
                setResults(data);
            } else {
                const data = await searchWords(pattern);
                setResults(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="tron-panel p-6 rounded-lg w-full max-w-4xl mt-6 animate-fadeIn">
            <h2 className="text-lg font-mono font-bold mb-6 flex items-center gap-2 text-neon-blue uppercase tracking-widest">
                {mode === 'neighbors' ? <Network size={20} /> : <HelpCircle size={20} />}
                Node Explorer Module
            </h2>

            <div className="flex gap-4 mb-6 border-b border-gray-800 pb-1">
                <button
                    className={`px-4 py-2 font-mono text-sm tracking-wider transition-all
                        ${mode === 'neighbors' ? 'text-neon-blue border-b-2 border-neon-blue glow-text-blue' : 'text-gray-600 hover:text-gray-400'}`}
                    onClick={() => { setMode('neighbors'); setResults([]); }}
                >
                    NEIGHBOR_SCAN
                </button>
                <button
                    className={`px-4 py-2 font-mono text-sm tracking-wider transition-all
                        ${mode === 'pattern' ? 'text-neon-blue border-b-2 border-neon-blue glow-text-blue' : 'text-gray-600 hover:text-gray-400'}`}
                    onClick={() => { setMode('pattern'); setResults([]); }}
                >
                    PATTERN_MATCH
                </button>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <input
                    type="text"
                    value={mode === 'neighbors' ? word : pattern}
                    onChange={(e) => mode === 'neighbors' ? setWord(e.target.value) : setPattern(e.target.value)}
                    className="flex-1 px-4 py-2 bg-dark-bg/50 border border-gray-700 rounded text-neon-pink font-mono uppercase tracking-widest focus:border-neon-pink focus:shadow-[0_0_10px_rgba(188,19,254,0.3)] outline-none"
                    placeholder={mode === 'neighbors' ? "INPUT ROOT NODE..." : "INPUT PATTERN (C?T)..."}
                />
                <button
                    onClick={handleSearch}
                    disabled={loading}
                    className="px-6 py-2 bg-gray-800 border border-gray-600 hover:border-neon-blue hover:text-neon-blue hover:shadow-[0_0_15px_rgba(0,243,255,0.2)] text-white font-mono uppercase tracking-widest rounded transition-all disabled:opacity-50"
                >
                    {loading ? 'PROCESSING...' : 'INITIATE'}
                </button>
            </div>

            <div className="mt-6 p-4 bg-dark-bg border border-gray-800 rounded min-h-[100px]">
                <h3 className="text-xs font-mono text-gray-500 uppercase mb-3 flex justify-between">
                    <span>Output Log</span>
                    <span>Count: {results.length}</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                    {results.map((w, i) => (
                        <span key={i} className="px-3 py-1 bg-neon-blue/10 border border-neon-blue/30 text-neon-blue rounded text-xs font-mono hover:bg-neon-blue hover:text-black cursor-default transition-colors">
                            {w}
                        </span>
                    ))}
                    {results.length === 0 && !loading && <span className="text-gray-600 font-mono text-sm">NO DATA DETECTED.</span>}
                    {loading && <span className="text-neon-blue font-mono text-sm animate-pulse">SCANNING DATABASE...</span>}
                </div>
            </div>
        </div>
    );
};

export default WordExplorer;
