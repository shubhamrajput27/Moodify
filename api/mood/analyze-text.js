const { applyCors, enforceMethod, json, parseJsonBody } = require("../_lib/http");
const { classifyMoodFromText } = require("../_lib/moodClassifier");

module.exports = async (req, res) => {
  if (!applyCors(req, res, ["POST"])) {
    return;
  }

  if (!enforceMethod(req, res, ["POST"])) {
    return;
  }

  try {
    const body = await parseJsonBody(req);
    const text = body && body.text;

    if (!text) {
      json(res, 400, { error: "Text parameter is required" });
      return;
    }

    const mood = classifyMoodFromText(String(text).toLowerCase());

    json(res, 200, {
      input: text,
      detectedMood: mood,
      confidence: 0.85,
    });
  } catch (error) {
    json(res, 500, { error: "Failed to analyze text" });
  }
};
