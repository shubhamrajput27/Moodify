import { createContext, useContext, useMemo, useState } from 'react';

const PlayerContext = createContext();

export function PlayerProvider({ children }) {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const playTrack = (track) => {
    if (!track?.previewUrl) {
      return false;
    }

    if (currentTrack?.id === track.id) {
      setIsPlaying((prev) => !prev);
      return true;
    }

    setCurrentTrack(track);
    setIsPlaying(true);
    return true;
  };

  const pause = () => setIsPlaying(false);
  const resume = () => {
    if (currentTrack?.previewUrl) {
      setIsPlaying(true);
    }
  };

  const clear = () => {
    setCurrentTrack(null);
    setIsPlaying(false);
  };

  const value = useMemo(() => ({
    currentTrack,
    isPlaying,
    playTrack,
    pause,
    resume,
    clear,
  }), [currentTrack, isPlaying]);

  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within PlayerProvider');
  }
  return context;
}