import { useState } from 'react';
import { motion } from 'framer-motion';
import { classifyTextMood, getMoodData } from '../utils/moodMapper';

export default function TextMoodInput({ onMoodDetected }) {
  const [text, setText] = useState('');
  const [detectedMood, setDetectedMood] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = () => {
    if (!text.trim()) return;

    setIsAnalyzing(true);

    // Simulate processing time
    setTimeout(() => {
      const mood = classifyTextMood(text);
      setDetectedMood(mood);
      setIsAnalyzing(false);
      
      if (onMoodDetected) {
        onMoodDetected(mood);
      }
    }, 800);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAnalyze();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 rounded-2xl bg-gray-50 dark:bg-dark-800/50 border border-gray-200 dark:border-white/5 transition-colors duration-300"
    >
      <div className="flex items-center gap-3 mb-4">
        <span className="text-3xl">💭</span>
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Text Input</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Describe how you're feeling</p>
        </div>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="e.g., I'm feeling happy and excited today!"
        className="w-full bg-white dark:bg-white/5 border border-gray-300 dark:border-white/20 rounded-lg p-4 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-coral resize-none transition-colors duration-300"
        rows="4"
      />

      <button
        onClick={handleAnalyze}
        disabled={!text.trim() || isAnalyzing}
        className="btn-primary w-full mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isAnalyzing ? (
          <span className="flex items-center justify-center gap-2">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
            />
            Analyzing...
          </span>
        ) : (
          'Analyze Mood'
        )}
      </button>

      {detectedMood && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`mt-4 p-4 rounded-lg bg-gradient-to-r ${getMoodData(detectedMood).color}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Detected Mood</p>
              <p className="text-2xl font-bold capitalize">{detectedMood}</p>
            </div>
            <span className="text-4xl">{getMoodData(detectedMood).emoji}</span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
