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
        <div className="tron-panel p-10 rounded-xl w-full mt-10 animate-fadeIn">
            <h2 className="text-3xl font-mono font-bold mb-10 flex items-center gap-4 text-neon-blue uppercase tracking-widest">
                {mode === 'neighbors' ? <Network size={32} /> : <HelpCircle size={32} />}
                Node Explorer Module
            </h2>

            <div className="flex gap-8 mb-10 border-b border-gray-800 pb-2">
                <button
                    className={`px-8 py-4 font-mono text-xl tracking-wider transition-all
                        ${mode === 'neighbors' ? 'text-neon-blue border-b-4 border-neon-blue glow-text-blue' : 'text-gray-600 hover:text-gray-400'}`}
                    onClick={() => { setMode('neighbors'); setResults([]); }}
                >
                    NEIGHBOR_SCAN
                </button>
                <button
                    className={`px-8 py-4 font-mono text-xl tracking-wider transition-all
                        ${mode === 'pattern' ? 'text-neon-blue border-b-4 border-neon-blue glow-text-blue' : 'text-gray-600 hover:text-gray-400'}`}
                    onClick={() => { setMode('pattern'); setResults([]); }}
                >
                    PATTERN_MATCH
                </button>
            </div>

            <div className="flex flex-col md:flex-row gap-6 mb-10">
                <input
                    type="text"
                    value={mode === 'neighbors' ? word : pattern}
                    onChange={(e) => mode === 'neighbors' ? setWord(e.target.value) : setPattern(e.target.value)}
                    className="flex-1 px-8 py-5 bg-dark-bg/50 border-2 border-gray-700 rounded-lg text-neon-pink text-3xl font-mono uppercase tracking-widest focus:border-neon-pink focus:shadow-[0_0_15px_rgba(188,19,254,0.3)] outline-none"
                    placeholder={mode === 'neighbors' ? "INPUT ROOT NODE..." : "INPUT PATTERN (C?T)..."}
                />
                <button
                    onClick={handleSearch}
                    disabled={loading}
                    className="px-12 py-5 bg-gray-800 border-2 border-gray-600 hover:border-neon-blue hover:text-neon-blue hover:shadow-[0_0_20px_rgba(0,243,255,0.2)] text-white text-xl font-mono uppercase tracking-widest rounded-lg transition-all disabled:opacity-50"
                >
                    {loading ? 'PROCESSING...' : 'INITIATE'}
                </button>
            </div>

            <div className="mt-8 p-8 bg-dark-bg border-2 border-gray-800 rounded-xl min-h-[150px]">
                <h3 className="text-sm font-mono text-gray-500 uppercase mb-6 flex justify-between">
                    <span>Output Log</span>
                    <span>Count: {results.length}</span>
                </h3>
                <div className="flex flex-wrap gap-4">
                    {results.map((w, i) => (
                        <span key={i} className="px-6 py-3 bg-neon-blue/10 border border-neon-blue/30 text-neon-blue rounded-lg text-lg font-mono hover:bg-neon-blue hover:text-black cursor-default transition-colors">
                            {w}
                        </span>
                    ))}
                    {results.length === 0 && !loading && <span className="text-gray-600 font-mono text-lg">NO DATA DETECTED.</span>}
                </div>
            </div>
        </div>
    );
};

export default WordExplorer;
