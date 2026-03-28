import { Link } from 'react-router-dom';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-300 dark:border-white/10 bg-white dark:bg-[#0a0a0a] transition-colors duration-300">
      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <img
              src="/spotify-favicon.svg"
              alt="Moodify logo"
              className="w-6 h-6 rounded"
            />
            <span className="font-semibold">Moodify</span>
          </div>

          <div className="flex items-center gap-5 text-sm">
            <Link to="/" className="text-gray-600 dark:text-gray-400 hover:text-coral transition-colors">
              Home
            </Link>
            <Link to="/recommend" className="text-gray-600 dark:text-gray-400 hover:text-coral transition-colors">
              Recommendations
            </Link>
            <Link to="/login" className="text-gray-600 dark:text-gray-400 hover:text-coral transition-colors">
              Login
            </Link>
          </div>

          <p className="text-sm text-gray-500 dark:text-gray-500">© {year} Moodify. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}