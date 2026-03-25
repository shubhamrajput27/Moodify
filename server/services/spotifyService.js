import axios from 'axios';

/**
 * Spotify Service - Handles all Spotify API interactions
 */
class SpotifyService {
  constructor() {
    this.clientId = process.env.SPOTIFY_CLIENT_ID;
    this.clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    this.accessToken = null;
    this.tokenExpiry = null;
  }

  /**
   * Get Spotify access token using Client Credentials Flow
   */
  async getAccessToken() {
    // Return cached token if still valid
    if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
      const response = await axios.post(
        'https://accounts.spotify.com/api/token',
        'grant_type=client_credentials',
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${Buffer.from(
              `${this.clientId}:${this.clientSecret}`
            ).toString('base64')}`,
          },
        }
      );

      this.accessToken = response.data.access_token;
      // Set expiry with 5-minute buffer
      this.tokenExpiry = Date.now() + (response.data.expires_in - 300) * 1000;

      return this.accessToken;
    } catch (error) {
      console.error('Error getting Spotify access token:', error.response?.data || error.message);
      throw new Error('Failed to authenticate with Spotify');
    }
  }

  /**
   * Map mood to Spotify genres and audio features
   */
  getMoodMapping(mood) {
    const moodMappings = {
      happy: {
        genres: ['pop', 'dance', 'party', 'summer'],
        seedGenres: 'pop,dance,indie-pop',
        features: { 
          min_valence: 0.6, 
          min_energy: 0.6,
          target_valence: 0.8,
          target_energy: 0.7 
        }
      },
      sad: {
        genres: ['acoustic', 'piano', 'sad', 'blues'],
        seedGenres: 'acoustic,singer-songwriter,blues',
        features: { 
          max_valence: 0.4, 
          max_energy: 0.5,
          target_valence: 0.2,
          target_energy: 0.3 
        }
      },
      angry: {
        genres: ['metal', 'rock', 'hard-rock', 'punk'],
        seedGenres: 'metal,rock,hard-rock',
        features: { 
          min_energy: 0.7, 
          min_loudness: -10,
          target_energy: 0.9 
        }
      },
      relaxed: {
        genres: ['ambient', 'chill', 'study', 'sleep'],
        seedGenres: 'ambient,chill,acoustic',
        features: { 
          max_energy: 0.4, 
          max_tempo: 100,
          target_valence: 0.5,
          target_energy: 0.3 
        }
      },
      calm: {
        genres: ['ambient', 'lo-fi', 'meditation', 'classical'],
        seedGenres: 'ambient,classical,new-age',
        features: { 
          max_energy: 0.5, 
          max_tempo: 110,
          target_valence: 0.6,
          target_energy: 0.4 
        }
      },
      energetic: {
        genres: ['edm', 'workout', 'electronic', 'dance'],
        seedGenres: 'edm,electronic,dance',
        features: { 
          min_energy: 0.7, 
          min_tempo: 120,
          target_energy: 0.9,
          target_valence: 0.7 
        }
      },
      romantic: {
        genres: ['romance', 'soul', 'r-n-b', 'love'],
        seedGenres: 'soul,r-n-b,jazz',
        features: { 
          min_valence: 0.5,
          target_valence: 0.7,
          target_energy: 0.5 
        }
      }
    };

    return moodMappings[mood.toLowerCase()] || moodMappings.happy;
  }

  /**
   * Get song recommendations based on mood
   */
  async getRecommendations(mood, limit = 20) {
    try {
      const token = await this.getAccessToken();
      const moodData = this.getMoodMapping(mood);

      // Build query parameters
      const params = new URLSearchParams({
        seed_genres: moodData.seedGenres,
        limit: limit.toString(),
        market: 'US'
      });

      // Add audio features to the query
      Object.entries(moodData.features).forEach(([key, value]) => {
        params.append(key, value.toString());
      });

      let response;
      try {
        response = await axios.get(
          `https://api.spotify.com/v1/recommendations?${params}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } catch (error) {
        // Retry once with known-safe seeds if Spotify rejects seed genres.
        if (error.response?.status === 400) {
          const fallbackParams = new URLSearchParams(params.toString());
          fallbackParams.set('seed_genres', 'pop,dance,rock');
          response = await axios.get(
            `https://api.spotify.com/v1/recommendations?${fallbackParams}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        } else {
          throw error;
        }
      }

      // Format the response
      return response.data.tracks.map(track => ({
        id: track.id,
        name: track.name,
        artist: track.artists.map(a => a.name).join(', '),
        album: track.album.name,
        albumArt: track.album.images[0]?.url || null,
        previewUrl: track.preview_url,
        spotifyUrl: track.external_urls.spotify,
        duration: track.duration_ms,
        popularity: track.popularity
      }));
    } catch (error) {
      console.error('Error getting recommendations:', error.response?.data || error.message);
      if (error.response) {
        console.error('Status:', error.response.status);
        console.error('Response:', JSON.stringify(error.response.data, null, 2));
      }
      throw new Error('Failed to get recommendations from Spotify');
    }
  }

  /**
   * Search for tracks by query
   */
  async searchTracks(query, limit = 10) {
    try {
      const token = await this.getAccessToken();

      const response = await axios.get(
        `https://api.spotify.com/v1/search`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            q: query,
            type: 'track',
            limit,
            market: 'US'
          }
        }
      );

      return response.data.tracks.items.map(track => ({
        id: track.id,
        name: track.name,
        artist: track.artists.map(a => a.name).join(', '),
        album: track.album.name,
        albumArt: track.album.images[0]?.url || null,
        previewUrl: track.preview_url,
        spotifyUrl: track.external_urls.spotify,
        duration: track.duration_ms,
        popularity: track.popularity
      }));
    } catch (error) {
      console.error('Error searching tracks:', error.response?.data || error.message);
      throw new Error('Failed to search tracks on Spotify');
    }
  }
}

export default new SpotifyService();
