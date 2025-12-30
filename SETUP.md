# Moodify - Quick Setup Guide

## 🚀 Quick Start (5 Minutes)

### Step 1: Get Spotify API Credentials
1. Go to https://developer.spotify.com/dashboard
2. Log in with your Spotify account
3. Click "Create an App"
4. Fill in:
   - App name: "Moodify"
   - App description: "Mood-based music recommendations"
5. Accept terms and click "Create"
6. Copy your **Client ID** and **Client Secret**

### Step 2: Configure Backend
1. Open `server\.env`
2. Replace the placeholder values:
   \`\`\`
   SPOTIFY_CLIENT_ID=paste_your_client_id_here
   SPOTIFY_CLIENT_SECRET=paste_your_client_secret_here
   \`\`\`

### Step 3: Download Face Detection Models
The face detection feature requires model files. Download them:

1. Visit: https://github.com/justadudewhohacks/face-api.js/tree/master/weights
2. Download these 6 files into `client\public\models\`:
   - tiny_face_detector_model-weights_manifest.json
   - tiny_face_detector_model-shard1
   - face_expression_model-weights_manifest.json
   - face_expression_model-shard1
   - face_landmark_68_model-weights_manifest.json
   - face_landmark_68_model-shard1

**Quick command to create the directory:**
\`\`\`powershell
mkdir client\public\models
\`\`\`

### Step 4: Install Dependencies
Run from the root directory:
\`\`\`powershell
npm install
cd client
npm install
cd ..\server
npm install
cd ..
\`\`\`

Or simply:
\`\`\`powershell
npm run install:all
\`\`\`

### Step 5: Run the Application
From the root directory:
\`\`\`powershell
npm run dev
\`\`\`

This will start both:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## ✅ Verify Installation

1. Open http://localhost:3000
2. You should see the Moodify homepage
3. Click "Get Started"
4. Try the text mood input first (easiest to test)
5. Enter "I'm feeling happy" and click "Analyze Mood"
6. You should see song recommendations!

## 🎯 Testing Each Feature

### Text Input (Easiest)
- Type: "I'm feeling happy and excited"
- Should detect: Happy mood
- Should show: Pop/dance music recommendations

### Face Detection
- Click the "Face" tab
- Allow camera permissions when prompted
- Click "Start Face Detection"
- Make a facial expression (smile, frown, etc.)
- Should detect your emotion

### Voice Input
- Click the "Voice" tab
- Allow microphone permissions when prompted
- Click "Start Voice Detection"
- Speak in an emotional tone for 5 seconds
- Should analyze your voice and detect mood

## 🐛 Common Issues

### Issue: "Failed to authenticate with Spotify"
**Solution:** Check that you correctly copied your Client ID and Secret in `server\.env`

### Issue: Face detection doesn't work
**Solution:** 
1. Ensure models are in `client\public\models\`
2. Check browser camera permissions
3. Try using HTTPS or localhost (camera requires secure context)

### Issue: CORS error
**Solution:** Make sure both frontend (3000) and backend (5000) are running

### Issue: Port already in use
**Solution:** 
- Frontend: Edit `client\vite.config.js` and change port
- Backend: Edit `server\.env` and change PORT value

## 📦 What You Built

✅ Full-stack React + Express application
✅ AI-powered mood detection (text, face, voice)
✅ Spotify API integration
✅ Real-time music recommendations
✅ Beautiful UI with animations
✅ Production-ready code structure

## 🎓 For Your Final Year Project

This application demonstrates:
- Frontend: React, Tailwind, Framer Motion
- Backend: Node.js, Express, REST APIs
- AI/ML: Emotion detection, NLP, computer vision
- External APIs: Spotify Web API
- Modern web development practices

## 📚 Next Steps

1. **Customize UI**: Edit colors in `client\tailwind.config.js`
2. **Add Features**: User authentication, playlist saving
3. **Improve AI**: Use better ML models for emotion detection
4. **Deploy**: Deploy to Vercel (frontend) and Render (backend)

## 💡 Tips

- Keep your `.env` files secure (never commit to git)
- Test with different moods and emotions
- Explore the Spotify API documentation for more features
- Read the code comments to understand how it works

## 🎉 You're Ready!

Your Moodify application is now ready to use. Enjoy discovering music based on your mood!

For detailed documentation, see the main README.md file.
