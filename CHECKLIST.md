# 🎯 Moodify - Getting Started Checklist

Use this checklist to get Moodify up and running quickly!

## ✅ Pre-Setup Checklist

- [ ] Node.js installed (v18+)
  - Check: Run `node --version` in terminal
  - Download: https://nodejs.org/

- [ ] npm installed (comes with Node.js)
  - Check: Run `npm --version` in terminal

- [ ] Git installed (for version control)
  - Check: Run `git --version` in terminal
  - Download: https://git-scm.com/

- [ ] Spotify account
  - Sign up: https://spotify.com

- [ ] Code editor (VS Code recommended)
  - Download: https://code.visualstudio.com/

---

## 📝 Setup Steps

### Step 1: Spotify API Setup (5 minutes)

- [ ] Go to https://developer.spotify.com/dashboard
- [ ] Log in with Spotify account
- [ ] Click "Create an App"
- [ ] Fill in app details:
  - Name: Moodify
  - Description: Mood-based music recommendations
- [ ] Accept terms
- [ ] Click "Create"
- [ ] Copy **Client ID**
- [ ] Click "Show Client Secret"
- [ ] Copy **Client Secret**

**✏️ Write these down:**
- Client ID: ___________________________________
- Client Secret: ___________________________________

---

### Step 2: Project Setup (3 minutes)

- [ ] Open terminal/PowerShell
- [ ] Navigate to MOODIFY folder:
  \`\`\`powershell
  cd c:\Users\shubh\MOODIFY
  \`\`\`

- [ ] Install root dependencies:
  \`\`\`powershell
  npm install
  \`\`\`

- [ ] Install client dependencies:
  \`\`\`powershell
  cd client
  npm install
  cd ..
  \`\`\`

- [ ] Install server dependencies:
  \`\`\`powershell
  cd server
  npm install
  cd ..
  \`\`\`

---

### Step 3: Environment Configuration (2 minutes)

- [ ] Open `server\.env` in your code editor

- [ ] Replace placeholder values:
  \`\`\`env
  SPOTIFY_CLIENT_ID=paste_your_client_id_here
  SPOTIFY_CLIENT_SECRET=paste_your_client_secret_here
  PORT=5000
  NODE_ENV=development
  CLIENT_URL=http://localhost:3000
  \`\`\`

- [ ] Save the file

- [ ] Verify `client\.env` contains:
  \`\`\`env
  VITE_API_URL=http://localhost:5000/api
  \`\`\`

---

### Step 4: Face Detection Models (10 minutes)

**Option A: Download Manually**

- [ ] Create models directory:
  \`\`\`powershell
  mkdir client\public\models
  \`\`\`

- [ ] Go to: https://github.com/justadudewhohacks/face-api.js/tree/master/weights

- [ ] Download these 6 files to `client\public\models\`:
  - [ ] tiny_face_detector_model-weights_manifest.json
  - [ ] tiny_face_detector_model-shard1
  - [ ] face_expression_model-weights_manifest.json
  - [ ] face_expression_model-shard1
  - [ ] face_landmark_68_model-weights_manifest.json
  - [ ] face_landmark_68_model-shard1

**Option B: Use PowerShell (faster)**

\`\`\`powershell
# Create directory
mkdir client\public\models
cd client\public\models

# Download models using curl or Invoke-WebRequest
# See SETUP.md for PowerShell download script
\`\`\`

---

### Step 5: First Run (1 minute)

- [ ] Open terminal in MOODIFY root folder

- [ ] Run the application:
  \`\`\`powershell
  npm run dev
  \`\`\`

- [ ] Wait for both servers to start

- [ ] You should see:
  \`\`\`
  🎵 Moodify server running on http://localhost:5000
  VITE v5.x.x ready in xxx ms
  ➜ Local: http://localhost:3000
  \`\`\`

- [ ] Open browser to http://localhost:3000

---

## 🧪 Testing Checklist

### Text Mood Input Test
- [ ] Click "Get Started" on homepage
- [ ] Text tab should be active by default
- [ ] Type: "I'm feeling happy and excited!"
- [ ] Click "Analyze Mood"
- [ ] Should detect "Happy" mood
- [ ] Should show song recommendations
- [ ] Songs should have album art
- [ ] Click "Open in Spotify" on a song (opens Spotify)

### Face Detection Test
- [ ] Click "Face" tab
- [ ] Click "Start Face Detection"
- [ ] Allow camera permissions when prompted
- [ ] Make a happy face 😊
- [ ] Should detect emotion
- [ ] Should show recommendations

### Voice Input Test
- [ ] Click "Voice" tab
- [ ] Click "Start Voice Detection"
- [ ] Allow microphone permissions when prompted
- [ ] Speak in an emotional tone
- [ ] Wait 5 seconds
- [ ] Should analyze voice
- [ ] Should show recommendations

---

## 🐛 Troubleshooting Checklist

### Problem: Server won't start

- [ ] Check if ports 3000 and 5000 are available
- [ ] Close any apps using these ports
- [ ] Try different ports in config files

### Problem: Spotify API errors

- [ ] Verify Client ID is correct in `server\.env`
- [ ] Verify Client Secret is correct in `server\.env`
- [ ] Check Spotify dashboard app is active
- [ ] Try regenerating Client Secret

### Problem: Face detection doesn't work

- [ ] Verify models are in `client\public\models\`
- [ ] Check browser has camera permissions
- [ ] Try in Chrome or Edge (better WebRTC support)
- [ ] Check browser console for errors

### Problem: CORS errors

- [ ] Verify backend is running on port 5000
- [ ] Verify frontend is running on port 3000
- [ ] Check `CLIENT_URL` in `server\.env`
- [ ] Restart both servers

### Problem: npm install errors

- [ ] Update Node.js to latest LTS version
- [ ] Clear npm cache: `npm cache clean --force`
- [ ] Delete node_modules and package-lock.json
- [ ] Run npm install again

---

## 📚 Next Steps After Setup

- [ ] Read README.md for full documentation
- [ ] Explore the code structure
- [ ] Try different moods and emotions
- [ ] Customize the UI colors
- [ ] Add new features
- [ ] Deploy to production (see DEPLOYMENT.md)

---

## 🎯 Quick Reference

### Start Development
\`\`\`powershell
npm run dev
\`\`\`

### Start Frontend Only
\`\`\`powershell
cd client
npm run dev
\`\`\`

### Start Backend Only
\`\`\`powershell
cd server
npm run dev
\`\`\`

### Build for Production
\`\`\`powershell
cd client
npm run build
\`\`\`

### Install New Dependency
\`\`\`powershell
# Frontend
cd client
npm install package-name

# Backend
cd server
npm install package-name
\`\`\`

---

## 📞 Getting Help

If stuck, check these resources in order:

1. **This checklist** - Common issues and solutions
2. **SETUP.md** - Detailed setup instructions
3. **README.md** - Complete documentation
4. **PROJECT_SUMMARY.md** - Technical details
5. **Code comments** - In-line explanations

---

## ✨ Success Indicators

You'll know everything is working when:

✅ Homepage loads with animations
✅ Can navigate between pages
✅ Text mood detection works
✅ Face detection activates camera
✅ Voice detection activates microphone
✅ Song recommendations appear
✅ Can play 30-second previews
✅ Spotify links open correctly

---

## 🎉 You're All Set!

Once all items are checked off, you have a fully functional Moodify application!

**Time to completion:** ~20 minutes

**What you've built:**
- Full-stack web application
- AI-powered mood detection
- Real-time music recommendations
- Production-ready code

---

**Happy coding! 🚀🎵**

_Last updated: December 30, 2025_
