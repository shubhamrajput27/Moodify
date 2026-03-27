const { applyCors, enforceMethod, json } = require("../_lib/http");
const spotifyService = require("../_lib/spotifyService");

module.exports = async (req, res) => {
  if (!applyCors(req, res, ["GET"])) {
    return;
  }

  if (!enforceMethod(req, res, ["GET"])) {
    return;
  }

  try {
    const { q, limit } = req.query || {};

    if (!q) {
      json(res, 400, { error: "Query parameter is required" });
      return;
    }

    const tracks = await spotifyService.searchTracks(q, parseInt(limit, 10) || 10);
    json(res, 200, {
      query: q,
      count: tracks.length,
      tracks,
    });
  } catch (error) {
    json(res, 500, { error: error.message || "Internal server error" });
  }
};
