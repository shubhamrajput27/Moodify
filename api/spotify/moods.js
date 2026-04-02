const { applyCors, enforceMethod, json } = require("../_lib/http");

module.exports = (req, res) => {
  if (!applyCors(req, res, ["GET"])) {
    return;
  }

  if (!enforceMethod(req, res, ["GET"])) {
    return;
  }

  json(res, 200, {
    moods: [
      { value: "happy", label: "Happy", emoji: "😊", description: "Upbeat and joyful" },
      { value: "sad", label: "Sad", emoji: "😢", description: "Melancholic and emotional" },
      { value: "angry", label: "Angry", emoji: "😠", description: "Intense and aggressive" },
      { value: "relaxed", label: "Relaxed", emoji: "😌", description: "Calm and peaceful" },
      { value: "calm", label: "Calm", emoji: "🧘", description: "Tranquil and meditative" },
      { value: "energetic", label: "Energetic", emoji: "⚡", description: "High-energy and pumped" },
      { value: "anxious", label: "Anxious", emoji: "😰", description: "Restless and tense" },
      { value: "nostalgic", label: "Nostalgic", emoji: "📼", description: "Warm throwback feelings" },
      { value: "stressed", label: "Stressed", emoji: "😵", description: "Overloaded and tense" },
      { value: "romantic", label: "Romantic", emoji: "❤️", description: "Loving and passionate" },
    ],
  });
};
