import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { getMoodData } from '../utils/moodMapper';

const RECORD_DURATION_MS = 5000;
const MIN_VOICE_HZ = 75;
const MAX_VOICE_HZ = 400;

/**
 * Estimate the fundamental frequency of a time-domain audio buffer using
 * autocorrelation (the standard ACF2+ approach). Returns -1 when the signal
 * is too quiet or noisy to yield a confident pitch estimate.
 */
function autoCorrelatePitch(buffer, sampleRate) {
  const SIZE = buffer.length;

  let rms = 0;
  for (let i = 0; i < SIZE; i++) {
    rms += buffer[i] * buffer[i];
  }
  rms = Math.sqrt(rms / SIZE);
  if (rms < 0.01) return -1;

  const threshold = 0.2;
  let start = 0;
  let end = SIZE - 1;
  for (let i = 0; i < SIZE / 2; i++) {
    if (Math.abs(buffer[i]) < threshold) {
      start = i;
      break;
    }
  }
  for (let i = 1; i < SIZE / 2; i++) {
    if (Math.abs(buffer[SIZE - i]) < threshold) {
      end = SIZE - i;
      break;
    }
  }

  const trimmed = buffer.slice(start, end);
  const n = trimmed.length;
  if (n < 2) return -1;

  const correlations = new Array(n).fill(0);
  for (let lag = 0; lag < n; lag++) {
    let sum = 0;
    for (let i = 0; i < n - lag; i++) {
      sum += trimmed[i] * trimmed[i + lag];
    }
    correlations[lag] = sum;
  }

  let d = 0;
  while (d < n - 1 && correlations[d] > correlations[d + 1]) d++;

  let maxVal = -1;
  let maxPos = -1;
  for (let i = d; i < n; i++) {
    if (correlations[i] > maxVal) {
      maxVal = correlations[i];
      maxPos = i;
    }
  }

  if (maxPos <= 0) return -1;

  // Parabolic interpolation around the peak for sub-sample precision.
  const x1 = correlations[maxPos - 1] ?? correlations[maxPos];
  const x2 = correlations[maxPos];
  const x3 = correlations[maxPos + 1] ?? correlations[maxPos];
  const a = (x1 + x3 - 2 * x2) / 2;
  const b = (x3 - x1) / 2;
  const refinedPos = a ? maxPos - b / (2 * a) : maxPos;

  const frequency = sampleRate / refinedPos;
  if (!Number.isFinite(frequency) || frequency < 40 || frequency > 1000) return -1;

  return frequency;
}

function normalizePitch(freqHz) {
  if (!freqHz || freqHz <= 0) return 0.5;
  const clamped = Math.min(Math.max(freqHz, MIN_VOICE_HZ), MAX_VOICE_HZ);
  return (clamped - MIN_VOICE_HZ) / (MAX_VOICE_HZ - MIN_VOICE_HZ);
}

/**
 * Proxy for speaking pace: rate of local energy peaks (syllable-ish bursts)
 * per second, normalized against a "fast speech" ceiling of ~4 peaks/sec.
 */
function estimateTempo(energySamples) {
  if (energySamples.length < 4) return 0.5;

  const levels = energySamples.map((s) => s.level);
  const mean = levels.reduce((a, b) => a + b, 0) / levels.length;

  let peaks = 0;
  for (let i = 1; i < levels.length - 1; i++) {
    if (levels[i] > mean * 1.15 && levels[i] >= levels[i - 1] && levels[i] >= levels[i + 1]) {
      peaks++;
    }
  }

  const durationSec = (energySamples[energySamples.length - 1].t - energySamples[0].t) / 1000;
  if (durationSec <= 0) return 0.5;

  return Math.min(peaks / durationSec / 4, 1);
}

function classifyMoodFromVoiceFeatures({ pitch, energy, tempo }) {
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
}

