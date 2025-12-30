import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Spotify API client
 */
class SpotifyAPI {
  /**
   * Get song recommendations based on mood
   */
  async getRecommendations(mood, limit = 20) {
    try {
      const response = await axios.get(`${API_URL}/spotify/recommendations`, {
        params: { mood, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch recommendations');
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
      throw new Error(error.response?.data?.error || 'Failed to search tracks');
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
