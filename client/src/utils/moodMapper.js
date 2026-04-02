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
  anxious: {
    genres: ['alt-rock', 'indie', 'electronic'],
    emoji: '😰',
    color: 'from-indigo-500 to-purple-600',
    description: 'Restless and tense energy'
  },
  nostalgic: {
    genres: ['oldies', 'acoustic', 'indie'],
    emoji: '📼',
    color: 'from-amber-400 to-orange-500',
    description: 'Warm throwback memories'
  },
  stressed: {
    genres: ['lo-fi', 'ambient', 'piano'],
    emoji: '😵',
    color: 'from-rose-500 to-orange-500',
    description: 'Overloaded and seeking balance'
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
  const normalized = String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s']/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const words = normalized.split(' ').filter(Boolean);
  const wordSet = new Set(words);

  const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  const countPhraseMatches = (input, phrase) => {
    const escaped = escapeRegex(phrase).replace(/\s+/g, '\\s+');
    const regex = new RegExp(`\\b${escaped}\\b`, 'g');
    const matches = input.match(regex);
    return matches ? matches.length : 0;
  };

  const moodProfiles = {
    happy: {
      phrases: ['feeling great', 'in a good mood', 'on cloud nine', 'so happy'],
      keywords: ['happy', 'joy', 'joyful', 'great', 'wonderful', 'amazing', 'cheerful', 'delighted', 'pleased', 'glad'],
      patterns: [/\b(smiling|grinning|celebrating)\b/g]
    },
    sad: {
      phrases: ['feeling down', 'heart is heavy', 'want to cry', 'broken heart'],
      keywords: ['sad', 'sadness', 'depressed', 'down', 'unhappy', 'miserable', 'lonely', 'heartbroken', 'crying', 'tears', 'gloomy'],
      patterns: [/\b(cry|cried|crying|tearful|sorrow)\b/g]
    },
    angry: {
      phrases: ['so mad', 'pissed off', 'fed up', 'angry right now'],
      keywords: ['angry', 'mad', 'furious', 'rage', 'annoyed', 'frustrated', 'irritated', 'hate', 'fuming', 'fight', 'fighting', 'argument', 'argue', 'conflict', 'clash'],
      patterns: [/\b(raging|furious|infuriating|outraged|fighting|arguing|conflict)\b/g]
    },
    relaxed: {
      phrases: ['taking it easy', 'just chilling', 'laid back', 'feel relaxed'],
      keywords: ['relaxed', 'chill', 'peaceful', 'tranquil', 'serene', 'mellow', 'unwind'],
      patterns: [/\b(chilling|cooling\s+off|easygoing)\b/g]
    },
    calm: {
      phrases: ['at ease', 'deep breath', 'peace of mind', 'very calm'],
      keywords: ['calm', 'quiet', 'still', 'zen', 'meditation', 'breathe', 'balanced'],
      patterns: [/\b(grounded|mindful|centered)\b/g]
    },
    energetic: {
      phrases: ['full of energy', 'ready to go', 'fired up', 'pumped up'],
      keywords: ['energetic', 'pumped', 'hyped', 'active', 'workout', 'motivated', 'charged', 'boosted'],
      patterns: [/\b(excited|powerful|unstoppable)\b/g]
    },
    anxious: {
      phrases: ['can t relax', 'overthinking everything', 'feeling uneasy', 'on edge'],
      keywords: ['anxious', 'anxiety', 'nervous', 'worried', 'uneasy', 'panic', 'panicking', 'restless', 'overthinking'],
      patterns: [/\b(stomach\s+in\s+knots|can\s*t\s*sleep|racing\s+thoughts?)\b/g]
    },
    nostalgic: {
      phrases: ['good old days', 'miss those days', 'back in the day', 'old memories'],
      keywords: ['nostalgic', 'throwback', 'memories', 'retro', 'vintage', 'remembering'],
      patterns: [/\b(miss\s+the\s+past|blast\s+from\s+the\s+past)\b/g]
    },
    stressed: {
      phrases: ['too much pressure', 'burned out', 'under stress', 'overloaded with work'],
      keywords: ['stressed', 'stress', 'overwhelmed', 'pressure', 'burnout', 'tense', 'drained', 'exhausted'],
      patterns: [/\b(deadline|overloaded|burned\s+out|burnt\s+out)\b/g]
    },
    romantic: {
      phrases: ['in love', 'feeling romantic', 'my heart', 'thinking of you'],
      keywords: ['romantic', 'love', 'loving', 'affection', 'passion', 'intimate', 'tender', 'adore', 'crush', 'sweetheart', 'darling'],
      patterns: [/\b(heart\s+beats|crush|sweetheart|soulmate|lovey|adoring)\b/g]
    }
  };

  const strongSignals = {
    angry: ['fight', 'fighting', 'argument', 'argue', 'conflict', 'clash'],
    romantic: ['love', 'in love', 'loving', 'romantic', 'crush', 'soulmate']
  };

  const scores = {};

  for (const [mood, profile] of Object.entries(moodProfiles)) {
    let score = 0;

    for (const phrase of profile.phrases) {
      score += countPhraseMatches(normalized, phrase) * 3;
    }

    for (const keyword of profile.keywords) {
      if (wordSet.has(keyword)) {
        score += 2;
      }
    }

    for (const pattern of profile.patterns) {
      const matches = normalized.match(pattern);
      score += matches ? matches.length * 2 : 0;
    }

    scores[mood] = score;
  }

  if (normalized.includes('not happy') || normalized.includes('unhappy')) {
    scores.happy = Math.max(0, scores.happy - 3);
    scores.sad += 2;
  }

  if (normalized.includes('not calm') || normalized.includes('can t focus')) {
    scores.calm = Math.max(0, scores.calm - 2);
    scores.stressed += 2;
  }

  for (const [mood, terms] of Object.entries(strongSignals)) {
    for (const term of terms) {
      const matches = countPhraseMatches(normalized, term);
      scores[mood] += matches * 6;
    }
  }

  const bestMatch = Object.entries(scores).sort(([, a], [, b]) => b - a)[0];
  return bestMatch && bestMatch[1] > 0 ? bestMatch[0] : 'relaxed';
};
