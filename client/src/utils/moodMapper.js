/**
 * Mood to genre/audio features mapper
 */
export const moodMapper = {
  happy: {
    genres: ['pop', 'dance', 'party'],
    emoji: '😊',
    color: 'from-yellow-400 to-orange-500',
    description: 'Upbeat and joyful vibes'
  },
  sad: {
    genres: ['acoustic', 'piano', 'sad'],
    emoji: '😢',
    color: 'from-blue-400 to-blue-600',
    description: 'Melancholic and emotional'
  },
  angry: {
    genres: ['metal', 'rock', 'hard-rock'],
    emoji: '😠',
    color: 'from-red-500 to-red-700',
    description: 'Intense and aggressive'
  },
  relaxed: {
    genres: ['ambient', 'chill', 'study'],
    emoji: '😌',
    color: 'from-green-400 to-teal-500',
    description: 'Calm and peaceful'
  },
  calm: {
    genres: ['ambient', 'lo-fi', 'classical'],
    emoji: '🧘',
    color: 'from-cyan-400 to-blue-500',
    description: 'Tranquil and meditative'
  },
  energetic: {
    genres: ['edm', 'workout', 'electronic'],
    emoji: '⚡',
    color: 'from-purple-500 to-pink-600',
    description: 'High-energy and pumped'
  },
  romantic: {
    genres: ['romance', 'soul', 'r-n-b'],
    emoji: '❤️',
    color: 'from-pink-400 to-red-500',
    description: 'Loving and passionate'
  }
};

/**
 * Get mood data by mood name
 */
export const getMoodData = (mood) => {
  return moodMapper[mood.toLowerCase()] || moodMapper.happy;
};

/**
 * Get all available moods
 */
export const getAllMoods = () => {
  return Object.keys(moodMapper);
};

/**
 * Classify text into mood categories
 */
export const classifyTextMood = (text) => {
  const lowerText = text.toLowerCase();
  
  const keywords = {
    happy: ['happy', 'joy', 'excited', 'great', 'wonderful', 'amazing', 'love', 'cheerful'],
    sad: ['sad', 'depressed', 'down', 'unhappy', 'miserable', 'lonely', 'heartbroken'],
    angry: ['angry', 'mad', 'furious', 'rage', 'annoyed', 'frustrated', 'hate'],
    relaxed: ['relaxed', 'chill', 'calm', 'peaceful', 'tranquil', 'mellow'],
    calm: ['calm', 'quiet', 'still', 'zen', 'meditation'],
    energetic: ['energetic', 'pumped', 'hyped', 'active', 'workout'],
    romantic: ['romantic', 'love', 'loving', 'passion', 'intimate']
  };

  let bestMood = 'relaxed';
  let maxScore = 0;

  for (const [mood, moodKeywords] of Object.entries(keywords)) {
    const score = moodKeywords.filter(keyword => lowerText.includes(keyword)).length;
    if (score > maxScore) {
      maxScore = score;
      bestMood = mood;
    }
  }

  return bestMood;
};
