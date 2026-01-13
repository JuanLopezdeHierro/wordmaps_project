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
        <div className="tron-panel p-10 rounded-xl w-full mt-10 bg-white/60">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="text-center p-8 bg-white border border-gray-200 rounded-xl relative overflow-hidden group hover:border-neon-blue shadow-sm transition-all hover:shadow-md">
                    <div className="flex items-center justify-center gap-3 text-gray-400 mb-4 font-mono text-sm uppercase tracking-widest">
                        <Footprints size={24} /> Steps
                    </div>
                    <p className="text-6xl font-mono font-bold text-gray-800 group-hover:text-neon-blue transition-all">{route.steps}</p>
                </div>

                <div className="text-center p-8 bg-white border border-gray-200 rounded-xl relative overflow-hidden group hover:border-yellow-400 shadow-sm transition-all hover:shadow-md">
                    <div className="flex items-center justify-center gap-3 text-gray-400 mb-4 font-mono text-sm uppercase tracking-widest">
                        <Activity size={24} /> Difficulty
                    </div>
                    <span className={`inline-block px-8 py-2 rounded-lg font-mono font-bold text-2xl border-2 ${getDifficultyColor(route.difficulty)} bg-white text-gray-700`}>
                        {route.difficulty}
                    </span>
                </div>

                <div className="text-center p-8 bg-white border border-gray-200 rounded-xl relative overflow-hidden group hover:border-neon-pink shadow-sm transition-all hover:shadow-md">
                    <div className="flex items-center justify-center gap-3 text-gray-400 mb-4 font-mono text-sm uppercase tracking-widest">
                        <Trophy size={24} /> Type
                    </div>
                    <p className="text-4xl font-mono font-bold text-neon-pink mt-2">{route.routeType}</p>
                </div>
            </div>

            <div className="space-y-6">
                <h3 className="text-lg font-mono font-bold text-neon-blue uppercase tracking-widest border-b border-gray-200 pb-4 mb-6">
                    Transformation Sequence
                </h3>
                <div className="flex flex-wrap items-center gap-6">
                    {route.path.map((word, index) => (
                        <React.Fragment key={index}>
                            <div className={`px-6 py-3 rounded-lg font-mono font-bold text-xl tracking-widest border-2 relative shadow-sm
                                ${index === 0
                                    ? 'border-neon-blue text-neon-blue bg-sky-50'
                                    : index === route.path.length - 1
                                        ? 'border-neon-pink text-neon-pink bg-fuchsia-50'
                                        : 'border-gray-200 text-gray-600 bg-white'}`}>
                                {word}
                                {/* Connector dots */}
                                <div className="absolute top-1/2 -right-1.5 w-1.5 h-1.5 bg-current opacity-50 rounded-full"></div>
                                <div className="absolute top-1/2 -left-1.5 w-1.5 h-1.5 bg-current opacity-50 rounded-full"></div>
                            </div>
                            {index < route.path.length - 1 && (
                                <ArrowRight className="text-gray-300" size={32} />
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {route.transformations && (
                <div className="mt-12">
                    <h3 className="text-lg font-mono font-bold text-gray-400 uppercase tracking-widest mb-6">Operation Log</h3>
                    <div className="space-y-3 font-mono text-lg bg-gray-50 p-6 rounded-xl border border-gray-200 relative">
                        <div className="absolute top-0 left-0 w-1 h-full bg-gray-300"></div>
                        {route.transformations.map((t, i) => (
                            <div key={i} className="flex items-center gap-4 py-2 border-b border-dashed border-gray-200 last:border-0 text-gray-600">
                                <span className="text-gray-400 min-w-[30px]">0{i + 1}</span>
                                <span className="text-neon-blue font-bold">{t.from}</span>
                                <ArrowRight size={16} className="text-gray-300" />
                                <span className="text-neon-pink font-bold">{t.to}</span>
                                <span className="text-sm text-gray-400 ml-auto hidden md:inline-block">{t.description}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default RoutePanel;
