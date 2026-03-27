# Moodify

Moodify is a mood-based music recommendation app that uses Spotify data to suggest tracks based on how the user feels.

## Live Deployment

- Frontend: https://moodify-shubhamrajput27-8s0cydil9.vercel.app
- Backend API (same Vercel project): /api
- Health check: /api/health

## Features

- Mood detection from text input
- Face mood detection flow (client-side face model integration)
- Voice mood detection flow
- Spotify track search
- Mood-based Spotify recommendations
- Responsive React UI with animation

## Tech Stack

### Frontend

- React 18
- Vite
- Tailwind CSS
- Framer Motion
- face-api.js
- Axios

### Backend

- Node.js
- Express
- Axios
- CORS
- dotenv

### Deployment

- Vercel for frontend and backend API functions

## Project Structure

- client: React frontend app
- server: Express backend API
- render.yaml: Render Blueprint definition
- vercel.json: Vercel build and routing config

## Prerequisites

- Node.js 18 or higher
- npm
- Spotify Developer App credentials

## Environment Variables

### Server (server/.env)

Create server/.env with:

SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000

### Client (client/.env)

Create client/.env with:

VITE_API_URL=http://localhost:5000/api

## Install and Run Locally

1. Install dependencies:

npm install
npm install --prefix client
npm install --prefix server

2. Run both frontend and backend:

npm run dev

3. Local URLs:

- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Available Scripts

### Root scripts

- npm run dev: run backend and frontend together
- npm run build: build frontend for production
- npm run lint: lint frontend code
- npm run start:server: start backend

### Client scripts

- npm run dev --prefix client
- npm run build --prefix client
- npm run preview --prefix client
- npm run lint --prefix client

### Server scripts

- npm run dev --prefix server
- npm run start --prefix server

## API Endpoints

Base URL (local): http://localhost:5000/api

- GET /health
- GET /spotify/moods
- GET /spotify/search?q=QUERY&limit=NUMBER
- GET /spotify/recommendations?mood=MOOD&limit=NUMBER
- POST /mood/analyze-text
- POST /mood/analyze-voice

## Supported Moods

- happy
- sad
- angry
- relaxed
- calm
- energetic
- romantic

## Face Detection Models

Face mode requires model files under:

client/public/models

If the models are missing, face mood detection will not work.

## Deployment Guide

### 1) Deploy app on Vercel

Deploy the repository root on Vercel. Frontend is built from `client/` and backend is served from `api/` Vercel Functions.

Required environment variables in Vercel:

- SPOTIFY_CLIENT_ID
- SPOTIFY_CLIENT_SECRET
- NODE_ENV=production
- CLIENT_URL=<your Vercel app URL>
- ALLOWED_ORIGINS=<optional comma-separated extra origins>

Optional client variable:

- VITE_API_URL=/api

Then redeploy production.

## CORS Notes

Backend CORS allows:

- CLIENT_URL from environment
- localhost dev URLs
- project preview domains matching moodify-shubhamrajput27-*.vercel.app

## Troubleshooting

### Backend health works, recommendations fail

- Check SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in Vercel
- Redeploy after env changes
- Check Vercel Function logs for Spotify API errors

### Frontend cannot call backend

- Ensure VITE_API_URL points to `/api` or your deployed `/api` base URL
- Ensure CLIENT_URL in Vercel exactly matches frontend URL
- Redeploy after env changes

### Face detection not working

- Confirm model files exist in client/public/models
- Verify camera permission in browser

## Security Notes

- Never commit real secrets to Git
- Rotate Spotify Client Secret if it is exposed
- Keep all production secrets in Vercel environment settings

## License

MIT
