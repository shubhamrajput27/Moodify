import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as faceapi from 'face-api.js';
import { getMoodData } from '../utils/moodMapper';

export default function FaceMoodDetector({ onMoodDetected }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectedMood, setDetectedMood] = useState(null);
  const [error, setError] = useState(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  // Load face-api models
  useEffect(() => {
    const loadModels = async () => {
      try {
        setIsLoading(true);
        const MODEL_URL = '/models'; // Place models in public/models folder
        
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL)
        ]);
        
        setModelsLoaded(true);
        setIsLoading(false);
      } catch (err) {
        console.error('Error loading models:', err);
        setError('Failed to load face detection models');
        setIsLoading(false);
      }
    };

    loadModels();
  }, []);

  const startCamera = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480 } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Camera access denied. Please allow camera permissions.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsDetecting(false);
  };

  const detectEmotion = async () => {
    if (!videoRef.current || !modelsLoaded) return;

    setIsDetecting(true);
    await startCamera();

    const detectLoop = async () => {
      if (!videoRef.current || !isDetecting) return;

      const detections = await faceapi
        .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();

      if (detections && detections.expressions) {
        const expressions = detections.expressions;
        const mood = mapExpressionToMood(expressions);
        setDetectedMood(mood);
        
        if (onMoodDetected) {
          onMoodDetected(mood);
        }

        // Draw detection on canvas
        if (canvasRef.current) {
          const displaySize = { 
            width: videoRef.current.videoWidth, 
            height: videoRef.current.videoHeight 
          };
          faceapi.matchDimensions(canvasRef.current, displaySize);
          const resizedDetections = faceapi.resizeResults(detections, displaySize);
          
          const ctx = canvasRef.current.getContext('2d');
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
        }

        // Stop after successful detection
        setTimeout(() => {
          stopCamera();
        }, 2000);
      } else {
        // Continue detecting
        requestAnimationFrame(detectLoop);
      }
    };

    // Wait for video to be ready
    videoRef.current.addEventListener('play', () => {
      detectLoop();
    });
  };

  const mapExpressionToMood = (expressions) => {
    // Map face-api expressions to our mood categories
    const expressionMap = {
      happy: 'happy',
      sad: 'sad',
      angry: 'angry',
      neutral: 'calm',
      surprised: 'energetic',
      fearful: 'relaxed',
      disgusted: 'angry'
    };

    // Find dominant expression
    const dominant = Object.entries(expressions)
      .sort(([, a], [, b]) => b - a)[0][0];

    return expressionMap[dominant] || 'relaxed';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mood-card"
    >
      <div className="flex items-center gap-3 mb-4">
        <span className="text-3xl">📸</span>
        <div>
          <h3 className="text-xl font-semibold">Facial Expression</h3>
          <p className="text-sm text-gray-400">Let your face tell the story</p>
        </div>
      </div>

      {isLoading && (
        <div className="text-center py-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full mx-auto"
          />
          <p className="mt-4 text-gray-400">Loading face detection models...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 text-red-200">
          {error}
        </div>
      )}

      {modelsLoaded && !isLoading && (
        <>
          <div className="relative rounded-lg overflow-hidden bg-black/50 mb-4">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-64 object-cover"
            />
            <canvas
              ref={canvasRef}
              className="absolute top-0 left-0 w-full h-full"
            />
            
            {!isDetecting && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <p className="text-white text-lg">Camera preview will appear here</p>
              </div>
            )}
          </div>

          <button
            onClick={isDetecting ? stopCamera : detectEmotion}
            disabled={isLoading}
            className={`w-full ${isDetecting ? 'btn-secondary' : 'btn-primary'} disabled:opacity-50`}
          >
            {isDetecting ? 'Stop Detection' : 'Start Face Detection'}
          </button>
        </>
      )}

      {detectedMood && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`mt-4 p-4 rounded-lg bg-gradient-to-r ${getMoodData(detectedMood).color}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Detected Mood</p>
              <p className="text-2xl font-bold capitalize">{detectedMood}</p>
            </div>
            <span className="text-4xl">{getMoodData(detectedMood).emoji}</span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
