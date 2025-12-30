import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Home() {
  const features = [
    {
      icon: '💭',
      title: 'Text Input',
      description: 'Describe your mood in words'
    },
    {
      icon: '📸',
      title: 'Facial Recognition',
      description: 'Let AI read your expressions'
    },
    {
      icon: '🎤',
      title: 'Voice Analysis',
      description: 'Speak your feelings out loud'
    }
  ];

  const moods = [
    { emoji: '😊', name: 'Happy', color: 'from-yellow-400 to-orange-500' },
    { emoji: '😢', name: 'Sad', color: 'from-blue-400 to-blue-600' },
    { emoji: '😠', name: 'Angry', color: 'from-red-500 to-red-700' },
    { emoji: '😌', name: 'Relaxed', color: 'from-green-400 to-teal-500' },
    { emoji: '⚡', name: 'Energetic', color: 'from-purple-500 to-pink-600' },
    { emoji: '❤️', name: 'Romantic', color: 'from-pink-400 to-red-500' }
  ];

  return (
    <div className="min-h-screen pt-20 transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center bg-gradient-to-b from-white via-gray-50 to-white dark:from-[#0a0a0a] dark:via-[#0f0f0f] dark:to-[#0a0a0a]">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-coral/10 to-transparent" />
        
        <div className="container mx-auto px-4 py-20 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-5xl md:text-7xl font-bold mb-6 text-gray-900 dark:text-white"
            >
              Welcome to Moodify
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              The AI-powered emotion-based music recommendation app that matches your mood with the perfect soundtrack.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex gap-4 justify-center items-center flex-wrap"
            >
              <Link to="/recommend">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary text-base px-8 py-3"
                >
                  Get Started
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Floating music notes animation */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-4xl opacity-20"
              initial={{ 
                x: Math.random() * window.innerWidth, 
                y: window.innerHeight + 100 
              }}
              animate={{ 
                y: -100,
                x: Math.random() * window.innerWidth
              }}
              transition={{
                duration: 10 + Math.random() * 5,
                repeat: Infinity,
                delay: i * 2
              }}
            >
              🎵
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-100 dark:bg-[#121212] border-y border-gray-300 dark:border-white/5">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">Features</h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">Choose your preferred method of mood detection</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                whileHover={{ y: -5 }}
                className="p-8 rounded-2xl bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 text-center hover:border-coral/40 hover:bg-gray-50 dark:hover:bg-[#1e1e1e] transition-all duration-300 shadow-sm dark:shadow-none"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Moods Section */}
      <section className="py-24 bg-white dark:bg-[#0a0a0a]">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Supported Moods</h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">We understand every emotion</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-6xl mx-auto">
            {moods.map((mood, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.1, rotate: 5 }}
                className={`mood-card text-center bg-gradient-to-br ${mood.color}`}
              >
                <div className="text-5xl mb-2">{mood.emoji}</div>
                <p className="font-semibold">{mood.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-b from-white via-gray-50 to-white dark:from-[#0a0a0a] dark:via-[#0f0f0f] dark:to-[#0a0a0a] border-y border-gray-300 dark:border-white/5">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">Your Mood. Your Music.</h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-10 max-w-2xl mx-auto">
              Simply tell us how you feel, and we'll take care of the rest. Moodify - music that understands you.
            </p>
            <Link to="/recommend">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary text-lg px-10 py-3"
              >
                Start Discovering
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-white dark:bg-[#0a0a0a] border-t border-gray-300 dark:border-white/10">
        <div className="container mx-auto px-4 text-center text-gray-500 dark:text-gray-500">
          <p className="text-sm">© 2025 Moodify. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
