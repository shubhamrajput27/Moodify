# Moodify 🎵

**Feel the mood. Hear the music.**

Moodify is an AI-powered mood-based music recommendation system that suggests personalized Spotify tracks based on your emotional state. Express your mood through text, facial expressions, or voice, and discover music that matches your feelings.

## 🌟 Features

- **Multi-Modal Mood Detection**
  - 💭 Text input with NLP-based emotion classification
  - 📸 Facial expression recognition using face-api.js
  - 🎤 Voice tone analysis with Web Audio API

- **Smart Music Recommendations**
  - Powered by Spotify Web API
  - Curated playlists for 7 different moods
  - Audio feature matching (valence, energy, tempo)

- **Modern UI/UX**
  - Beautiful animations with Framer Motion
  - Responsive design with Tailwind CSS
  - Smooth transitions and interactive elements

## 🛠️ Tech Stack

### Frontend
- **React.js** (Vite) - Fast and modern build tooling
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **face-api.js** - Facial emotion detection
- **Web Speech API** - Voice input
- **Axios** - HTTP client

### Backend
- **Node.js + Express** - REST API server
- **Spotify Web API** - Music data and recommendations
- **JWT** - Authentication (optional)

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Spotify Developer Account

## 🚀 Getting Started

### 1. Clone the Repository

\`\`\`bash
git clone <your-repo-url>
cd MOODIFY
\`\`\`

### 2. Set Up Spotify API

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new app
3. Note your **Client ID** and **Client Secret**

### 3. Configure Environment Variables

#### Backend (.env)
\`\`\`bash
cd server
cp .env.example .env
\`\`\`

Edit `server/.env`:
\`\`\`env
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
\`\`\`

#### Frontend (.env)
\`\`\`bash
cd client
cp .env.example .env
\`\`\`

Edit `client/.env`:
\`\`\`env
VITE_API_URL=http://localhost:5000/api
\`\`\`

### 4. Install Dependencies

#### Install all dependencies (root):
\`\`\`bash
npm install
\`\`\`

Or install individually:

\`\`\`bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
\`\`\`

### 5. Download Face-API Models (Required for Face Detection)

Download the face-api.js models and place them in `client/public/models/`:

\`\`\`bash
mkdir -p client/public/models
cd client/public/models

# Download models from face-api.js repository
# You can get them from: https://github.com/justadudewhohacks/face-api.js/tree/master/weights
\`\`\`

Required models:
- `tiny_face_detector_model-weights_manifest.json`
- `tiny_face_detector_model-shard1`
- `face_expression_model-weights_manifest.json`
- `face_expression_model-shard1`
- `face_landmark_68_model-weights_manifest.json`
- `face_landmark_68_model-shard1`

### 6. Run the Application

#### Option 1: Run both frontend and backend together (from root):
\`\`\`bash
npm run dev
\`\`\`

#### Option 2: Run separately:

Terminal 1 (Backend):
\`\`\`bash
cd server
npm run dev
\`\`\`

Terminal 2 (Frontend):
\`\`\`bash
cd client
npm run dev
\`\`\`

The app will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## 📁 Project Structure

\`\`\`
MOODIFY/
├── client/                  # Frontend React app
│   ├── public/
│   │   └── models/         # face-api.js models
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── Navbar.jsx
│   │   │   ├── TextMoodInput.jsx
│   │   │   ├── FaceMoodDetector.jsx
│   │   │   ├── VoiceMoodDetector.jsx
│   │   │   └── SongCard.jsx
│   │   ├── pages/          # Page components
│   │   │   ├── Home.jsx
│   │   │   └── Recommend.jsx
│   │   ├── utils/          # Utility functions
│   │   │   ├── moodMapper.js
│   │   │   └── spotify.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── server/                  # Backend Express app
│   ├── routes/             # API routes
│   │   ├── spotify.js
│   │   └── mood.js
│   ├── services/           # Business logic
│   │   └── spotifyService.js
│   ├── index.js            # Server entry point
│   └── package.json
│
├── .github/
│   └── copilot-instructions.md
├── package.json            # Root package.json
└── README.md
\`\`\`

## 🎯 Supported Moods

| Mood | Description | Genres |
|------|-------------|--------|
| 😊 Happy | Upbeat and joyful | pop, dance, party |
| 😢 Sad | Melancholic and emotional | acoustic, piano, sad |
| 😠 Angry | Intense and aggressive | metal, rock, hard-rock |
| 😌 Relaxed | Calm and peaceful | ambient, chill, study |
| 🧘 Calm | Tranquil and meditative | ambient, lo-fi, classical |
| ⚡ Energetic | High-energy and pumped | edm, workout, electronic |
| ❤️ Romantic | Loving and passionate | romance, soul, r-n-b |

## 🔌 API Endpoints

### Spotify Routes
- `GET /api/spotify/recommendations?mood={mood}&limit={limit}`
- `GET /api/spotify/search?q={query}&limit={limit}`
- `GET /api/spotify/moods`

### Mood Analysis Routes
- `POST /api/mood/analyze-text` - Body: `{ text: string }`
- `POST /api/mood/analyze-voice` - Body: `{ pitch, energy, tempo }`

## 🚢 Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables
4. Deploy

### Backend (Render/Railway)
1. Push code to GitHub
2. Create new web service
3. Set environment variables
4. Deploy

## 🐛 Troubleshooting

### Face Detection Not Working
- Ensure models are downloaded in `client/public/models/`
- Check browser permissions for camera access
- Try using HTTPS (camera may require secure context)

### Spotify API Errors
- Verify your Client ID and Secret are correct
- Check that your Spotify app is not in development mode quota limits
- Ensure the backend server is running

### CORS Issues
- Check `CLIENT_URL` in server `.env`
- Verify Vite proxy configuration

## 📝 License

MIT License - feel free to use this project for your final year engineering project or personal use.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 💡 Future Enhancements

- [ ] User authentication and profile
- [ ] Playlist creation and saving
- [ ] Social sharing features
- [ ] Advanced ML models for better emotion detection
- [ ] Mobile app version
- [ ] Integration with more music platforms

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

Made with ❤️ and 🎵
\`\`\`
