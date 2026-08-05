import express from 'express';
import { classifyMoodFromText, classifyMoodFromVoice } from '../../shared/moodClassifier.cjs';

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
 */
router.post('/analyze-voice', (req, res) => {
  try {
    const { pitch, energy, tempo } = req.body;

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

export default router;
