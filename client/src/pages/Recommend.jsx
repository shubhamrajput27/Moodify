import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TextMoodInput from '../components/TextMoodInput';
import FaceMoodDetector from '../components/FaceMoodDetector';
import VoiceMoodDetector from '../components/VoiceMoodDetector';
import SongCard from '../components/SongCard';
import spotifyAPI from '../utils/spotify';
import { getMoodData } from '../utils/moodMapper';

export default function Recommend() {
  const [activeTab, setActiveTab] = useState('text');
  const [currentMood, setCurrentMood] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const tabs = [
    { id: 'text', label: 'Text', icon: '💭' },
    { id: 'face', label: 'Face', icon: '📸' },
    { id: 'voice', label: 'Voice', icon: '🎤' }
  ];

  const handleMoodDetected = async (mood) => {
    setCurrentMood(mood);
    setError(null);
    setIsLoading(true);
    setSearchQuery('');
    setSearchResults([]);

    try {
      const data = await spotifyAPI.getRecommendations(mood, 20);
      setRecommendations(data.tracks);
    } catch (err) {
      setError(err.message || 'Failed to fetch recommendations');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setError(null);
    setCurrentMood(null);
    setRecommendations([]);

    try {
      const data = await spotifyAPI.searchTracks(searchQuery, 20);
      setSearchResults(data.tracks);
    } catch (err) {
      setError(err.message || 'Failed to search tracks');
      console.error('Error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const displayedSongs = searchResults.length > 0 ? searchResults : recommendations;

  return (
    <div className="min-h-screen pt-24 pb-12 bg-white dark:bg-[#0a0a0a] transition-colors duration-300">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-coral to-primary-500 bg-clip-text text-transparent">
            Discover Your Music
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Tell us how you're feeling, and we'll find the perfect tracks for you
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-2xl mx-auto mb-8"
        >
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for songs, artists, or albums..."
              className="w-full px-6 py-4 bg-gray-100 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-full text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-coral pr-32 transition-colors duration-300"
            />
            <button
              type="submit"
              disabled={!searchQuery.trim() || isSearching}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-coral hover:bg-coral-dark text-white font-medium rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSearching ? '🔍 Searching...' : '🔍 Search'}
            </button>
          </form>
          {searchResults.length > 0 && (
            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
              Found {searchResults.length} results for "{searchQuery}"
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSearchResults([]);
                }}
                className="ml-2 text-coral hover:underline"
              >
                Clear
              </button>
            </p>
          )}
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex justify-center gap-4 mb-8">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-coral text-white shadow-lg'
                  : 'bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-white/20'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </motion.button>
          ))}
        </div>

        {/* Mood Detection Section */}
        <div className="max-w-2xl mx-auto mb-12">
          <AnimatePresence mode="wait">
            {activeTab === 'text' && (
              <motion.div
                key="text"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <TextMoodInput onMoodDetected={handleMoodDetected} />
              </motion.div>
            )}

            {activeTab === 'face' && (
              <motion.div
                key="face"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <FaceMoodDetector onMoodDetected={handleMoodDetected} />
              </motion.div>
            )}

            {activeTab === 'voice' && (
              <motion.div
                key="voice"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <VoiceMoodDetector onMoodDetected={handleMoodDetected} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Current Mood Display */}
        {currentMood && !isLoading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center mb-12"
          >
            <div className={`inline-block px-8 py-4 rounded-2xl bg-gradient-to-r ${getMoodData(currentMood).color}`}>
              <p className="text-white text-sm font-medium mb-1">Your Current Mood</p>
              <div className="flex items-center gap-3">
                <span className="text-4xl">{getMoodData(currentMood).emoji}</span>
                <span className="text-3xl font-bold text-white capitalize">{currentMood}</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Loading State */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-16 h-16 border-4 border-coral border-t-transparent rounded-full mx-auto mb-4"
            />
            <p className="text-gray-600 dark:text-gray-400 text-lg">Finding the perfect songs for you...</p>
          </motion.div>
        )}

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-2xl mx-auto bg-red-500/20 border border-red-500 rounded-lg p-6 text-center"
          >
            <p className="text-red-200 text-lg">{error}</p>
            <button
              onClick={() => handleMoodDetected(currentMood)}
              className="btn-primary mt-4"
            >
              Try Again
            </button>
          </motion.div>
        )}

        {/* Recommendations Grid */}
        {!isLoading && !isSearching && displayedSongs.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
                {searchResults.length > 0 ? 'Search Results' : 'Recommended for You'}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {displayedSongs.length} tracks {currentMood ? `curated based on your ${currentMood} mood` : 'matching your search'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {displayedSongs.map((song, index) => (
                <SongCard key={song.id} song={song} index={index} />
              ))}
            </div>

            {/* Refresh Button */}
            {currentMood && (
              <div className="text-center mt-12">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleMoodDetected(currentMood)}
                  className="btn-secondary"
                >
                  🔄 Get More Recommendations
                </motion.button>
              </div>
            )}
          </motion.div>
        )}

        {/* Empty State */}
        {!isLoading && !isSearching && !error && displayedSongs.length === 0 && !currentMood && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">🎵</div>
            <h3 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-white">Ready to Start?</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Search for songs or choose a mood detection method above to get personalized music recommendations
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
