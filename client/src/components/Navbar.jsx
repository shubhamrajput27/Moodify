import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogoClick = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-[#1a1a1a] transition-colors duration-300 shadow-sm"
    >
      <div className="container mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between gap-3">
          {/* Logo */}
          <Link
            to="/"
            onClick={handleLogoClick}
            className="flex items-center gap-2"
            title="Go to Home"
            aria-label="Go to Home"
          >
            <img
              src="/spotify-favicon.svg"
              alt="Spotify logo"
              className="w-7 h-7 rounded-md"
            />
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Moodify
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <NavLink to="/" active={location.pathname === '/' || location.pathname === '/home'} icon="🏠">
              HOME
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

          {/* Mobile Actions */}
          <div className="md:hidden flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-all"
              aria-label="Toggle theme"
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              <span className="text-xl">
                {theme === 'dark' ? '☀️' : '🌙'}
              </span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-all"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-nav-menu"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              title={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              <span className="text-xl text-gray-800 dark:text-gray-100">
                {isMobileMenuOpen ? '✕' : '☰'}
              </span>
            </motion.button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <motion.div
            id="mobile-nav-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden mt-4 rounded-xl border border-gray-200/70 dark:border-white/10 bg-white/95 dark:bg-[#1a1a1a]/95 backdrop-blur-sm p-2"
          >
            <div className="flex flex-col">
              <NavLink
                to="/"
                active={location.pathname === '/' || location.pathname === '/home'}
                icon="🏠"
                mobile
              >
                HOME
              </NavLink>
              <NavLink
                to="/recommend"
                active={location.pathname === '/recommend'}
                icon="🎯"
                mobile
              >
                RECOMMENDATIONS
              </NavLink>
              <NavLink
                to="/login"
                active={location.pathname === '/login'}
                icon="🔐"
                mobile
              >
                LOGIN
              </NavLink>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}

function NavLink({ to, active, children, icon, mobile = false }) {
  return (
    <Link to={to}>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`flex items-center gap-2 ${mobile ? 'w-full rounded-lg px-3 py-2.5' : 'px-3 py-1.5'} text-sm font-medium transition-all ${
          active
            ? 'text-coral'
            : mobile
              ? 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
        }`}
      >
        <span>{icon}</span>
        <span>{children}</span>
      </motion.div>
    </Link>
  );
}
