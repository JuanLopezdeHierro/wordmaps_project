import React, { useState } from 'react';
import SearchBar from './components/SearchBar';
import RoutePanel from './components/RoutePanel';
import GraphVisualization from './components/GraphVisualization';
import { findRoute } from './services/api';
import { Map } from 'lucide-react';

function App() {
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
        <div className="min-h-screen bg-slate-100 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
            <div className="text-center mb-10">
                <div className="flex justify-center mb-4">
                    <div className="p-3 bg-blue-600 rounded-full text-white">
                        <Map size={40} />
                    </div>
                </div>
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
                    WordMaps
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Explore the connections between words. Find the shortest path from one word to another by changing one letter at a time.
                </p>
            </div>

            <SearchBar onSearch={handleSearch} isLoading={loading} />

            {error && (
                <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 w-full max-w-4xl rounded-r-md">
                    <p className="font-bold">Error</p>
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
    );
}

export default App;
