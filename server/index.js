import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import spotifyRouter from './routes/spotify.js';
import moodRouter from './routes/mood.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === 'production';
const extraOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:3000',
  'http://localhost:3000',
  'http://localhost:3001',
  ...extraOrigins,
];

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) {
      return callback(null, true);
    }

    const isExactAllowed = allowedOrigins.includes(origin);
    const isVercelDomain = /^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(origin);

    if (isExactAllowed || isVercelDomain) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  if (!isProduction) {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  }
  next();
});

// Routes
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Moodify API is running',
    docs: '/api/health'
  });
});

app.use('/api/spotify', spotifyRouter);
app.use('/api/mood', moodRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Moodify API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal server error',
      status: err.status || 500
    }
  });
});

// Start server
const server = app.listen(PORT, () => {
  if (!isProduction) {
    console.log(`Moodify server running on http://localhost:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  }
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Stop the existing server or use a different PORT.`);
    return;
  }

  throw err;
});

export default app;
