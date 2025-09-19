
import React, { useState, useCallback } from 'react';
import { searchEbikes, getBikeAnalysisById } from './services/searchService';
import type { EbikeAnalysisResult, MultipleMatchResult, BikeOption } from './types';
import LoadingSpinner from './components/LoadingSpinner';
import StateLegalityCard from './components/StateLegalityCard';

const BoltIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
    </svg>
);


const App: React.FC = () => {
  const [ebikeInput, setEbikeInput] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<EbikeAnalysisResult | null>(null);
  const [multipleMatches, setMultipleMatches] = useState<MultipleMatchResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [geminiEnabled, setGeminiEnabled] = useState<boolean>(true);
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);

  const handleSearch = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();
    if (!ebikeInput.trim()) {
      setError('Please enter an e-bike name and model.');
      return;
    }
    
    // Validate input is specific enough (require at least 2 words or 6 characters)
    const inputWords = ebikeInput.trim().split(/\s+/).filter(word => word.length > 0);
    if (inputWords.length < 2 && ebikeInput.trim().length < 6) {
      setError('Please be more specific. Include both the brand name and model (e.g., "Specialized Turbo Vado" not just "Dirodi").');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    setMultipleMatches(null);
    setIsUnlocked(false);

    try {
      const result = await searchEbikes(ebikeInput, geminiEnabled);
      
      if ('type' in result && result.type === 'multiple_matches') {
        setMultipleMatches(result);
      } else {
        setAnalysisResult(result as EbikeAnalysisResult);
      }
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Failed to analyze e-bike. ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, [ebikeInput, geminiEnabled]);

  const handleBikeSelection = useCallback(async (bikeId: string) => {
    setIsLoading(true);
    setError(null);
    setMultipleMatches(null);
    setIsUnlocked(false); // Reset unlock state when selecting new bike

    try {
      const result = await getBikeAnalysisById(bikeId);
      setAnalysisResult(result);
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Failed to load bike details. ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleUnlockToggle = useCallback(async () => {
    if (!analysisResult || !analysisResult.canUnlock || !analysisResult.bikeId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const newUnlockedState = !isUnlocked;
      const result = await getBikeAnalysisById(analysisResult.bikeId, newUnlockedState);
      setAnalysisResult(result);
      setIsUnlocked(newUnlockedState);
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Failed to toggle unlock state. ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, [analysisResult, isUnlocked]);
  
  const renderResults = () => {
    if (!analysisResult) return null;

    if (!analysisResult.found) {
        return (
            <div className="text-center bg-gray-800 p-6 rounded-lg">
                <h2 className="text-2xl font-bold text-yellow-400">Could not find: {analysisResult.ebikeName || ebikeInput}</h2>
                <p className="text-gray-300 mt-2">The AI could not find specific details for this e-bike model. Please try being more specific with the name and model number.</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="bg-gray-800 p-6 rounded-lg shadow-inner">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                        {analysisResult.imageUrl && (
                            <img 
                                src={analysisResult.imageUrl} 
                                alt={analysisResult.ebikeName}
                                className="w-20 h-20 object-cover rounded-lg border border-gray-600 bg-white p-1"
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                }}
                            />
                        )}
                        <div>
                            <h2 className="text-3xl font-bold text-white">
                                <span className="text-sky-400">{analysisResult.ebikeName}</span>
                            </h2>
                            {analysisResult.manufacturerUrl && (
                                <a 
                                    href={analysisResult.manufacturerUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-sm text-blue-400 hover:text-blue-300 underline mt-1 block"
                                >
                                    View on Manufacturer Website →
                                </a>
                            )}
                        </div>
                    </div>
                    {analysisResult.canUnlock && (
                        <div className="flex items-center gap-3">
                            <label className="text-sm text-gray-300">E-bike Unlocked</label>
                            <button
                                onClick={handleUnlockToggle}
                                disabled={isLoading}
                                className={`relative w-14 h-7 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-gray-800 ${
                                    isUnlocked ? 'bg-sky-600' : 'bg-gray-600'
                                } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                            >
                                <span className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform duration-200 ${
                                    isUnlocked ? 'translate-x-7' : 'translate-x-0'
                                }`} />
                            </button>
                        </div>
                    )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-700/50 p-4 rounded-md">
                        <div className="text-center mb-2">
                            <p className="text-sm text-gray-400">Motor Power</p>
                            <p className="text-xl font-semibold text-white">{analysisResult.wattage.value}W</p>
                            <div className="flex items-center justify-center gap-1 mt-1">
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                    analysisResult.wattage.confidence === 'high' ? 'bg-green-900/50 text-green-300' :
                                    analysisResult.wattage.confidence === 'medium' ? 'bg-yellow-900/50 text-yellow-300' :
                                    'bg-red-900/50 text-red-300'
                                }`}>
                                    {analysisResult.wattage.confidence} confidence
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-700/50 p-4 rounded-md">
                        <div className="text-center mb-2">
                            <p className="text-sm text-gray-400">Throttle</p>
                            <p className="text-xl font-semibold text-white">{analysisResult.hasThrottle.value ? 'Yes' : 'No'}</p>
                            <div className="flex items-center justify-center gap-1 mt-1">
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                    analysisResult.hasThrottle.confidence === 'high' ? 'bg-green-900/50 text-green-300' :
                                    analysisResult.hasThrottle.confidence === 'medium' ? 'bg-yellow-900/50 text-yellow-300' :
                                    'bg-red-900/50 text-red-300'
                                }`}>
                                    {analysisResult.hasThrottle.confidence} confidence
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-700/50 p-4 rounded-md">
                        <div className="text-center mb-2">
                            <p className="text-sm text-gray-400">Type</p>
                            <p className="text-xl font-semibold text-white">
                                {analysisResult.wattage.value <= 200 && !analysisResult.hasThrottle.value 
                                    ? 'Power-assisted pedal cycles' 
                                    : 'Electrically power-assisted'}
                            </p>
                            <div className="flex items-center justify-center gap-1 mt-1">
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                    analysisResult.isPedalAssist.confidence === 'high' ? 'bg-green-900/50 text-green-300' :
                                    analysisResult.isPedalAssist.confidence === 'medium' ? 'bg-yellow-900/50 text-yellow-300' :
                                    'bg-red-900/50 text-red-300'
                                }`}>
                                    {analysisResult.isPedalAssist.confidence} confidence
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {analysisResult.legality.map(info => (
                    <StateLegalityCard key={info.state} legalityInfo={info} />
                ))}
            </div>
            
            <div className="text-center text-xs text-gray-500 pt-4">
                <p>*This tool provides guidance for use on public roads. Legality for off-road use on public trails (e.g., national parks) may vary. Always check local park regulations.</p>
            </div>
        </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
            <div className="flex items-center justify-center gap-3">
                <BoltIcon className="w-10 h-10 text-sky-400" />
                <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">
                    Aussie E-Bike Legality Checker
                </h1>
            </div>
            <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
                Enter your complete e-bike brand and model to check if it's street-legal across Australian states based on its power and features.
            </p>
        </header>

        <main>
          {/* Gemini Toggle */}
          <div className="max-w-2xl mx-auto mb-4">
            <div className="flex items-center justify-center gap-3 p-3 bg-gray-800/50 border border-gray-700 rounded-lg">
              <span className="text-sm text-gray-400">AI Search (Gemini):</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={geminiEnabled}
                  onChange={(e) => setGeminiEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sky-300/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-600"></div>
              </label>
              <span className={`text-sm font-medium ${geminiEnabled ? 'text-orange-400' : 'text-green-400'}`}>
                {geminiEnabled ? 'Enabled (costs money)' : 'Database only (free)'}
              </span>
            </div>
          </div>

          <form onSubmit={handleSearch} className="mb-8 max-w-2xl mx-auto flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={ebikeInput}
              onChange={(e) => setEbikeInput(e.target.value)}
              placeholder="e.g., 'Specialized Turbo Vado 4.0' (include brand + model)"
              className="w-full px-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition text-white placeholder-gray-500"
              disabled={isLoading}
              aria-label="E-bike model name"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center justify-center px-6 py-3 bg-sky-600 text-white font-semibold rounded-md hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-sky-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-200"
            >
              Check
            </button>
          </form>

          {/* Data Source Indicator */}
          {analysisResult && !isLoading && !error && (
            <div className="max-w-2xl mx-auto mb-4">
              <div className={`text-center px-3 py-2 rounded-md text-sm font-medium ${
                analysisResult.dataSource === 'database' 
                  ? 'bg-green-900/50 border border-green-500/50 text-green-400' 
                  : 'bg-orange-900/50 border border-orange-500/50 text-orange-400'
              }`}>
                {analysisResult.dataSource === 'database' ? (
                  <>
                    <span className="inline-block w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                    Results from database (instant, no AI cost)
                  </>
                ) : (
                  <>
                    <span className="inline-block w-2 h-2 bg-orange-400 rounded-full mr-2"></span>
                    Results from AI analysis (Gemini API used)
                  </>
                )}
              </div>
            </div>
          )}

          <div className="mt-8">
            {isLoading && <LoadingSpinner />}
            {error && <p className="text-center text-red-400 bg-red-900/50 border border-red-500/50 p-4 rounded-md" role="alert">{error}</p>}
            
            {/* Multiple Matches Selection */}
            {!isLoading && !error && multipleMatches && (
              <div className="max-w-4xl mx-auto">
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Multiple matches found for "{multipleMatches.query}"
                  </h3>
                  <p className="text-gray-400 mb-6">Please select the specific model you're looking for:</p>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    {multipleMatches.matches.map((bike) => (
                      <button
                        key={bike.id}
                        onClick={() => handleBikeSelection(bike.id)}
                        className="text-left p-4 bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-lg transition-all duration-200 hover:border-sky-500"
                      >
                        <div className="font-semibold text-white text-lg">{bike.name}</div>
                        <div className="text-sky-400 font-medium">{bike.brand} - {bike.model}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {!isLoading && !error && analysisResult && renderResults()}
            {!isLoading && !error && !analysisResult && !multipleMatches && (
                <div className="text-center text-gray-500 p-8 bg-gray-800/50 rounded-lg">
                    <p>Results will be displayed here.</p>
                </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