export default function VoiceMoodDetector({ onMoodDetected }) {
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [detectedMood, setDetectedMood] = useState(null);
  const [error, setError] = useState(null);
  const [audioLevel, setAudioLevel] = useState(0);

  const mediaRecorderRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const timeDomainBufferRef = useRef(null);
  const isRecordingRef = useRef(false);
  const pitchSamplesRef = useRef([]);
  const energySamplesRef = useRef([]);

  const startRecording = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.onstop = () => {
        analyzeVoice();
        stream.getTracks().forEach((track) => track.stop());
      };

      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      analyserRef.current.fftSize = 2048;
      timeDomainBufferRef.current = new Float32Array(analyserRef.current.fftSize);

      pitchSamplesRef.current = [];
      energySamplesRef.current = [];

      mediaRecorderRef.current.start();
      setIsRecording(true);
      isRecordingRef.current = true;

      monitorAudioSignal();

      setTimeout(stopRecording, RECORD_DURATION_MS);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      setError('Microphone access denied. Please allow microphone permissions.');
    }
  };

  const stopRecording = () => {
    isRecordingRef.current = false;
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  const monitorAudioSignal = () => {
    const freqData = new Uint8Array(analyserRef.current.frequencyBinCount);

    const tick = () => {
      if (!isRecordingRef.current || !analyserRef.current) return;

      analyserRef.current.getByteFrequencyData(freqData);
      const level = freqData.reduce((a, b) => a + b, 0) / freqData.length / 255;
      setAudioLevel(level);
      energySamplesRef.current.push({ t: performance.now(), level });

      analyserRef.current.getFloatTimeDomainData(timeDomainBufferRef.current);
      const freqHz = autoCorrelatePitch(timeDomainBufferRef.current, audioContextRef.current.sampleRate);
      if (freqHz > 0) {
        pitchSamplesRef.current.push(freqHz);
      }

      requestAnimationFrame(tick);
    };

    tick();
  };

  const analyzeVoice = () => {
    setIsAnalyzing(true);

    setTimeout(() => {
      const avgFreq = pitchSamplesRef.current.length
        ? pitchSamplesRef.current.reduce((a, b) => a + b, 0) / pitchSamplesRef.current.length
        : 0;
      const energy = energySamplesRef.current.length
        ? energySamplesRef.current.reduce((a, s) => a + s.level, 0) / energySamplesRef.current.length
        : audioLevel;

      const features = {
        pitch: normalizePitch(avgFreq),
        energy,
        tempo: estimateTempo(energySamplesRef.current),
      };

      const mood = classifyMoodFromVoiceFeatures(features);

      setDetectedMood(mood);
      setIsAnalyzing(false);

      if (onMoodDetected) {
        onMoodDetected(mood);
      }
    }, 400);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 rounded-2xl bg-gray-50 dark:bg-dark-800/50 border border-gray-200 dark:border-white/5 transition-colors duration-300"
    >
      <div className="flex items-center gap-3 mb-4">
        <span className="text-3xl">🎤</span>
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Voice Input</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Speak to express your mood</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 text-red-200 mb-4">
          {error}
        </div>
      )}

      <div className="bg-gray-100 dark:bg-white/5 rounded-lg p-8 mb-4 transition-colors duration-300">
        <div className="flex flex-col items-center justify-center">
          {/* Audio visualizer */}
          {isRecording && (
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="mb-4"
            >
              <div
                className="w-32 h-32 rounded-full bg-gradient-to-r from-coral to-primary-500"
                style={{
                  opacity: 0.3 + audioLevel * 0.7,
                  transform: `scale(${0.8 + audioLevel * 0.4})`
                }}
              />
            </motion.div>
          )}

          {!isRecording && !isAnalyzing && (
            <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-white/10 flex items-center justify-center mb-4">
              <span className="text-5xl">🎤</span>
            </div>
          )}

          {isAnalyzing && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-16 h-16 border-4 border-coral border-t-transparent rounded-full mb-4"
            />
          )}

          <p className="text-center text-gray-600 dark:text-gray-400">
            {isRecording && 'Listening... Speak now!'}
            {isAnalyzing && 'Analyzing your voice...'}
            {!isRecording && !isAnalyzing && 'Click to start recording'}
          </p>

          {isRecording && (
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
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
