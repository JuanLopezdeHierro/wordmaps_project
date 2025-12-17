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
                <div className="max-w-4xl mx-auto py-6 px-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 border border-neon-blue rounded-lg text-neon-blue glow-box-blue">
                            <Map size={24} />
                        </div>
                        <h1 className="text-3xl font-extrabold text-neon-blue tracking-wider glow-text-blue uppercase font-mono">
                            WordMaps
                        </h1>
                    </div>

                    <nav className="flex gap-4">
                        <button
                            onClick={() => setActiveTab('routes')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-md font-mono font-bold transition-all duration-300 border
                        ${activeTab === 'routes'
                                    ? 'bg-neon-blue/10 border-neon-blue text-neon-blue glow-box-blue'
                                    : 'border-transparent text-gray-400 hover:text-white hover:border-gray-600'}`}
                        >
                            <GitMerge size={18} /> ROUTES
                        </button>
                        <button
                            onClick={() => setActiveTab('explorer')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-md font-mono font-bold transition-all duration-300 border
                        ${activeTab === 'explorer'
                                    ? 'bg-neon-blue/10 border-neon-blue text-neon-blue glow-box-blue'
                                    : 'border-transparent text-gray-400 hover:text-white hover:border-gray-600'}`}
                        >
                            <Compass size={18} /> EXPLORER
                        </button>
                        <button
                            onClick={() => setActiveTab('stats')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-md font-mono font-bold transition-all duration-300 border
                        ${activeTab === 'stats'
                                    ? 'bg-neon-blue/10 border-neon-blue text-neon-blue glow-box-blue'
                                    : 'border-transparent text-gray-400 hover:text-white hover:border-gray-600'}`}
                        >
                            <LayoutDashboard size={18} /> INSIGHTS
                        </button>
                    </nav>
                </div>
            </div>

            {/* Content */}
            <div className="w-full max-w-4xl px-4 pb-12">
                {activeTab === 'routes' && (
                    <div className="flex flex-col items-center animate-fadeIn">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-neon-blue glow-text-blue mb-2 font-mono">SYSTEM: PATH_FINDER</h2>
                            <p className="text-gray-400 font-mono text-sm tracking-widest">INITIATE CONNECTION SEQUENCE</p>
                        </div>
                        <SearchBar onSearch={handleSearch} isLoading={loading} />
                        {error && (
                            <div className="mt-6 p-4 bg-red-900/20 border border-red-500 text-red-400 w-full rounded font-mono glow-box-pink">
                                <p className="font-bold flex items-center gap-2">
                                    ERROR_DETECTED
                                </p>
                                <p>{error}</p>
                            </div>
                        )}
                        {route && (
                            <>
                                <RoutePanel route={route} />
                                <GraphVisualization route={route} />
                            </>
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
