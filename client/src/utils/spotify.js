import axios from 'axios';

function normalizeApiUrl(value) {
  const raw = typeof value === 'string' ? value.trim() : '';

  if (!raw) {
    return '/api';
  }

  const trimmed = raw.replace(/\/+$/, '');

  // If a full origin is provided without an API base, append /api.
  if (/^https?:\/\//i.test(trimmed) && !trimmed.endsWith('/api')) {
    return `${trimmed}/api`;
  }

  return trimmed;
}

const API_URL = normalizeApiUrl(import.meta.env.VITE_API_URL);

/**
 * Spotify API client
 */
class SpotifyAPI {
  extractErrorMessage(error, fallbackMessage) {
    const payload = error?.response?.data;

    if (typeof payload?.error === 'string') {
      return payload.error;
    }

    if (typeof payload?.error?.message === 'string') {
      return payload.error.message;
    }

    if (typeof payload?.message === 'string') {
      return payload.message;
    }

    if (typeof error?.message === 'string') {
      return error.message;
    }

    return fallbackMessage;
  }

  /**
   * Get song recommendations based on mood
   */
  async getRecommendations(mood, limit = 20, genre = '', refresh = '') {
    try {
      const response = await axios.get(`${API_URL}/spotify/recommendations`, {
        params: { mood, limit, genre, refresh }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      throw new Error(this.extractErrorMessage(error, 'Failed to fetch recommendations'));
    }
  }

  /**
   * Search for tracks
   */
  async searchTracks(query, limit = 10) {
    try {
      const response = await axios.get(`${API_URL}/spotify/search`, {
        params: { q: query, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching tracks:', error);
      throw new Error(this.extractErrorMessage(error, 'Failed to search tracks'));
    }
  }

  /**
   * Get tracks from a Spotify playlist (playlist URL or playlist ID)
   */
  async getPlaylistTracks(playlist, limit = 20) {
    try {
      const response = await axios.get(`${API_URL}/spotify/playlist`, {
        params: { playlist, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching playlist tracks:', error);
      throw new Error(this.extractErrorMessage(error, 'Failed to fetch playlist tracks'));
    }
  }

  /**
   * Get supported moods
   */
  async getMoods() {
    try {
      const response = await axios.get(`${API_URL}/spotify/moods`);
      return response.data.moods;
    } catch (error) {
      console.error('Error fetching moods:', error);
      throw new Error('Failed to fetch moods');
    }
  }

  /**
   * Analyze text mood
   */
  async analyzeTextMood(text) {
    try {
      const response = await axios.post(`${API_URL}/mood/analyze-text`, { text });
      return response.data;
    } catch (error) {
      console.error('Error analyzing text mood:', error);
      throw new Error('Failed to analyze mood');
    }
  }

  /**
   * Analyze voice mood
   */
  async analyzeVoiceMood(pitch, energy, tempo) {
    try {
      const response = await axios.post(`${API_URL}/mood/analyze-voice`, {
        pitch,
        energy,
        tempo
      });
      return response.data;
    } catch (error) {
      console.error('Error analyzing voice mood:', error);
      throw new Error('Failed to analyze voice mood');
    }
  }
}

export default new SpotifyAPI();
