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
    const { playlist, limit } = req.query || {};

    if (!playlist) {
      json(res, 400, { error: "Playlist ID or URL is required" });
      return;
    }

    const tracks = await spotifyService.getPlaylistTracks(playlist, parseInt(limit, 10) || 20);

    json(res, 200, {
      playlist,
      count: tracks.length,
      tracks,
    });
  } catch (error) {
    json(res, 500, { error: error.message || "Internal server error" });
  }
};
