function classifyMoodFromText(text) {
  const moodKeywords = {
    happy: ["happy", "joy", "excited", "great", "wonderful", "amazing", "love", "cheerful", "delighted", "pleased"],
    sad: ["sad", "depressed", "down", "unhappy", "miserable", "lonely", "heartbroken", "crying", "tears"],
    angry: ["angry", "mad", "furious", "rage", "annoyed", "frustrated", "irritated", "hate"],
    relaxed: ["relaxed", "chill", "calm", "peaceful", "tranquil", "serene", "mellow"],
    calm: ["calm", "quiet", "still", "peaceful", "zen", "meditation", "breathe"],
    energetic: ["energetic", "pumped", "hyped", "excited", "active", "workout", "motivated"],
    romantic: ["romantic", "love", "loving", "affection", "passion", "intimate", "tender"],
  };

  const moodScores = {};
  for (const [mood, keywords] of Object.entries(moodKeywords)) {
    moodScores[mood] = keywords.filter((keyword) => text.includes(keyword)).length;
  }

  const detectedMood = Object.entries(moodScores).sort(([, a], [, b]) => b - a)[0][0];
  return moodScores[detectedMood] > 0 ? detectedMood : "relaxed";
}

function classifyMoodFromVoice(pitch = 0, energy = 0, tempo = 0) {
  if (energy > 0.7 && pitch > 0.6) {
    return tempo > 0.7 ? "energetic" : "happy";
  }

  if (energy < 0.4 && pitch < 0.4) {
    return tempo < 0.3 ? "calm" : "sad";
  }

  if (energy > 0.7 && pitch < 0.5) {
    return "angry";
  }

  if (energy > 0.4 && energy < 0.7) {
    return pitch > 0.5 ? "romantic" : "relaxed";
  }

  return "relaxed";
}

module.exports = {
  classifyMoodFromText,
  classifyMoodFromVoice,
};
