import React from 'react';
import { ArrowRight, Trophy, Activity, Footprints } from 'lucide-react';

const RoutePanel = ({ route }) => {
    if (!route) return null;

    const getDifficultyColor = (diff) => {
        switch (diff) {
            case 'EASY': return 'text-green-600 bg-green-100';
            case 'MEDIUM': return 'text-yellow-600 bg-yellow-100';
            case 'HARD': return 'text-red-600 bg-red-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-4xl mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center gap-2 text-gray-600 mb-2">
                        <Footprints size={20} />
                        <span className="font-medium">Steps</span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{route.steps}</p>
                </div>

                <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center gap-2 text-gray-600 mb-2">
                        <Activity size={20} />
                        <span className="font-medium">Difficulty</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${getDifficultyColor(route.difficulty)}`}>
                        {route.difficulty}
                    </span>
                </div>

                <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center gap-2 text-gray-600 mb-2">
                        <Trophy size={20} />
                        <span className="font-medium">Type</span>
                    </div>
                    <p className="text-xl font-bold text-blue-600">{route.routeType}</p>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Transformation Path</h3>
                <div className="flex flex-wrap items-center gap-2">
                    {route.path.map((word, index) => (
                        <React.Fragment key={index}>
                            <div className={`px-4 py-2 rounded-lg font-mono font-bold border-2 
                                ${index === 0 ? 'bg-green-50 border-green-200 text-green-700' :
                                    index === route.path.length - 1 ? 'bg-blue-50 border-blue-200 text-blue-700' :
                                        'bg-white border-gray-200 text-gray-700'}`}>
                                {word}
                            </div>
                            {index < route.path.length - 1 && (
                                <ArrowRight className="text-gray-400" size={20} />
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {route.transformations && (
                <div className="mt-8">
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Step-by-Step Details</h3>
                    <div className="space-y-3">
                        {route.transformations.map((trans, idx) => (
                            <div key={idx} className="flex items-center gap-4 bg-gray-50 p-3 rounded-md">
                                <span className="w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-700 rounded-full font-bold text-sm">
                                    {trans.stepNumber}
                                </span>
                                <div className="flex-1">
                                    <p className="text-gray-700 font-medium">
                                        {trans.from} <ArrowRight className="inline mx-1 w-4 h-4" /> {trans.to}
                                    </p>
                                    <p className="text-sm text-gray-500">{trans.description}</p>
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
