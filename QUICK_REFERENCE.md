# 🎵 Moodify - Quick Reference Card

## 📋 Essential Commands

### Installation
\`\`\`bash
npm install                    # Install root dependencies
cd client && npm install       # Install frontend dependencies
cd server && npm install       # Install backend dependencies
\`\`\`

### Development
\`\`\`bash
npm run dev                    # Run both frontend and backend
npm run dev:client            # Run frontend only (port 3000)
npm run dev:server            # Run backend only (port 5000)
\`\`\`

### Build
\`\`\`bash
cd client
npm run build                  # Build production frontend
\`\`\`

---

## 🔑 Environment Variables

### Backend (server/.env)
\`\`\`env
SPOTIFY_CLIENT_ID=your_client_id_here
SPOTIFY_CLIENT_SECRET=your_client_secret_here
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
\`\`\`

### Frontend (client/.env)
\`\`\`env
VITE_API_URL=http://localhost:5000/api
\`\`\`

---

## 🌐 URLs

| Service | Development | Production |
|---------|-------------|------------|
| Frontend | http://localhost:3000 | https://your-app.vercel.app |
| Backend | http://localhost:5000 | https://your-api.onrender.com |
| API Docs | http://localhost:5000/api | - |

---

## 🎯 Supported Moods

| Mood | Keywords | Genres |
|------|----------|--------|
| 😊 Happy | happy, joy, excited | pop, dance, party |
| 😢 Sad | sad, down, lonely | acoustic, piano |
| 😠 Angry | angry, mad, furious | metal, rock |
| 😌 Relaxed | relaxed, chill, calm | ambient, chill |
| 🧘 Calm | calm, peaceful, zen | lo-fi, meditation |
| ⚡ Energetic | energetic, pumped | edm, workout |
| ❤️ Romantic | romantic, love | soul, r-n-b |

---

## 🔌 API Endpoints

### Spotify Routes
\`\`\`
GET  /api/spotify/recommendations?mood={mood}&limit={limit}
GET  /api/spotify/search?q={query}&limit={limit}
GET  /api/spotify/moods
\`\`\`

### Mood Routes
\`\`\`
POST /api/mood/analyze-text
     Body: { "text": "I'm feeling happy" }

POST /api/mood/analyze-voice
     Body: { "pitch": 0.5, "energy": 0.7, "tempo": 0.6 }
\`\`\`

### Health Check
\`\`\`
GET  /api/health
\`\`\`

---

## 📦 Required Dependencies

### Frontend (18 packages)
\`\`\`json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.21.0",
  "framer-motion": "^10.16.16",
  "face-api.js": "^0.22.2",
  "axios": "^1.6.2",
  "tailwindcss": "^3.4.0"
}
\`\`\`

### Backend (5 packages)
\`\`\`json
{
  "express": "^4.18.2",
  "cors": "^2.8.5",
  "dotenv": "^16.3.1",
  "axios": "^1.6.2"
}
\`\`\`

---

## 📁 Key Files to Know

| File | Purpose |
|------|---------|
| `client/src/App.jsx` | Main React component with routing |
| `client/src/pages/Home.jsx` | Landing page |
| `client/src/pages/Recommend.jsx` | Main recommendation page |
| `client/src/utils/moodMapper.js` | Mood classification logic |
| `client/src/utils/spotify.js` | API client |
| `server/index.js` | Express server entry |
| `server/services/spotifyService.js` | Spotify API integration |
| `server/routes/spotify.js` | Spotify endpoints |
| `server/routes/mood.js` | Mood analysis endpoints |

---

## 🎨 Tailwind Utility Classes

### Custom Classes
\`\`\`css
.gradient-bg          /* Gradient background */
.glass-effect         /* Glass-morphism effect */
.btn-primary          /* Primary button style */
.btn-secondary        /* Secondary button style */
.mood-card            /* Card for mood input */
.song-card            /* Card for song display */
\`\`\`

### Common Patterns
\`\`\`jsx
<div className="flex items-center justify-center">
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
<div className="bg-dark-800 rounded-lg p-6">
<button className="btn-primary">Click Me</button>
\`\`\`

---

## 🎭 Component Props

### TextMoodInput
\`\`\`jsx
<TextMoodInput 
  onMoodDetected={(mood) => console.log(mood)} 
/>
\`\`\`

### FaceMoodDetector
\`\`\`jsx
<FaceMoodDetector 
  onMoodDetected={(mood) => console.log(mood)} 
/>
\`\`\`

### VoiceMoodDetector
\`\`\`jsx
<VoiceMoodDetector 
  onMoodDetected={(mood) => console.log(mood)} 
/>
\`\`\`

### SongCard
\`\`\`jsx
<SongCard 
  song={{
    id, name, artist, album,
    albumArt, previewUrl, spotifyUrl
  }}
  index={0}
/>
\`\`\`

---

## 🐛 Common Issues & Fixes

### Port Already in Use
\`\`\`bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Change port in vite.config.js or server/.env
\`\`\`

### CORS Error
\`\`\`javascript
// Check CLIENT_URL in server/.env
CLIENT_URL=http://localhost:3000
\`\`\`

### Face Detection Not Working
\`\`\`bash
# Ensure models are in:
client/public/models/
- tiny_face_detector_model-*
- face_expression_model-*
- face_landmark_68_model-*
\`\`\`

### Spotify API Error
\`\`\`bash
# Verify credentials in server/.env
SPOTIFY_CLIENT_ID=correct_id
SPOTIFY_CLIENT_SECRET=correct_secret
\`\`\`

---

## 🔒 Security Checklist

- [ ] `.env` files not committed to git
- [ ] `.gitignore` includes `.env`
- [ ] Spotify credentials in server only
- [ ] CORS configured for specific origin
- [ ] Input validation on all endpoints
- [ ] No console.log in production
- [ ] HTTPS in production

---

## 📊 Project Structure (Quick View)

\`\`\`
MOODIFY/
├── client/          # React frontend (Vite)
│   ├── src/
│   │   ├── components/  # 5 components
│   │   ├── pages/       # 2 pages
│   │   └── utils/       # 2 utilities
│   └── package.json
│
├── server/          # Express backend
│   ├── routes/      # 2 route files
│   ├── services/    # 1 service file
│   └── package.json
│
└── docs/           # 6 documentation files
\`\`\`

---

## 🚀 Deployment Quick Steps

### Frontend (Vercel)
1. Push to GitHub
2. Import to Vercel
3. Set `VITE_API_URL` env var
4. Deploy

### Backend (Render)
1. Push to GitHub
2. Create web service on Render
3. Set all env vars
4. Deploy

---

## 📚 Documentation Files

| File | Purpose | Lines |
|------|---------|-------|
| README.md | Main documentation | 400+ |
| SETUP.md | Quick start guide | 300+ |
| DEPLOYMENT.md | Deploy instructions | 400+ |
| PROJECT_SUMMARY.md | Feature overview | 500+ |
| CHECKLIST.md | Setup checklist | 300+ |
| ARCHITECTURE.md | System design | 400+ |
| BUILD_COMPLETE.md | Build summary | 500+ |

---

## 🎯 Testing Checklist

### Manual Tests
- [ ] Homepage loads correctly
- [ ] Navigation works
- [ ] Text input detects mood
- [ ] Recommendations appear
- [ ] Face detection activates camera
- [ ] Voice detection activates microphone
- [ ] Song cards display properly
- [ ] Spotify preview plays
- [ ] Error handling works

---

## 💡 Quick Tips

### Performance
- Token caching reduces API calls
- Lazy load components if needed
- Optimize images for web
- Use production build for deployment

### Development
- Keep backend and frontend running
- Use React DevTools for debugging
- Check Network tab for API calls
- Monitor Console for errors

### Deployment
- Test locally before deploying
- Use environment variables
- Enable HTTPS in production
- Monitor logs regularly

---

## 📞 Getting Help

1. Check this reference card
2. Read relevant documentation file
3. Check code comments
4. Search error message
5. Review GitHub issues (if applicable)

---

## ✅ Final Checklist

Before demo/submission:
- [ ] All dependencies installed
- [ ] Spotify API configured
- [ ] Face models downloaded
- [ ] Both servers running
- [ ] All features tested
- [ ] No console errors
- [ ] Documentation reviewed
- [ ] Code commented
- [ ] Ready to present

---

## 🎉 You're Ready!

This reference card has everything you need at a glance.

For detailed information, see:
- **Setup**: SETUP.md
- **Features**: PROJECT_SUMMARY.md
- **Deployment**: DEPLOYMENT.md
- **Architecture**: ARCHITECTURE.md

**Good luck! 🚀**
