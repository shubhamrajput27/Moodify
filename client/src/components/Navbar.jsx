import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-gray-200 dark:border-white/5 transition-colors duration-300"
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="text-2xl"
            >
              🎵
            </motion.div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Moodify
              </h1>
            </div>
          </Link>

          {/* Navigation Links & Theme Toggle */}
          <div className="flex items-center gap-2">
            <NavLink to="/" active={location.pathname === '/'}>
              HOME
            </NavLink>
            <NavLink to="/recommend" active={location.pathname === '/recommend'}>
              RECOMMENDATIONS
            </NavLink>
            
            {/* Theme Toggle Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="ml-2 p-2 rounded-full bg-gray-200 dark:bg-white/10 hover:bg-gray-300 dark:hover:bg-white/20 transition-all"
              aria-label="Toggle theme"
            >
              <span className="text-xl">
                {theme === 'dark' ? '☀️' : '🌙'}
              </span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}

function NavLink({ to, active, children }) {
  return (
    <Link to={to}>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
          active
            ? 'bg-coral text-white'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/5'
        }`}
      >
        {children}
      </motion.div>
    </Link>
  );
}
