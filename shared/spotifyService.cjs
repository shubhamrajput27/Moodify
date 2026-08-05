/**
 * Single source of truth for all Spotify Web API access.
 *
 * This file is required (via CommonJS, .cjs so it works regardless of the
 * importing project's "type" field) by both deployment targets:
 *   - server/routes/*.js   (Express app, imported via ESM default-interop)
 *   - api/**\/*.js          (Vercel serverless functions, CommonJS)
 * Previously each target carried its own full copy of this logic; they
 * drifted the moment one side got a fix the other didn't. Keep it single.
 */
const SPOTIFY_API_BASE_URL = 'https://api.spotify.com/v1';
const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token';

/**
 * Curated fallback catalog, keyed by mood. Used only when Spotify's Web API
 * rejects catalog reads (e.g. the app owner's account lacks the active
 * Premium subscription Spotify now requires for client-credentials search),
 * so the app still returns real, mood-appropriate songs instead of an error.
 * No track IDs/audio previews are available offline, so each track links out
 * to a Spotify search results page rather than a specific track page.
 */
const FALLBACK_CATALOG = {
  happy: [
    ['Happy', 'Pharrell Williams'],
    ['Walking on Sunshine', 'Katrina and the Waves'],
    ['Good as Hell', 'Lizzo'],
    ["Can't Stop the Feeling!", 'Justin Timberlake'],
    ['Uptown Funk', 'Mark Ronson ft. Bruno Mars'],
    ['Best Day of My Life', 'American Authors'],
    ['I Gotta Feeling', 'The Black Eyed Peas'],
    ['Dancing Queen', 'ABBA'],
  ],
  sad: [
    ['Someone Like You', 'Adele'],
    ['Fix You', 'Coldplay'],
    ['Hurt', 'Johnny Cash'],
    ['Skinny Love', 'Bon Iver'],
    ['The Night We Met', 'Lord Huron'],
    ['Say Something', 'A Great Big World'],
    ['Hallelujah', 'Jeff Buckley'],
    ['Everybody Hurts', 'R.E.M.'],
  ],
  angry: [
    ['Break Stuff', 'Limp Bizkit'],
    ['Killing in the Name', 'Rage Against the Machine'],
    ['Bulls on Parade', 'Rage Against the Machine'],
    ['Duality', 'Slipknot'],
    ['Given Up', 'Linkin Park'],
    ['Chop Suey!', 'System of a Down'],
    ['Bodies', 'Drowning Pool'],
    ['Bawitdaba', 'Kid Rock'],
  ],
  relaxed: [
    ['Weightless', 'Marconi Union'],
    ['Sunset Lover', 'Petit Biscuit'],
    ['Holocene', 'Bon Iver'],
    ['Clair de Lune', 'Claude Debussy'],
    ['Banana Pancakes', 'Jack Johnson'],
    ["Please Don't Go", 'Barcelona'],
    ['Breathe Me', 'Sia'],
    ['River Flows in You', 'Yiruma'],
  ],
  calm: [
    ['Weightless', 'Marconi Union'],
    ['River Flows in You', 'Yiruma'],
    ['Clair de Lune', 'Claude Debussy'],
    ['Gymnopedie No. 1', 'Erik Satie'],
    ['Aqueous Transmission', 'Incubus'],
    ['Intro', 'The xx'],
    ['Saturn', 'Sleeping At Last'],
    ['Mad World', 'Gary Jules'],
  ],
  energetic: [
    ['Titanium', 'David Guetta ft. Sia'],
    ['Levels', 'Avicii'],
    ["Don't Stop Me Now", 'Queen'],
    ['Stronger', 'Kanye West'],
    ['Eye of the Tiger', 'Survivor'],
    ["Can't Hold Us", 'Macklemore & Ryan Lewis'],
    ['Thunderstruck', 'AC/DC'],
    ['Power', 'Kanye West'],
  ],
  anxious: [
    ['Breathe', 'Telepopmusik'],
    ['Anxiety', 'Julia Michaels'],
    ['Heavy', 'Linkin Park'],
    ['1-800-273-8255', 'Logic'],
    ['Numb', 'Linkin Park'],
    ['Stressed Out', 'Twenty One Pilots'],
    ['Fake Happy', 'Paramore'],
    ['Chandelier', 'Sia'],
  ],
  nostalgic: [
    ['Yesterday', 'The Beatles'],
    ['Landslide', 'Fleetwood Mac'],
    ['Vienna', 'Billy Joel'],
    ['Time After Time', 'Cyndi Lauper'],
    ['Boulevard of Broken Dreams', 'Green Day'],
    ['Photograph', 'Ed Sheeran'],
    ["Summer of '69", 'Bryan Adams'],
    ['The Way We Were', 'Barbra Streisand'],
  ],
  stressed: [
    ['Weightless', 'Marconi Union'],
    ['Breathe Me', 'Sia'],
    ['Bloom', 'The Paper Kites'],
    ['Holocene', 'Bon Iver'],
    ['Saturn', 'Sleeping At Last'],
    ["Comptine d'un autre ete", 'Yann Tiersen'],
    ['Watermark', 'Enya'],
    ['Gymnopedie No. 1', 'Erik Satie'],
  ],
  romantic: [
    ['Perfect', 'Ed Sheeran'],
    ['All of Me', 'John Legend'],
    ['Thinking Out Loud', 'Ed Sheeran'],
    ['At Last', 'Etta James'],
    ["Can't Help Falling in Love", 'Elvis Presley'],
    ['Love on Top', 'Beyonce'],
    ['A Thousand Years', 'Christina Perri'],
    ['Just the Way You Are', 'Bruno Mars'],
  ],
};

