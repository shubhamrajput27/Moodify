const { applyCors, enforceMethod, json } = require("./_lib/http");

module.exports = (req, res) => {
  if (!applyCors(req, res, ["GET"])) {
    return;
  }

  if (!enforceMethod(req, res, ["GET"])) {
    return;
  }

  json(res, 200, { status: "ok", message: "Moodify API is running" });
};
