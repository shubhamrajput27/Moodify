import { useState } from 'react';
import { motion } from 'framer-motion';

export default function SongCard({ song, index }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioError, setAudioError] = useState(false);

  const handlePlayPreview = () => {
    if (!song.previewUrl) {
      setAudioError(true);
      return;
    }

    const audio = new Audio(song.previewUrl);
    
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play()
        .then(() => {
          setIsPlaying(true);
          audio.onended = () => setIsPlaying(false);
        })
        .catch(err => {
          console.error('Error playing audio:', err);
          setAudioError(true);
        });
    }
  };

  const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds.padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="song-card group"
    >
      {/* Album Art */}
      <div className="relative overflow-hidden">
        <img
          src={song.albumArt || '/placeholder-album.jpg'}
          alt={song.album}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
        />
        
        {/* Play Button Overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handlePlayPreview}
            disabled={!song.previewUrl}
            className={`w-16 h-16 rounded-full flex items-center justify-center ${
              song.previewUrl 
                ? 'bg-primary-600 hover:bg-primary-700' 
                : 'bg-gray-600 cursor-not-allowed'
            } text-white transition-colors`}
          >
            {isPlaying ? (
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
            )}
          </motion.button>
        </div>

        {/* Popularity Badge */}
        {song.popularity && (
          <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-semibold">
            🔥 {song.popularity}%
          </div>
        )}
      </div>

      {/* Song Info */}
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1 truncate group-hover:text-primary-400 transition-colors">
          {song.name}
        </h3>
        <p className="text-gray-400 text-sm mb-1 truncate">{song.artist}</p>
        <p className="text-gray-500 text-xs truncate mb-3">{song.album}</p>

        {/* Duration */}
        {song.duration && (
          <p className="text-gray-500 text-xs mb-3">
            ⏱️ {formatDuration(song.duration)}
          </p>
        )}

        {audioError && (
          <p className="text-yellow-500 text-xs mb-3">Preview not available</p>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <a
            href={song.spotifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 btn-primary text-center text-sm py-2"
          >
            Open in Spotify
          </a>
        </div>
      </div>
    </motion.div>
  );
}
