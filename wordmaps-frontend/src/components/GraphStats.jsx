import React, { useEffect, useState } from 'react';
import { BarChart, Users, AlertTriangle } from 'lucide-react';
import { getGraphStats, getTopConnected, getIsolated } from '../services/api';

const GraphStats = () => {
    const [stats, setStats] = useState(null);
    const [topWords, setTopWords] = useState([]);
    const [isolated, setIsolated] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [sData, tData, iData] = await Promise.all([
                    getGraphStats(),
                    getTopConnected(),
                    getIsolated()
                ]);
                setStats(sData);
                setTopWords(tData);
                setIsolated(iData.slice(0, 50));
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="p-6 text-center text-neon-blue font-mono animate-pulse">SYSTEM ANALYSIS IN PROGRESS...</div>;

    return (
        <div className="tron-panel p-6 rounded-lg w-full max-w-4xl mt-6 animate-fadeIn">
            <h2 className="text-lg font-mono font-bold mb-6 flex items-center gap-2 text-neon-blue uppercase tracking-widest">
                <BarChart size={20} /> System Metrics
            </h2>

            {/* General Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-dark-bg border border-neon-blue/30 p-4 rounded text-center relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-neon-blue/50"></div>
                    <p className="text-gray-400 font-mono text-xs uppercase tracking-widest mb-2">Total Nodes</p>
                    <p className="text-3xl font-mono font-bold text-white group-hover:glow-text-blue transition-all">{stats?.vertexCount}</p>
                </div>
                <div className="bg-dark-bg border border-green-500/30 p-4 rounded text-center relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-green-500/50"></div>
                    <p className="text-gray-400 font-mono text-xs uppercase tracking-widest mb-2">Total Links</p>
                    <p className="text-3xl font-mono font-bold text-white group-hover:text-green-400 transition-all">{stats?.edgeCount}</p>
                </div>
                <div className="bg-dark-bg border border-neon-pink/30 p-4 rounded text-center relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-neon-pink/50"></div>
                    <p className="text-gray-400 font-mono text-xs uppercase tracking-widest mb-2">Clusters</p>
                    <p className="text-3xl font-mono font-bold text-white group-hover:glow-text-pink transition-all">{stats?.connectedComponents}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Top Connected */}
                <div className="bg-dark-bg/50 border border-gray-800 p-4 rounded">
                    <h3 className="font-bold text-gray-300 font-mono text-sm uppercase mb-4 flex items-center gap-2 border-b border-gray-800 pb-2">
                        <Users size={16} className="text-neon-blue" /> High-Density Nodes
                    </h3>
                    <ul className="space-y-2">
                        {topWords.map((w, i) => (
                            <li key={i} className="text-gray-400 font-mono text-sm flex justify-between items-center bg-gray-900/50 px-2 py-1 rounded">
                                <span className="text-neon-blue">{i + 1}. {w}</span>
                                <span className="text-xs text-gray-600">HIGH_CONN</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Isolated */}
                <div className="bg-dark-bg/50 border border-gray-800 p-4 rounded">
                    <h3 className="font-bold text-gray-300 font-mono text-sm uppercase mb-4 flex items-center gap-2 border-b border-gray-800 pb-2">
                        <AlertTriangle size={16} className="text-neon-pink" /> Isolated Nodes (Frag)
                    </h3>
                    <div className="flex flex-wrap gap-2 h-64 overflow-y-auto custom-scrollbar">
                        {isolated.map((w, i) => (
                            <span key={i} className="px-2 py-1 bg-red-900/20 border border-red-900/50 text-red-400 rounded text-xs font-mono">
                                {w}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GraphStats;
