import React from 'react';
import { ArrowRight, Trophy, Activity, Footprints } from 'lucide-react';

const RoutePanel = ({ route }) => {
    if (!route) return null;

    const getDifficultyColor = (diff) => {
        switch (diff) {
            case 'EASY': return 'text-green-400 border-green-500 shadow-[0_0_10px_rgba(74,222,128,0.2)]';
            case 'MEDIUM': return 'text-yellow-400 border-yellow-500 shadow-[0_0_10px_rgba(250,204,21,0.2)]';
            case 'HARD': return 'text-red-400 border-red-500 shadow-[0_0_10px_rgba(248,113,113,0.2)]';
            default: return 'text-gray-400 border-gray-500';
        }
    };

    return (
        <div className="tron-panel p-6 rounded-lg w-full max-w-4xl mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center p-4 bg-dark-bg/50 border border-gray-800 rounded-lg relative overflow-hidden group hover:border-neon-blue transition-colors">
                    <div className="flex items-center justify-center gap-2 text-gray-400 mb-2 font-mono text-xs uppercase tracking-widest">
                        <Footprints size={16} /> Steps
                    </div>
                    <p className="text-4xl font-mono font-bold text-white group-hover:text-neon-blue group-hover:glow-text-blue transition-all">{route.steps}</p>
                </div>

                <div className="text-center p-4 bg-dark-bg/50 border border-gray-800 rounded-lg relative overflow-hidden group hover:border-yellow-400 transition-colors">
                    <div className="flex items-center justify-center gap-2 text-gray-400 mb-2 font-mono text-xs uppercase tracking-widest">
                        <Activity size={16} /> Difficulty
                    </div>
                    <span className={`inline-block px-4 py-1 rounded font-mono font-bold text-sm border ${getDifficultyColor(route.difficulty)} bg-dark-bg`}>
                        {route.difficulty}
                    </span>
                </div>

                <div className="text-center p-4 bg-dark-bg/50 border border-gray-800 rounded-lg relative overflow-hidden group hover:border-neon-pink transition-colors">
                    <div className="flex items-center justify-center gap-2 text-gray-400 mb-2 font-mono text-xs uppercase tracking-widest">
                        <Trophy size={16} /> Type
                    </div>
                    <p className="text-xl font-mono font-bold text-neon-pink glow-text-pink">{route.routeType}</p>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-sm font-mono font-bold text-neon-blue uppercase tracking-widest border-b border-gray-800 pb-2 mb-4">
                    Transformation Sequence
                </h3>
                <div className="flex flex-wrap items-center gap-4">
                    {route.path.map((word, index) => (
                        <React.Fragment key={index}>
                            <div className={`px-4 py-2 rounded font-mono font-bold tracking-widest border relative
                                ${index === 0
                                    ? 'border-neon-blue text-neon-blue bg-neon-blue/10 glow-box-blue'
                                    : index === route.path.length - 1
                                        ? 'border-neon-pink text-neon-pink bg-neon-pink/10 glow-box-pink'
                                        : 'border-gray-700 text-gray-300 bg-dark-bg'}`}>
                                {word}
                                {/* Connector dots for tech feel */}
                                <div className="absolute top-1/2 -right-1 w-1 h-1 bg-current opacity-50 rounded-full"></div>
                                <div className="absolute top-1/2 -left-1 w-1 h-1 bg-current opacity-50 rounded-full"></div>
                            </div>
                            {index < route.path.length - 1 && (
                                <ArrowRight className="text-gray-600 animate-pulse" size={20} />
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {route.transformations && (
                <div className="mt-8">
                    <h3 className="text-sm font-mono font-bold text-gray-500 uppercase tracking-widest border-b border-gray-800 pb-2 mb-4">
                        Step-by-Step Log
                    </h3>
                    <div className="space-y-3 font-mono">
                        {route.transformations.map((trans, idx) => (
                            <div key={idx} className="flex items-center gap-4 bg-dark-bg/30 border border-gray-800 p-3 rounded hover:border-neon-blue/50 transition-colors">
                                <span className="w-6 h-6 flex items-center justify-center bg-gray-800 border border-gray-600 text-neon-blue rounded text-xs">
                                    {trans.stepNumber}
                                </span>
                                <div className="flex-1">
                                    <p className="text-gray-300 font-bold text-sm">
                                        {trans.from} <span className="text-gray-600 mx-1">→</span> {trans.to}
                                    </p>
                                    <p className="text-xs text-gray-500 uppercase tracking-tight">{trans.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default RoutePanel;
