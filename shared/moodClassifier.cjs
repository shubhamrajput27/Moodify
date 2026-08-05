/**
 * Single source of truth for rule-based mood classification, shared by the
 * Express server (server/routes/mood.js) and the Vercel functions
 * (api/mood/*.js). See shared/spotifyService.cjs for why this lives here
 * instead of being duplicated per deployment target.
 */
function normalizeText(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s']/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function countPhraseMatches(input, phrase) {
  const escaped = escapeRegex(phrase).replace(/\s+/g, '\\s+');
  const regex = new RegExp(`\\b${escaped}\\b`, 'g');
  const matches = input.match(regex);
  return matches ? matches.length : 0;
}

function classifyMoodFromText(text) {
  const normalized = normalizeText(text);
  const words = normalized.split(' ').filter(Boolean);
  const wordSet = new Set(words);

  const moodProfiles = {
    happy: {
      phrases: ['feeling great', 'in a good mood', 'on cloud nine', 'so happy'],
      keywords: ['happy', 'joy', 'joyful', 'great', 'wonderful', 'amazing', 'cheerful', 'delighted', 'pleased', 'glad'],
      patterns: [/\b(smiling|grinning|celebrating)\b/g],
    },
    sad: {
      phrases: ['feeling down', 'heart is heavy', 'want to cry', 'broken heart'],
      keywords: ['sad', 'sadness', 'depressed', 'down', 'unhappy', 'miserable', 'lonely', 'heartbroken', 'crying', 'tears', 'gloomy'],
      patterns: [/\b(cry|cried|crying|tearful|sorrow)\b/g],
    },
    angry: {
      phrases: ['so mad', 'pissed off', 'fed up', 'angry right now'],
      keywords: ['angry', 'mad', 'furious', 'rage', 'annoyed', 'frustrated', 'irritated', 'hate', 'fuming', 'fight', 'fighting', 'argument', 'argue', 'conflict', 'clash'],
      patterns: [/\b(raging|furious|infuriating|outraged|fighting|arguing|conflict)\b/g],
    },
    relaxed: {
      phrases: ['taking it easy', 'just chilling', 'laid back', 'feel relaxed'],
      keywords: ['relaxed', 'chill', 'peaceful', 'tranquil', 'serene', 'mellow', 'unwind'],
      patterns: [/\b(chilling|cooling\s+off|easygoing)\b/g],
    },
    calm: {
      phrases: ['at ease', 'deep breath', 'peace of mind', 'very calm'],
      keywords: ['calm', 'quiet', 'still', 'zen', 'meditation', 'breathe', 'balanced'],
      patterns: [/\b(grounded|mindful|centered)\b/g],
    },
    energetic: {
      phrases: ['full of energy', 'ready to go', 'fired up', 'pumped up'],
      keywords: ['energetic', 'pumped', 'hyped', 'active', 'workout', 'motivated', 'charged', 'boosted'],
      patterns: [/\b(excited|powerful|unstoppable)\b/g],
    },
    anxious: {
      phrases: ['can t relax', 'overthinking everything', 'feeling uneasy', 'on edge'],
      keywords: ['anxious', 'anxiety', 'nervous', 'worried', 'uneasy', 'panic', 'panicking', 'restless', 'overthinking'],
      patterns: [/\b(stomach\s+in\s+knots|can\s*t\s*sleep|racing\s+thoughts?)\b/g],
    },
    nostalgic: {
      phrases: ['good old days', 'miss those days', 'back in the day', 'old memories'],
      keywords: ['nostalgic', 'throwback', 'memories', 'retro', 'vintage', 'remembering'],
      patterns: [/\b(miss\s+the\s+past|blast\s+from\s+the\s+past)\b/g],
    },
    stressed: {
      phrases: ['too much pressure', 'burned out', 'under stress', 'overloaded with work'],
      keywords: ['stressed', 'stress', 'overwhelmed', 'pressure', 'burnout', 'tense', 'drained', 'exhausted'],
      patterns: [/\b(deadline|overloaded|burned\s+out|burnt\s+out)\b/g],
    },
    romantic: {
      phrases: ['in love', 'feeling romantic', 'my heart', 'thinking of you'],
      keywords: ['romantic', 'love', 'loving', 'affection', 'passion', 'intimate', 'tender', 'adore', 'crush', 'sweetheart', 'darling'],
      patterns: [/\b(heart\s+beats|crush|sweetheart|soulmate|lovey|adoring)\b/g],
    },
  };

  const strongSignals = {
    angry: ['fight', 'fighting', 'argument', 'argue', 'conflict', 'clash'],
    romantic: ['love', 'in love', 'loving', 'romantic', 'crush', 'soulmate'],
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
}

function classifyMoodFromVoice(pitch = 0, energy = 0, tempo = 0) {
  if (energy > 0.7 && pitch > 0.6) {
    return tempo > 0.7 ? 'energetic' : 'happy';
  }

  if (energy < 0.4 && pitch < 0.4) {
    return tempo < 0.3 ? 'calm' : 'sad';
  }

  if (energy > 0.7 && pitch < 0.5) {
    return 'angry';
  }

  if (energy > 0.4 && energy < 0.7) {
    return pitch > 0.5 ? 'romantic' : 'relaxed';
  }

  return 'relaxed';
}

module.exports = {
  classifyMoodFromText,
  classifyMoodFromVoice,
};
