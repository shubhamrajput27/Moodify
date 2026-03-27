const { applyCors, enforceMethod, json, parseJsonBody } = require("../_lib/http");
const { classifyMoodFromVoice } = require("../_lib/moodClassifier");

module.exports = async (req, res) => {
  if (!applyCors(req, res, ["POST"])) {
    return;
  }

  if (!enforceMethod(req, res, ["POST"])) {
    return;
  }

  try {
    const body = await parseJsonBody(req);
    const pitch = body && body.pitch;
    const energy = body && body.energy;
    const tempo = body && body.tempo;

    const mood = classifyMoodFromVoice(pitch, energy, tempo);

    json(res, 200, {
      detectedMood: mood,
      confidence: 0.75,
      features: { pitch, energy, tempo },
    });
  } catch (error) {
    json(res, 500, { error: "Failed to analyze voice" });
  }
};