const GENERIC_FALLBACK = [
  ['Blinding Lights', 'The Weeknd'],
  ['Shape of You', 'Ed Sheeran'],
  ['Bohemian Rhapsody', 'Queen'],
  ['Uptown Funk', 'Mark Ronson ft. Bruno Mars'],
  ['Rolling in the Deep', 'Adele'],
  ['Levitating', 'Dua Lipa'],
  ['Circles', 'Post Malone'],
  ["Don't Stop Believin'", 'Journey'],
  ['Watermelon Sugar', 'Harry Styles'],
  ['As It Was', 'Harry Styles'],
];

class SpotifyService {
  constructor() {
    this.accessToken = null;
    this.tokenExpiry = null;
  }

  getCredentials() {
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new Error('Spotify credentials are not configured');
    }

    return { clientId, clientSecret };
  }

  isTransientNetworkError(error) {
    const code = error && error.code;
    return ['ECONNRESET', 'ENOTFOUND', 'ETIMEDOUT', 'ECONNABORTED', 'EAI_AGAIN'].includes(code);
  }

  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  getMarket() {
    const market = (process.env.SPOTIFY_MARKET || 'IN').trim().toUpperCase();
    return /^[A-Z]{2}$/.test(market) ? market : 'IN';
  }

  async getAccessToken() {
    if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    const { clientId, clientSecret } = this.getCredentials();
    const maxAttempts = 3;

    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
      try {
        const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
        const response = await fetch(SPOTIFY_TOKEN_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${basicAuth}`,
          },
          body: 'grant_type=client_credentials',
        });

        if (!response.ok) {
          throw new Error('Failed to authenticate with Spotify');
        }

        const data = await response.json();
        this.accessToken = data.access_token;
        this.tokenExpiry = Date.now() + (data.expires_in - 300) * 1000;

        return this.accessToken;
      } catch (error) {
        const shouldRetry = this.isTransientNetworkError(error) && attempt < maxAttempts;
        if (shouldRetry) {
          await this.delay(400 * attempt);
          continue;
        }

        throw new Error('Failed to authenticate with Spotify');
      }
    }

    throw new Error('Failed to authenticate with Spotify');
  }

  getMoodMapping(mood) {
    const moodMappings = {
      happy: {
        genres: ['pop', 'dance', 'party', 'summer'],
        seedGenres: 'pop,dance,indie-pop',
        indiaHints: ['bollywood party', 'hindi dance', 'punjabi upbeat'],
        features: { min_valence: 0.6, min_energy: 0.6, target_valence: 0.8, target_energy: 0.7 },
      },
      sad: {
        genres: ['acoustic', 'piano', 'sad', 'blues'],
        seedGenres: 'acoustic,singer-songwriter,blues',
        indiaHints: ['bollywood sad', 'hindi heartbreak', 'indian lofi'],
        features: { max_valence: 0.4, max_energy: 0.5, target_valence: 0.2, target_energy: 0.3 },
      },
      angry: {
        genres: ['metal', 'rock', 'hard-rock', 'punk'],
        seedGenres: 'metal,rock,hard-rock',
        indiaHints: ['indian rap', 'desi hip hop', 'punjabi power'],
        features: { min_energy: 0.7, min_loudness: -10, target_energy: 0.9 },
      },
      relaxed: {
        genres: ['ambient', 'chill', 'study', 'sleep'],
        seedGenres: 'ambient,chill,acoustic',
        indiaHints: ['hindi chill', 'indian acoustic', 'bollywood soft'],
        features: { max_energy: 0.4, max_tempo: 100, target_valence: 0.5, target_energy: 0.3 },
      },
      calm: {
        genres: ['ambient', 'lo-fi', 'meditation', 'classical'],
        seedGenres: 'ambient,classical,new-age',
        indiaHints: ['indian classical', 'hindi calm', 'meditation india'],
        features: { max_energy: 0.5, max_tempo: 110, target_valence: 0.6, target_energy: 0.4 },
      },
      energetic: {
        genres: ['edm', 'workout', 'electronic', 'dance'],
        seedGenres: 'edm,electronic,dance',
        indiaHints: ['punjabi workout', 'bollywood dance', 'indian edm'],
        features: { min_energy: 0.7, min_tempo: 120, target_energy: 0.9, target_valence: 0.7 },
      },
      anxious: {
        genres: ['indie', 'electronic', 'alt-rock', 'trip-hop'],
        seedGenres: 'indie,alternative,trip-hop',
        indiaHints: ['indian indie', 'hindi alt', 'moody electronic'],
        features: { min_energy: 0.55, max_valence: 0.45, target_energy: 0.65, target_valence: 0.35 },
      },
      nostalgic: {
        genres: ['oldies', 'acoustic', 'soul', 'indie'],
        seedGenres: 'acoustic,soul,indie',
        indiaHints: ['bollywood classics', 'old hindi songs', 'retro indian'],
        features: { target_valence: 0.55, target_energy: 0.45, max_tempo: 115 },
      },
      stressed: {
        genres: ['lo-fi', 'ambient', 'piano', 'chill'],
        seedGenres: 'ambient,lo-fi,classical',
        indiaHints: ['calm hindi', 'stress relief india', 'meditation bollywood'],
        features: { max_energy: 0.45, target_valence: 0.5, target_energy: 0.35, max_tempo: 105 },
      },
      romantic: {
        genres: ['romance', 'soul', 'r-n-b', 'love'],
        seedGenres: 'soul,r-n-b,jazz',
        indiaHints: ['bollywood romantic', 'hindi love songs', 'indian melody'],
        features: { min_valence: 0.5, target_valence: 0.7, target_energy: 0.5 },
      },
    };

    return moodMappings[mood.toLowerCase()] || moodMappings.happy;
  }

  normalizeGenre(genre) {
    if (!genre || typeof genre !== 'string') {
      return '';
    }
    return genre.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, ' ');
  }

  buildGenreAwareQuery(mood, moodData, genre) {
    const normalizedGenre = this.normalizeGenre(genre);
    const baseQuery = this.buildIndianMoodQuery(mood, moodData);
    return normalizedGenre ? `${normalizedGenre} ${baseQuery}` : baseQuery;
  }

  buildIndianMoodQuery(mood, moodData) {
    const base = [mood, ...(moodData && moodData.genres ? moodData.genres : []).slice(0, 2)].join(' ');
    const hints = ((moodData && moodData.indiaHints) || []).join(' ');
    return `${base} ${hints} bollywood hindi punjabi indian`;
  }

  extractPlaylistId(playlistRef) {
    if (!playlistRef || typeof playlistRef !== 'string') {
      return '';
    }

    const trimmed = playlistRef.trim();
    const directIdMatch = trimmed.match(/^[A-Za-z0-9]{22}$/);
    if (directIdMatch) {
      return trimmed;
    }

    const urlMatch = trimmed.match(/playlist\/([A-Za-z0-9]{22})/i);
    return urlMatch && urlMatch[1] ? urlMatch[1] : '';
  }

  mergeUniqueTracks(primary, secondary, limit) {
    const out = [];
    const seen = new Set();

    const append = (track) => {
      if (!track || !track.id || seen.has(track.id)) {
        return;
      }
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
    const baseSeeds = (moodData && moodData.seedGenres ? moodData.seedGenres : '')
      .split(',')
      .map((seed) => seed.trim())
      .filter(Boolean);
    const moodGenres = ((moodData && moodData.genres) || [])
      .map((genre) => this.normalizeGenre(genre))
      .filter(Boolean);
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

  formatTrack(track) {
    return {
      id: track.id,
      name: track.name,
      artist: track.artists.map((a) => a.name).join(', '),
      album: (track.album && track.album.name) || '',
      albumArt: (track.album && track.album.images && track.album.images[0] && track.album.images[0].url) || null,
      previewUrl: track.preview_url,
      spotifyUrl: track.external_urls && track.external_urls.spotify,
      duration: track.duration_ms,
      popularity: track.popularity,
    };
  }

  buildSpotifySearchUrl(name, artist) {
    return `https://open.spotify.com/search/${encodeURIComponent(`${name} ${artist}`)}`;
  }

  toFallbackTrack([name, artist]) {
    return {
      id: `fallback-${this.hashString(`${name}-${artist}`)}`,
      name,
      artist,
      album: null,
      albumArt: null,
      previewUrl: null,
      spotifyUrl: this.buildSpotifySearchUrl(name, artist),
      duration: null,
      popularity: null,
      source: 'curated',
    };
  }

  /**
   * Curated, mood-matched tracks used when Spotify's catalog endpoints are
   * unreachable for this app (see FALLBACK_CATALOG doc comment above).
   */
  getFallbackTracksForMood(mood, limit, refreshKey) {
    const pool = FALLBACK_CATALOG[mood.toLowerCase()] || FALLBACK_CATALOG.happy;
    const safeLimit = Math.min(Math.max(parseInt(limit, 10) || 10, 1), pool.length);
    const shuffled = this.shuffleTracks(pool, refreshKey);
    return shuffled.slice(0, safeLimit).map((entry) => this.toFallbackTrack(entry));
  }

  getFallbackTracksGeneric(limit) {
    const safeLimit = Math.min(Math.max(parseInt(limit, 10) || 10, 1), GENERIC_FALLBACK.length);
    return this.shuffleTracks(GENERIC_FALLBACK, Date.now()).slice(0, safeLimit).map((entry) => this.toFallbackTrack(entry));
  }

  async spotifyGet(url, token, params) {
    const qs = new URLSearchParams(params || {}).toString();
    const requestUrl = qs ? `${url}?${qs}` : url;
    const response = await fetch(requestUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const error = new Error(data && data.error && data.error.message ? data.error.message : 'Spotify request failed');
      error.status = response.status;
      error.payload = data;
      throw error;
    }

    return data;
  }

  /**
   * Get song recommendations based on mood.
   * Returns { tracks, fallback } — fallback is true when Spotify's catalog
   * was unreachable and curated tracks were served instead.
   */
  async getRecommendations(mood, limit = 20, genre = '', refresh = '') {
    const moodData = this.getMoodMapping(mood);
    const refreshKey = String(refresh || Date.now());
    const requestedLimit = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 20);

    try {
      const token = await this.getAccessToken();
      const market = this.getMarket();
      const safeLimit = Math.min(requestedLimit, 10);
      const indiaQuery = this.buildGenreAwareQuery(mood, moodData, genre);
      const seedGenres = this.getSeedGenres(moodData, refreshKey);
      const searchOffset = this.hashString(refreshKey) % 80;

      const params = {
        seed_genres: seedGenres,
        limit: safeLimit.toString(),
        market,
      };

      Object.entries(moodData.features).forEach(([key, value]) => {
        params[key] = value.toString();
      });

      let recommendationData;
      try {
        recommendationData = await this.spotifyGet(`${SPOTIFY_API_BASE_URL}/recommendations`, token, params);
      } catch (error) {
        if (error.status === 400) {
          const fallbackParams = { ...params, seed_genres: 'pop,dance,rock' };
          recommendationData = await this.spotifyGet(`${SPOTIFY_API_BASE_URL}/recommendations`, token, fallbackParams);
        } else {
          // Any other failure (including the app-wide catalog restriction)
          // is handled by the outer catch, which serves curated fallback.
          throw error;
        }
      }

      if (!recommendationData || !recommendationData.tracks || !recommendationData.tracks.length) {
        throw new Error('Spotify returned no recommendation tracks');
      }

      const recommendationTracks = recommendationData.tracks.map((track) => this.formatTrack(track));

      // Blend with India-focused search to prioritize Indian-origin results.
      const indiaResult = await this.searchTracksRaw(indiaQuery, safeLimit, searchOffset);
      const mergedTracks = this.mergeUniqueTracks(indiaResult.tracks, recommendationTracks, safeLimit * 2);
      return {
        tracks: this.shuffleTracks(mergedTracks, refreshKey).slice(0, safeLimit),
        fallback: false,
      };
    } catch (error) {
      return {
        tracks: this.getFallbackTracksForMood(mood, requestedLimit, refreshKey),
        fallback: true,
      };
    }
  }

  /** Internal: raw Spotify search, throws on failure (no fallback). */
  async searchTracksRaw(query, limit = 10, offset = 0) {
    const token = await this.getAccessToken();
    const safeLimit = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 10);
    const market = this.getMarket();
    const safeOffset = Math.max(parseInt(offset, 10) || 0, 0);

    const data = await this.spotifyGet(`${SPOTIFY_API_BASE_URL}/search`, token, {
      q: query,
      type: 'track',
      limit: safeLimit,
      offset: safeOffset,
      market,
    });

    return { tracks: data.tracks.items.map((track) => this.formatTrack(track)) };
  }

  /**
   * Public search entry point. Returns { tracks, fallback } — falls back to
   * a generic popular-tracks list if Spotify's search endpoint is unreachable.
   */
  async searchTracks(query, limit = 10, offset = 0) {
    try {
      const result = await this.searchTracksRaw(query, limit, offset);
      return { tracks: result.tracks, fallback: false };
    } catch (error) {
      return { tracks: this.getFallbackTracksGeneric(limit), fallback: true };
    }
  }

  async getPlaylistTracks(playlistRef, limit = 20) {
    try {
      const playlistId = this.extractPlaylistId(playlistRef);
      if (!playlistId) {
        throw new Error('Invalid playlist ID or URL');
      }

      const token = await this.getAccessToken();
      const safeLimit = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 50);
      const market = this.getMarket();

      const data = await this.spotifyGet(`${SPOTIFY_API_BASE_URL}/playlists/${playlistId}/tracks`, token, {
        limit: safeLimit,
        market,
      });

      return data.items
        .map((item) => item && item.track)
        .filter((track) => track && track.id)
        .map((track) => this.formatTrack(track));
    } catch (error) {
      if (error.status === 404) {
        throw new Error('Playlist not found. Check the playlist link/ID.');
      }

      if (error.status === 403) {
        throw new Error('Playlist is private or unavailable to this app.');
      }

      throw new Error(error.message || 'Failed to fetch playlist tracks from Spotify');
    }
  }
}

module.exports = new SpotifyService();
