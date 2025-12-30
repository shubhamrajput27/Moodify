import express from 'express';

const router = express.Router();

/**
 * POST /api/mood/analyze-text
 * Analyze text input and determine mood
 */
router.post('/analyze-text', (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text parameter is required' });
    }

    // Simple rule-based text emotion classification
    const mood = classifyMoodFromText(text.toLowerCase());

    res.json({
      input: text,
      detectedMood: mood,
      confidence: 0.85
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to analyze text' });
  }
});

/**
 * POST /api/mood/analyze-voice
 * Analyze voice characteristics and determine mood
 * (Placeholder - actual analysis would be done on frontend)
 */
router.post('/analyze-voice', (req, res) => {
  try {
    const { pitch, energy, tempo } = req.body;

    // Simple heuristic-based voice emotion classification
    const mood = classifyMoodFromVoice(pitch, energy, tempo);

    res.json({
      detectedMood: mood,
      confidence: 0.75,
      features: { pitch, energy, tempo }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to analyze voice' });
  }
});

/**
 * Rule-based text mood classifier
 */
function classifyMoodFromText(text) {
  const moodKeywords = {
    happy: ['happy', 'joy', 'excited', 'great', 'wonderful', 'amazing', 'love', 'cheerful', 'delighted', 'pleased'],
    sad: ['sad', 'depressed', 'down', 'unhappy', 'miserable', 'lonely', 'heartbroken', 'crying', 'tears'],
    angry: ['angry', 'mad', 'furious', 'rage', 'annoyed', 'frustrated', 'irritated', 'hate'],
    relaxed: ['relaxed', 'chill', 'calm', 'peaceful', 'tranquil', 'serene', 'mellow'],
    calm: ['calm', 'quiet', 'still', 'peaceful', 'zen', 'meditation', 'breathe'],
    energetic: ['energetic', 'pumped', 'hyped', 'excited', 'active', 'workout', 'motivated'],
    romantic: ['romantic', 'love', 'loving', 'affection', 'passion', 'intimate', 'tender']
  };

  // Count keyword matches for each mood
  const moodScores = {};
  
  for (const [mood, keywords] of Object.entries(moodKeywords)) {
    moodScores[mood] = keywords.filter(keyword => text.includes(keyword)).length;
  }

  // Find mood with highest score
  const detectedMood = Object.entries(moodScores)
    .sort(([, a], [, b]) => b - a)[0][0];

  // If no keywords matched, default to 'relaxed'
  return moodScores[detectedMood] > 0 ? detectedMood : 'relaxed';
}

/**
 * Heuristic-based voice mood classifier
 */
function classifyMoodFromVoice(pitch = 0, energy = 0, tempo = 0) {
  // High energy + high pitch = happy/energetic
  if (energy > 0.7 && pitch > 0.6) {
    return tempo > 0.7 ? 'energetic' : 'happy';
  }
  
  // Low energy + low pitch = sad/calm
  if (energy < 0.4 && pitch < 0.4) {
    return tempo < 0.3 ? 'calm' : 'sad';
  }
  
  // High energy + low pitch = angry
  if (energy > 0.7 && pitch < 0.5) {
    return 'angry';
  }
  
  // Moderate values = relaxed/romantic
  if (energy > 0.4 && energy < 0.7) {
    return pitch > 0.5 ? 'romantic' : 'relaxed';
  }

  return 'relaxed';
}

export default router;
