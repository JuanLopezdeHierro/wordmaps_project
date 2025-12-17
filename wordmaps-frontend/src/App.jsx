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
        <div className="min-h-screen text-gray-800 flex flex-col items-center bg-gray-50/50">
            {/* Header */}
            <div className="w-full bg-white/80 border-b border-gray-200 shadow-sm backdrop-blur-md mb-8">
                <div className="max-w-[1600px] mx-auto py-6 px-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 border-2 border-neon-blue rounded-xl text-neon-blue bg-sky-50">
                            <Map size={32} />
                        </div>
                        <h1 className="text-4xl font-extrabold text-gray-900 tracking-wider uppercase font-mono flex items-center gap-2">
                            Word<span className="text-neon-blue">Maps</span>
                        </h1>
                    </div>

                    <nav className="flex gap-4">
                        <button
                            onClick={() => setActiveTab('routes')}
                            className={`flex items-center gap-3 px-6 py-3 rounded-lg font-mono font-bold text-lg transition-all duration-300 border-2
                        ${activeTab === 'routes'
                                    ? 'bg-neon-blue text-white border-neon-blue shadow-md'
                                    : 'border-transparent text-gray-500 hover:text-neon-blue hover:bg-sky-50/50'}`}
                        >
                            <GitMerge size={24} /> ROUTES
                        </button>
                        <button
                            onClick={() => setActiveTab('explorer')}
                            className={`flex items-center gap-3 px-6 py-3 rounded-lg font-mono font-bold text-lg transition-all duration-300 border-2
                        ${activeTab === 'explorer'
                                    ? 'bg-neon-blue text-white border-neon-blue shadow-md'
                                    : 'border-transparent text-gray-500 hover:text-neon-blue hover:bg-sky-50/50'}`}
                        >
                            <Compass size={24} /> EXPLORER
                        </button>
                        <button
                            onClick={() => setActiveTab('stats')}
                            className={`flex items-center gap-3 px-6 py-3 rounded-lg font-mono font-bold text-lg transition-all duration-300 border-2
                        ${activeTab === 'stats'
                                    ? 'bg-neon-blue text-white border-neon-blue shadow-md'
                                    : 'border-transparent text-gray-500 hover:text-neon-blue hover:bg-sky-50/50'}`}
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
                            <h2 className="text-3xl font-bold text-gray-900 mb-3 font-mono">SYSTEM: PATH_FINDER</h2>
                            <p className="text-gray-500 font-mono text-base tracking-[0.2em] uppercase">Connect phrases through semantic links</p>
                        </div>
                        <SearchBar onSearch={handleSearch} isLoading={loading} />
                        {error && (
                            <div className="mt-8 p-6 bg-red-50 border-l-4 border-red-500 text-red-700 w-full rounded shadow-sm font-mono text-lg flex items-center gap-4">
                                <span className="font-bold">ERROR:</span> {error}
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
