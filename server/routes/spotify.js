import express from 'express';
import spotifyService from '../services/spotifyService.js';

const router = express.Router();

/**
 * GET /api/spotify/recommendations
 * Get song recommendations based on mood
 */
router.get('/recommendations', async (req, res, next) => {
  try {
    const { mood, limit } = req.query;

    if (!mood) {
      return res.status(400).json({ error: 'Mood parameter is required' });
    }

    const validMoods = ['happy', 'sad', 'angry', 'relaxed', 'calm', 'energetic', 'romantic'];
    if (!validMoods.includes(mood.toLowerCase())) {
      return res.status(400).json({ 
        error: 'Invalid mood', 
        validMoods 
      });
    }

    const recommendations = await spotifyService.getRecommendations(
      mood, 
      parseInt(limit) || 20
    );

    res.json({
      mood,
      count: recommendations.length,
      tracks: recommendations
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/spotify/search
 * Search for tracks
 */
router.get('/search', async (req, res, next) => {
  try {
    const { q, limit } = req.query;

    if (!q) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    const tracks = await spotifyService.searchTracks(q, parseInt(limit) || 10);

    res.json({
      query: q,
      count: tracks.length,
      tracks
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/spotify/moods
 * Get list of supported moods
 */
router.get('/moods', (req, res) => {
  res.json({
    moods: [
      { value: 'happy', label: 'Happy', emoji: '😊', description: 'Upbeat and joyful' },
      { value: 'sad', label: 'Sad', emoji: '😢', description: 'Melancholic and emotional' },
      { value: 'angry', label: 'Angry', emoji: '😠', description: 'Intense and aggressive' },
      { value: 'relaxed', label: 'Relaxed', emoji: '😌', description: 'Calm and peaceful' },
      { value: 'calm', label: 'Calm', emoji: '🧘', description: 'Tranquil and meditative' },
      { value: 'energetic', label: 'Energetic', emoji: '⚡', description: 'High-energy and pumped' },
      { value: 'romantic', label: 'Romantic', emoji: '❤️', description: 'Loving and passionate' }
    ]
  });
});

export default router;
