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
        <div className="tron-panel p-10 rounded-xl w-full mt-10 animate-fadeIn bg-white/60">
            <h2 className="text-3xl font-mono font-bold mb-10 flex items-center gap-4 text-neon-blue uppercase tracking-widest">
                <BarChart size={32} /> System Metrics
            </h2>

            {/* General Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
                <div className="bg-white border border-gray-200 p-8 rounded-xl text-center relative overflow-hidden group shadow-sm hover:shadow-md transition-all">
                    <div className="absolute top-0 left-0 w-full h-2 bg-neon-blue"></div>
                    <p className="text-gray-500 font-mono text-sm uppercase tracking-widest mb-4">Total Nodes</p>
                    <p className="text-6xl font-mono font-bold text-gray-800 group-hover:text-neon-blue transition-all">{stats?.vertexCount}</p>
                </div>
                <div className="bg-white border border-gray-200 p-8 rounded-xl text-center relative overflow-hidden group shadow-sm hover:shadow-md transition-all">
                    <div className="absolute top-0 left-0 w-full h-2 bg-green-500"></div>
                    <p className="text-gray-500 font-mono text-sm uppercase tracking-widest mb-4">Total Links</p>
                    <p className="text-6xl font-mono font-bold text-gray-800 group-hover:text-green-500 transition-all">{stats?.edgeCount}</p>
                </div>
                <div className="bg-white border border-gray-200 p-8 rounded-xl text-center relative overflow-hidden group shadow-sm hover:shadow-md transition-all">
                    <div className="absolute top-0 left-0 w-full h-2 bg-neon-pink"></div>
                    <p className="text-gray-500 font-mono text-sm uppercase tracking-widest mb-4">Clusters</p>
                    <p className="text-6xl font-mono font-bold text-gray-800 group-hover:text-neon-pink transition-all">{stats?.connectedComponents}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Top Connected */}
                <div className="bg-white/50 border border-gray-200 p-8 rounded-xl shadow-sm">
                    <h3 className="font-bold text-gray-800 font-mono text-lg uppercase mb-6 flex items-center gap-3 border-b border-gray-200 pb-4">
                        <Users size={24} className="text-neon-blue" /> High-Density Nodes
                    </h3>
                    <ul className="space-y-4">
                        {topWords.map((w, i) => (
                            <li key={i} className="text-gray-600 font-mono text-lg flex justify-between items-center bg-gray-50 px-4 py-3 rounded-lg border border-gray-100">
                                <span className="text-neon-blue font-bold opacity-80">{i + 1}. {w}</span>
                                <span className="text-sm text-gray-400">HIGH_CONN</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Isolated */}
                <div className="bg-white/50 border border-gray-200 p-8 rounded-xl shadow-sm">
                    <h3 className="font-bold text-gray-800 font-mono text-lg uppercase mb-6 flex items-center gap-3 border-b border-gray-200 pb-4">
                        <AlertTriangle size={24} className="text-neon-pink" /> Isolated Nodes (Frag)
                    </h3>
                    <div className="flex flex-wrap gap-3 h-[400px] overflow-y-auto custom-scrollbar">
                        {isolated.map((w, i) => (
                            <span key={i} className="px-4 py-2 bg-red-50 border border-red-100 text-red-500 rounded-lg text-sm font-mono">
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
