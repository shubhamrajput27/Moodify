import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlayer } from '../context/PlayerContext';

function formatTime(seconds) {
  const safe = Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0;
  const mins = Math.floor(safe / 60);
  const secs = safe % 60;
  return `${mins}:${String(secs).padStart(2, '0')}`;
}

export default function MiniPlayer() {
  const { currentTrack, isPlaying, pause, resume, clear } = usePlayer();
  const audioRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackError, setPlaybackError] = useState('');

  useEffect(() => {
    const audioEl = audioRef.current;
    if (!audioEl || !currentTrack?.previewUrl) {
      return;
    }

    audioEl.src = currentTrack.previewUrl;
    audioEl.load();
    setPlaybackError('');
    setCurrentTime(0);

    if (isPlaying) {
      audioEl.play().catch(() => {
        setPlaybackError('Preview playback is blocked by your browser. Press play to start.');
        pause();
      });
    }
  }, [currentTrack, isPlaying, pause]);

  useEffect(() => {
    const audioEl = audioRef.current;
    if (!audioEl || !currentTrack?.previewUrl) {
      return;
    }

    if (isPlaying) {
      audioEl.play().catch(() => {
        setPlaybackError('Unable to play this preview.');
        pause();
      });
      return;
    }

    audioEl.pause();
  }, [isPlaying, currentTrack, pause]);

  const progress = useMemo(() => {
    if (!duration) {
      return 0;
    }
    return Math.min(100, (currentTime / duration) * 100);
  }, [currentTime, duration]);

  if (!currentTrack) {
    return null;
  }

  return (
    <>
      <audio
        ref={audioRef}
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime || 0)}
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration || 0)}
        onEnded={pause}
        onError={() => {
          setPlaybackError('No preview is available for this track.');
          pause();
        }}
      />

      <AnimatePresence>
        <motion.div
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed bottom-4 left-1/2 z-[60] w-[calc(100%-1.5rem)] max-w-3xl -translate-x-1/2 rounded-2xl border border-gray-300 dark:border-white/10 bg-white/95 dark:bg-[#101010]/95 backdrop-blur-xl shadow-2xl"
        >
          <div className="px-4 pt-3 pb-4 sm:px-5">
            <div className="flex items-center gap-3">
              <img
                src={currentTrack.albumArt || '/placeholder-album.jpg'}
                alt={currentTrack.album || currentTrack.name}
                className="w-12 h-12 rounded-md object-cover"
              />

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{currentTrack.name}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{currentTrack.artist}</p>
              </div>

              <button
                onClick={isPlaying ? pause : resume}
                className="h-10 w-10 rounded-full bg-coral hover:bg-coral-dark text-white flex items-center justify-center transition-colors"
                aria-label={isPlaying ? 'Pause preview' : 'Play preview'}
                title={isPlaying ? 'Pause preview' : 'Play preview'}
              >
                {isPlaying ? '❚❚' : '▶'}
              </button>

              <button
                onClick={clear}
                className="h-10 w-10 rounded-full bg-gray-200 dark:bg-white/10 hover:bg-gray-300 dark:hover:bg-white/20 text-gray-700 dark:text-gray-200 transition-colors"
                aria-label="Close mini player"
                title="Close mini player"
              >
                ✕
              </button>
            </div>

            <div className="mt-3">
              <div className="h-1.5 w-full rounded-full bg-gray-200 dark:bg-white/10 overflow-hidden">
                <div className="h-full bg-coral transition-all duration-200" style={{ width: `${progress}%` }} />
              </div>
              <div className="mt-1 flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            <div className="mt-2 flex items-center justify-between gap-2">
              {playbackError ? (
                <p className="text-xs text-yellow-600 dark:text-yellow-400 truncate">{playbackError}</p>
              ) : (
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">30-second preview</p>
              )}

              {currentTrack.spotifyUrl && (
                <a
                  href={currentTrack.spotifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-coral hover:underline whitespace-nowrap"
                >
                  Open in Spotify
                </a>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
}