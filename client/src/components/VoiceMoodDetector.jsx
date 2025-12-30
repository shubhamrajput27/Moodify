import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { getMoodData } from '../utils/moodMapper';

export default function VoiceMoodDetector({ onMoodDetected }) {
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [detectedMood, setDetectedMood] = useState(null);
  const [error, setError] = useState(null);
  const [audioLevel, setAudioLevel] = useState(0);
  
  const mediaRecorderRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Set up audio recording
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        analyzeVoice();
        stream.getTracks().forEach(track => track.stop());
      };

      // Set up audio analysis
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      
      analyserRef.current.fftSize = 2048;
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
      
      // Monitor audio level
      monitorAudioLevel();
      
      // Auto-stop after 5 seconds
      setTimeout(() => {
        if (mediaRecorderRef.current && isRecording) {
          stopRecording();
        }
      }, 5000);
      
    } catch (err) {
      console.error('Error accessing microphone:', err);
      setError('Microphone access denied. Please allow microphone permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const monitorAudioLevel = () => {
    if (!analyserRef.current || !isRecording) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    const checkLevel = () => {
      if (!isRecording) return;
      
      analyserRef.current.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((a, b) => a + b) / bufferLength;
      setAudioLevel(average / 255); // Normalize to 0-1
      
      requestAnimationFrame(checkLevel);
    };
    
    checkLevel();
  };

  const analyzeVoice = () => {
    setIsAnalyzing(true);

    // Simulate voice analysis (in production, you'd analyze the audio data)
    setTimeout(() => {
      const features = analyzeAudioFeatures();
      const mood = classifyMoodFromVoice(features);
      
      setDetectedMood(mood);
      setIsAnalyzing(false);
      
      if (onMoodDetected) {
        onMoodDetected(mood);
      }
    }, 1500);
  };

  const analyzeAudioFeatures = () => {
    // Simple heuristic analysis based on audio level
    // In production, you'd use Web Audio API for proper pitch/tempo analysis
    
    const energy = audioLevel;
    const pitch = Math.random(); // Placeholder
    const tempo = Math.random(); // Placeholder

    return { pitch, energy, tempo };
  };

  const classifyMoodFromVoice = ({ pitch, energy, tempo }) => {
    // Simple heuristic classification
    if (energy > 0.7 && pitch > 0.6) {
      return tempo > 0.7 ? 'energetic' : 'happy';
    }
    if (energy < 0.4 && pitch < 0.4) {
      return tempo < 0.3 ? 'calm' : 'sad';
    }
    if (energy > 0.7 && pitch < 0.5) {
      return 'angry';
    }
    if (energy > 0.4 && energy < 0.7) {
      return pitch > 0.5 ? 'romantic' : 'relaxed';
    }
    return 'relaxed';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mood-card"
    >
      <div className="flex items-center gap-3 mb-4">
        <span className="text-3xl">🎤</span>
        <div>
          <h3 className="text-xl font-semibold">Voice Input</h3>
          <p className="text-sm text-gray-400">Speak to express your mood</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 text-red-200 mb-4">
          {error}
        </div>
      )}

      <div className="bg-white/5 rounded-lg p-8 mb-4">
        <div className="flex flex-col items-center justify-center">
          {/* Audio visualizer */}
          {isRecording && (
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="mb-4"
            >
              <div 
                className="w-32 h-32 rounded-full bg-gradient-to-r from-primary-500 to-pink-500"
                style={{ 
                  opacity: 0.3 + audioLevel * 0.7,
                  transform: `scale(${0.8 + audioLevel * 0.4})`
                }}
              />
            </motion.div>
          )}

          {!isRecording && !isAnalyzing && (
            <div className="w-32 h-32 rounded-full bg-white/10 flex items-center justify-center mb-4">
              <span className="text-5xl">🎤</span>
            </div>
          )}

          {isAnalyzing && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full mb-4"
            />
          )}

          <p className="text-center text-gray-400">
            {isRecording && 'Listening... Speak now!'}
            {isAnalyzing && 'Analyzing your voice...'}
            {!isRecording && !isAnalyzing && 'Click to start recording'}
          </p>

          {isRecording && (
            <p className="text-sm text-gray-500 mt-2">
              Recording will auto-stop in 5 seconds
            </p>
          )}
        </div>
      </div>

      <button
        onClick={isRecording ? stopRecording : startRecording}
        disabled={isAnalyzing}
        className={`w-full ${isRecording ? 'btn-secondary' : 'btn-primary'} disabled:opacity-50`}
      >
        {isRecording ? 'Stop Recording' : isAnalyzing ? 'Analyzing...' : 'Start Voice Detection'}
      </button>

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
