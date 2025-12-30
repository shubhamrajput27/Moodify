import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Handle login/signup logic here
      console.log('Form submitted:', formData);
    }, 1000);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSpotifyLogin = () => {
    // Redirect to Spotify OAuth
    window.location.href = 'http://localhost:5000/api/spotify/login';
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-white dark:bg-[#0a0a0a] transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-2 text-gray-900 dark:text-white">
                {isLogin ? 'Welcome Back!' : 'Create Account'}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {isLogin ? 'Login to continue your music journey' : 'Sign up to discover personalized music'}
              </p>
            </div>

            {/* Login Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-gray-50 dark:bg-dark-800/50 border border-gray-200 dark:border-white/5 rounded-2xl p-8 shadow-lg"
            >
              {/* Spotify Login Button */}
              <button
                onClick={handleSpotifyLogin}
                className="w-full bg-[#1DB954] hover:bg-[#1ed760] text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 flex items-center justify-center gap-3 mb-6 shadow-lg hover:shadow-xl hover:scale-105"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                </svg>
                Continue with Spotify
              </button>

              {/* Divider */}
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-gray-50 dark:bg-dark-800/50 text-gray-500 dark:text-gray-400">
                    or continue with email
                  </span>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required={!isLogin}
                      placeholder="John Doe"
                      className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-coral transition-colors duration-300"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-coral transition-colors duration-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="••••••••"
                    className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-coral transition-colors duration-300"
                  />
                </div>

                {error && (
                  <div className="bg-red-500/20 border border-red-500 rounded-lg p-3 text-red-200 text-sm">
                    {error}
                  </div>
                )}

                {isLogin && (
                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center text-gray-600 dark:text-gray-400">
                      <input type="checkbox" className="mr-2 rounded" />
                      Remember me
                    </label>
                    <a href="#" className="text-coral hover:underline">
                      Forgot password?
                    </a>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                      {isLogin ? 'Logging in...' : 'Creating account...'}
                    </span>
                  ) : (
                    isLogin ? 'Login' : 'Sign Up'
                  )}
                </button>
              </form>

              {/* Toggle Login/Signup */}
              <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                {isLogin ? "Don't have an account? " : 'Already have an account? '}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-coral font-semibold hover:underline"
                >
                  {isLogin ? 'Sign Up' : 'Login'}
                </button>
              </div>
            </motion.div>

            {/* Back to Home */}
            <div className="text-center mt-6">
              <Link to="/" className="text-gray-600 dark:text-gray-400 hover:text-coral transition-colors">
                ← Back to Home
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
