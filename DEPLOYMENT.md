# Moodify - Deployment Guide

## 🚀 Deploying to Production

This guide will help you deploy Moodify to production using:
- **Frontend**: Vercel (free)
- **Backend**: Render or Railway (free tier available)

---

## Part 1: Deploy Backend to Render

### 1. Prepare for Deployment

Create `server/package.json` start script (already done):
\`\`\`json
"scripts": {
  "start": "node index.js",
  "dev": "node --watch index.js"
}
\`\`\`

### 2. Push to GitHub

\`\`\`bash
git init
git add .
git commit -m "Initial commit - Moodify application"
git branch -M main
git remote add origin https://github.com/yourusername/moodify.git
git push -u origin main
\`\`\`

### 3. Deploy on Render

1. Go to https://render.com
2. Sign up / Log in
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Configure:
   - **Name**: moodify-api
   - **Root Directory**: `server`
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

6. Add Environment Variables:
   - `SPOTIFY_CLIENT_ID` = your_client_id
   - `SPOTIFY_CLIENT_SECRET` = your_client_secret
   - `PORT` = 10000 (Render default)
   - `NODE_ENV` = production
   - `CLIENT_URL` = (leave empty for now, will add after frontend deploy)

7. Click "Create Web Service"

8. Wait for deployment (5-10 minutes)

9. Copy your backend URL (e.g., `https://moodify-api.onrender.com`)

### Alternative: Deploy on Railway

1. Go to https://railway.app
2. Sign up / Log in
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Configure:
   - **Root Directory**: `server`
   - Add environment variables (same as Render)
6. Deploy

---

## Part 2: Deploy Frontend to Vercel

### 1. Update Frontend Configuration

Edit `client/.env.production` (create if doesn't exist):
\`\`\`env
VITE_API_URL=https://your-backend-url.onrender.com/api
\`\`\`

### 2. Deploy on Vercel

1. Go to https://vercel.com
2. Sign up / Log in with GitHub
3. Click "Add New" → "Project"
4. Import your repository
5. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

6. Add Environment Variables:
   - `VITE_API_URL` = `https://your-backend-url.onrender.com/api`

7. Click "Deploy"

8. Wait for deployment (2-5 minutes)

9. Copy your frontend URL (e.g., `https://moodify.vercel.app`)

### 3. Update Backend CORS

Go back to Render/Railway and update the `CLIENT_URL` environment variable:
\`\`\`
CLIENT_URL=https://moodify.vercel.app
\`\`\`

Redeploy the backend for changes to take effect.

---

## Part 3: Face-API Models Setup

### Option 1: Host Models on CDN
Upload the face-api.js models to a CDN (like Cloudinary or AWS S3)

### Option 2: Include in Build
Place models in `client/public/models/` before deploying

Update `client/src/components/FaceMoodDetector.jsx`:
\`\`\`javascript
const MODEL_URL = '/models'; // for Vercel
// or
const MODEL_URL = 'https://your-cdn-url.com/models'; // for CDN
\`\`\`

---

## 🔧 Post-Deployment Configuration

### Update Spotify App Settings

1. Go to https://developer.spotify.com/dashboard
2. Click on your Moodify app
3. Click "Edit Settings"
4. Add Redirect URIs (if implementing OAuth later):
   - `https://your-frontend-url.vercel.app/callback`
   - `http://localhost:3000/callback` (for local dev)

### Test Your Deployment

1. Visit your Vercel URL
2. Try each mood detection method
3. Verify Spotify recommendations load
4. Check browser console for errors

---

## 📊 Monitoring & Maintenance

### Render/Railway
- Check logs for errors
- Monitor response times
- Free tier may have cold starts (slow first request)

### Vercel
- Check Analytics dashboard
- Monitor build logs
- Set up alerts for errors

---

## 🔒 Security Best Practices

### Environment Variables
✅ Never commit `.env` files
✅ Use different credentials for production
✅ Rotate secrets regularly

### API Security
✅ Implement rate limiting (optional)
✅ Add request validation
✅ Use HTTPS only

---

## 💰 Cost Optimization

### Free Tier Limits

**Render Free:**
- 750 hours/month
- Sleeps after 15 min inactivity
- Wakes on request (cold start)

**Railway Free:**
- $5 credit/month
- Pay as you go after

**Vercel Free:**
- 100 GB bandwidth/month
- Unlimited projects
- Commercial use allowed

### Tips to Stay Free
- Use Render for backend (stays within free tier)
- Vercel for frontend (generous free tier)
- Optimize API calls
- Cache Spotify token

---

## 🐛 Troubleshooting Deployment

### Issue: Build fails on Vercel
**Solution:** 
- Check that all dependencies are in `package.json`
- Verify build command is correct
- Check Node version compatibility

### Issue: Backend returns 500 errors
**Solution:**
- Check environment variables are set
- Verify Spotify credentials
- Check backend logs on Render/Railway

### Issue: CORS errors in production
**Solution:**
- Verify `CLIENT_URL` matches your frontend URL exactly
- Include protocol (https://)
- Redeploy backend after changes

### Issue: Face detection doesn't work in production
**Solution:**
- Ensure models are accessible via HTTPS
- Check browser console for loading errors
- Consider hosting models on CDN

---

## 🎯 Custom Domain (Optional)

### For Vercel (Frontend)
1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

### For Render (Backend)
1. Upgrade to paid plan
2. Add custom domain in settings
3. Update DNS records

---

## 📈 Performance Optimization

### Frontend
- Enable Vercel Analytics
- Optimize images
- Lazy load components
- Minimize bundle size

### Backend
- Cache Spotify access token (already implemented)
- Add Redis for caching (optional)
- Optimize API responses
- Enable compression

---

## ✅ Deployment Checklist

- [ ] Backend deployed to Render/Railway
- [ ] Frontend deployed to Vercel
- [ ] Environment variables configured
- [ ] CORS settings updated
- [ ] Face-API models accessible
- [ ] Spotify app settings updated
- [ ] All features tested in production
- [ ] Error monitoring set up
- [ ] Documentation updated with live URLs

---

## 🎉 You're Live!

Your Moodify application is now accessible worldwide!

**Share your project:**
- Frontend: `https://your-app.vercel.app`
- Backend API: `https://your-api.onrender.com`

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Render Documentation](https://render.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [Spotify API Documentation](https://developer.spotify.com/documentation/web-api)

---

Good luck with your deployment! 🚀
