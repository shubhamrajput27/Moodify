const { applyCors, enforceMethod, json } = require("../_lib/http");
const spotifyService = require("../_lib/spotifyService");

const validMoods = ["happy", "sad", "angry", "relaxed", "calm", "energetic", "romantic"];

module.exports = async (req, res) => {
  if (!applyCors(req, res, ["GET"])) {
    return;
  }

  if (!enforceMethod(req, res, ["GET"])) {
    return;
  }

  try {
    const { mood, limit, genre, refresh } = req.query || {};

    if (!mood) {
      json(res, 400, { error: "Mood parameter is required" });
      return;
    }

    if (!validMoods.includes(String(mood).toLowerCase())) {
      json(res, 400, {
        error: "Invalid mood",
        validMoods,
      });
      return;
    }

    const recommendations = await spotifyService.getRecommendations(
      mood,
      parseInt(limit, 10) || 20,
      genre || "",
      refresh || ""
    );

    json(res, 200, {
      mood,
      genre: genre || null,
      count: recommendations.length,
      tracks: recommendations,
    });
  } catch (error) {
    json(res, 500, { error: error.message || "Internal server error" });
  }
};
