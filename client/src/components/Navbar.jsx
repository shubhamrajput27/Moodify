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
      className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-[#1a1a1a] transition-colors duration-300 shadow-sm"
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🎵</span>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Moodify
            </h1>
          </Link>

          {/* Navigation Links & Theme Toggle */}
          <div className="flex items-center gap-6">
            <NavLink to="/" active={location.pathname === '/' || location.pathname === '/home'} icon="🏠">
              HOME
            </NavLink>
            <NavLink to="/profile" active={location.pathname === '/profile'} icon="👤">
              PROFILE
            </NavLink>
            <NavLink to="/recommend" active={location.pathname === '/recommend'} icon="🎯">
              RECOMMENDATIONS
            </NavLink>
            <NavLink to="/login" active={location.pathname === '/login'} icon="🔐">
              LOGIN
            </NavLink>
            
            {/* Theme Toggle Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-all"
              aria-label="Toggle theme"
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              <span className="text-2xl">
                {theme === 'dark' ? '☀️' : '🌙'}
              </span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}

function NavLink({ to, active, children, icon }) {
  return (
    <Link to={to}>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium transition-all ${
          active
            ? 'text-coral'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
        }`}
      >
        <span>{icon}</span>
        <span>{children}</span>
      </motion.div>
    </Link>
  );
}
