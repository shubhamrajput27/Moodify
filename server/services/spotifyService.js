import axios from 'axios';

/**
 * Spotify Service - Handles all Spotify API interactions
 */
class SpotifyService {
  constructor() {
    this.accessToken = null;
    this.tokenExpiry = null;
  }

  /**
   * Read Spotify credentials lazily so env vars are available
   * even when this module is imported before dotenv.config() runs.
   */
  getCredentials() {
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new Error('Spotify credentials are not configured');
    }

    return { clientId, clientSecret };
  }

  isTransientNetworkError(error) {
    const code = error?.code;
    return ['ECONNRESET', 'ENOTFOUND', 'ETIMEDOUT', 'ECONNABORTED', 'EAI_AGAIN'].includes(code);
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getMarket() {
    const market = (process.env.SPOTIFY_MARKET || 'IN').trim().toUpperCase();
    return /^[A-Z]{2}$/.test(market) ? market : 'IN';
  }

  /**
   * Get Spotify access token using Client Credentials Flow
   */
  async getAccessToken() {
    // Return cached token if still valid
    if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    const { clientId, clientSecret } = this.getCredentials();
    const maxAttempts = 3;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const response = await axios.post(
          'https://accounts.spotify.com/api/token',
          'grant_type=client_credentials',
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              Authorization: `Basic ${Buffer.from(
                `${clientId}:${clientSecret}`
              ).toString('base64')}`,
            },
            timeout: 10000,
          }
        );

        this.accessToken = response.data.access_token;
        // Set expiry with 5-minute buffer
        this.tokenExpiry = Date.now() + (response.data.expires_in - 300) * 1000;

        return this.accessToken;
      } catch (error) {
        const shouldRetry = this.isTransientNetworkError(error) && attempt < maxAttempts;
        if (shouldRetry) {
          await this.delay(400 * attempt);
          continue;
        }

        console.error('Error getting Spotify access token:', error.response?.data || error.message);
        throw new Error('Failed to authenticate with Spotify');
      }
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
        indiaHints: ['bollywood party', 'hindi dance', 'punjabi upbeat'],
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
        indiaHints: ['bollywood sad', 'hindi heartbreak', 'indian lofi'],
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
        indiaHints: ['indian rap', 'desi hip hop', 'punjabi power'],
        features: { 
          min_energy: 0.7, 
          min_loudness: -10,
          target_energy: 0.9 
        }
      },
      relaxed: {
        genres: ['ambient', 'chill', 'study', 'sleep'],
        seedGenres: 'ambient,chill,acoustic',
        indiaHints: ['hindi chill', 'indian acoustic', 'bollywood soft'],
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
        indiaHints: ['indian classical', 'hindi calm', 'meditation india'],
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
        indiaHints: ['punjabi workout', 'bollywood dance', 'indian edm'],
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
        indiaHints: ['bollywood romantic', 'hindi love songs', 'indian melody'],
        features: { 
          min_valence: 0.5,
          target_valence: 0.7,
          target_energy: 0.5 
        }
      }
    };

    return moodMappings[mood.toLowerCase()] || moodMappings.happy;
  }

  normalizeGenre(genre) {
    if (!genre || typeof genre !== 'string') return '';
    return genre.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, ' ');
  }

  buildGenreAwareQuery(mood, moodData, genre) {
    const normalizedGenre = this.normalizeGenre(genre);
    const baseQuery = this.buildIndianMoodQuery(mood, moodData);
    return normalizedGenre ? `${normalizedGenre} ${baseQuery}` : baseQuery;
  }

  buildIndianMoodQuery(mood, moodData) {
    const base = [mood, ...(moodData?.genres || []).slice(0, 2)].join(' ');
    const hints = (moodData?.indiaHints || []).join(' ');
    return `${base} ${hints} bollywood hindi punjabi indian`;
  }

  extractPlaylistId(playlistRef) {
    if (!playlistRef || typeof playlistRef !== 'string') return '';

    const trimmed = playlistRef.trim();
    const directIdMatch = trimmed.match(/^[A-Za-z0-9]{22}$/);
    if (directIdMatch) return trimmed;

    const urlMatch = trimmed.match(/playlist\/([A-Za-z0-9]{22})/i);
    if (urlMatch?.[1]) return urlMatch[1];

    return '';
  }

  mergeUniqueTracks(primary, secondary, limit) {
    const out = [];
    const seen = new Set();

    const append = (track) => {
      if (!track?.id || seen.has(track.id)) return;
      seen.add(track.id);
      out.push(track);
    };

    primary.forEach(append);
    secondary.forEach(append);

    return out.slice(0, limit);
  }

  hashString(input) {
    const text = String(input || '');
    let hash = 0;
    for (let i = 0; i < text.length; i += 1) {
      hash = ((hash << 5) - hash) + text.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  }

  getSeedGenres(moodData, refreshKey = '') {
    const baseSeeds = (moodData?.seedGenres || '')
      .split(',')
      .map(seed => seed.trim())
      .filter(Boolean);
    const moodGenres = (moodData?.genres || []).map((genre) => this.normalizeGenre(genre)).filter(Boolean);
    const uniquePool = [...new Set([...baseSeeds, ...moodGenres])];

    if (uniquePool.length <= 3) {
      return (uniquePool.length ? uniquePool : ['pop', 'dance', 'rock']).slice(0, 3).join(',');
    }

    const startIndex = this.hashString(refreshKey) % uniquePool.length;
    const selected = [];
    for (let i = 0; i < 3; i += 1) {
      selected.push(uniquePool[(startIndex + i) % uniquePool.length]);
    }

    return selected.join(',');
  }

  shuffleTracks(tracks, refreshKey = '') {
    const list = [...tracks];
    let seed = this.hashString(refreshKey || Date.now());

    for (let i = list.length - 1; i > 0; i -= 1) {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      const j = seed % (i + 1);
      [list[i], list[j]] = [list[j], list[i]];
    }

    return list;
  }

  /**
   * Get song recommendations based on mood
   */
  async getRecommendations(mood, limit = 20, genre = '', refresh = '') {
    try {
      const token = await this.getAccessToken();
      const moodData = this.getMoodMapping(mood);
      const market = this.getMarket();
      const safeLimit = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 10);
      const indiaQuery = this.buildGenreAwareQuery(mood, moodData, genre);
      const refreshKey = String(refresh || Date.now());
      const seedGenres = this.getSeedGenres(moodData, refreshKey);
      const searchOffset = this.hashString(refreshKey) % 80;

      // Build query parameters
      const params = new URLSearchParams({
        seed_genres: seedGenres,
        limit: safeLimit.toString(),
        market
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
            timeout: 10000,
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
              timeout: 10000,
            }
          );
        } else if (error.response?.status === 404) {
          // Some Spotify apps do not have access to recommendations.
          // Fall back to search-based discovery so users still get songs.
          return this.searchTracks(indiaQuery, safeLimit, searchOffset);
        } else {
          return this.searchTracks(indiaQuery, safeLimit, searchOffset);
        }
      }

      if (!response?.data?.tracks?.length) {
        return this.searchTracks(indiaQuery, safeLimit, searchOffset);
      }

      // Format the response
      const recommendationTracks = response.data.tracks.map(track => ({
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

      // Blend with India-focused search to prioritize Indian-origin results.
      const indiaTracks = await this.searchTracks(indiaQuery, safeLimit, searchOffset);
      const mergedTracks = this.mergeUniqueTracks(indiaTracks, recommendationTracks, safeLimit * 2);
      return this.shuffleTracks(mergedTracks, refreshKey).slice(0, safeLimit);
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
  async searchTracks(query, limit = 10, offset = 0) {
    try {
      const token = await this.getAccessToken();
      const safeLimit = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 10);
      const market = this.getMarket();
      const safeOffset = Math.max(parseInt(offset, 10) || 0, 0);

      const response = await axios.get(
        `https://api.spotify.com/v1/search`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            q: query,
            type: 'track',
            limit: safeLimit,
            offset: safeOffset,
            market
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

  /**
   * Fetch tracks from a Spotify playlist (public playlists supported via client credentials)
   */
  async getPlaylistTracks(playlistRef, limit = 20) {
    try {
      const playlistId = this.extractPlaylistId(playlistRef);

      if (!playlistId) {
        throw new Error('Invalid playlist ID or URL');
      }

      const token = await this.getAccessToken();
      const safeLimit = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 50);
      const market = this.getMarket();

      const response = await axios.get(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            limit: safeLimit,
            market
          },
          timeout: 10000,
        }
      );

      return response.data.items
        .map(item => item?.track)
        .filter(track => track && track.id)
        .map(track => ({
          id: track.id,
          name: track.name,
          artist: track.artists.map(a => a.name).join(', '),
          album: track.album?.name || '',
          albumArt: track.album?.images?.[0]?.url || null,
          previewUrl: track.preview_url,
          spotifyUrl: track.external_urls?.spotify || null,
          duration: track.duration_ms,
          popularity: track.popularity
        }));
    } catch (error) {
      const status = error?.response?.status;
      const message = error?.response?.data?.error?.message || error.message;

      if (status === 404) {
        throw new Error('Playlist not found. Check the playlist link/ID.');
      }

      if (status === 403) {
        throw new Error('Playlist is private or unavailable to this app.');
      }

      console.error('Error fetching playlist tracks:', error.response?.data || error.message);
      throw new Error(message || 'Failed to fetch playlist tracks from Spotify');
    }
  }
}

export default new SpotifyService();
