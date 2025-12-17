import React, { useState } from 'react';
import SearchBar from './components/SearchBar';
import RoutePanel from './components/RoutePanel';
import GraphVisualization from './components/GraphVisualization';
import GraphStats from './components/GraphStats';
import WordExplorer from './components/WordExplorer';
import { findRoute } from './services/api';
import { Map, LayoutDashboard, Compass, GitMerge } from 'lucide-react';

function App() {
    const [activeTab, setActiveTab] = useState('routes');
    const [route, setRoute] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSearch = async (origin, destination) => {
        setLoading(true);
        setError(null);
        setRoute(null);
        try {
            const result = await findRoute(origin, destination);
            setRoute(result);
        } catch (err) {
            if (err.response && err.response.status === 404) {
                setError("No path found between these words.");
            } else if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError("An error occurred while fetching the route.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen text-gray-200 flex flex-col items-center">
            {/* Header */}
            <div className="w-full bg-dark-bg border-b border-neon-blue shadow-[0_0_15px_rgba(0,243,255,0.2)] mb-8">
                <div className="max-w-[1600px] mx-auto py-8 px-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 border-2 border-neon-blue rounded-xl text-neon-blue glow-box-blue">
                            <Map size={32} />
                        </div>
                        <h1 className="text-4xl font-extrabold text-neon-blue tracking-wider glow-text-blue uppercase font-mono">
                            WordMaps
                        </h1>
                    </div>

                    <nav className="flex gap-4">
                        <button
                            onClick={() => setActiveTab('routes')}
                            className={`flex items-center gap-3 px-6 py-3 rounded-lg font-mono font-bold text-lg transition-all duration-300 border-2
                        ${activeTab === 'routes'
                                    ? 'bg-neon-blue/10 border-neon-blue text-neon-blue glow-box-blue'
                                    : 'border-transparent text-gray-400 hover:text-white hover:border-gray-600'}`}
                        >
                            <GitMerge size={24} /> ROUTES
                        </button>
                        <button
                            onClick={() => setActiveTab('explorer')}
                            className={`flex items-center gap-3 px-6 py-3 rounded-lg font-mono font-bold text-lg transition-all duration-300 border-2
                        ${activeTab === 'explorer'
                                    ? 'bg-neon-blue/10 border-neon-blue text-neon-blue glow-box-blue'
                                    : 'border-transparent text-gray-400 hover:text-white hover:border-gray-600'}`}
                        >
                            <Compass size={24} /> EXPLORER
                        </button>
                        <button
                            onClick={() => setActiveTab('stats')}
                            className={`flex items-center gap-3 px-6 py-3 rounded-lg font-mono font-bold text-lg transition-all duration-300 border-2
                        ${activeTab === 'stats'
                                    ? 'bg-neon-blue/10 border-neon-blue text-neon-blue glow-box-blue'
                                    : 'border-transparent text-gray-400 hover:text-white hover:border-gray-600'}`}
                        >
                            <LayoutDashboard size={24} /> INSIGHTS
                        </button>
                    </nav>
                </div>
            </div>

            {/* Content */}
            <div className="w-full max-w-[1600px] px-8 pb-12">
                {activeTab === 'routes' && (
                    <div className="flex flex-col items-center animate-fadeIn w-full">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-bold text-neon-blue glow-text-blue mb-3 font-mono">SYSTEM: PATH_FINDER</h2>
                            <p className="text-gray-400 font-mono text-base tracking-[0.2em]">INITIATE CONNECTION SEQUENCE</p>
                        </div>
                        <SearchBar onSearch={handleSearch} isLoading={loading} />
                        {error && (
                            <div className="mt-8 p-6 bg-red-900/20 border-2 border-red-500 text-red-400 w-full rounded-lg font-mono glow-box-pink text-lg">
                                <p className="font-bold flex items-center gap-3 mb-2">
                                    ERROR_DETECTED
                                </p>
                                <p>{error}</p>
                            </div>
                        )}
                        {route && (
                            <div className="w-full flex flex-col gap-8">
                                <RoutePanel route={route} />
                                <GraphVisualization route={route} />
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'explorer' && <WordExplorer />}

                {activeTab === 'stats' && <GraphStats />}
            </div>
        </div>
    );
}

export default App;
