function parseAllowedOrigins() {
  const extraOrigins = (process.env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  return [
    process.env.CLIENT_URL || "http://localhost:3000",
    "http://localhost:3000",
    "http://localhost:3001",
    ...extraOrigins,
  ];
}

function isAllowedOrigin(origin) {
  if (!origin) {
    return true;
  }

  const allowedOrigins = parseAllowedOrigins();
  const isExactAllowed = allowedOrigins.includes(origin);
  const isVercelDomain = /^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(origin);

  return isExactAllowed || isVercelDomain;
}

function applyCors(req, res, allowedMethods) {
  const origin = req.headers.origin;

  if (origin && !isAllowedOrigin(origin)) {
    json(res, 403, { error: "Not allowed by CORS" });
    return false;
  }

  if (origin) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  }

  res.setHeader("Access-Control-Allow-Methods", [...allowedMethods, "OPTIONS"].join(", "));
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return false;
  }

  return true;
}

function enforceMethod(req, res, allowedMethods) {
  if (!allowedMethods.includes(req.method)) {
    json(res, 405, { error: "Method not allowed" });
    return false;
  }

  return true;
}

function json(res, statusCode, body) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
}

async function parseJsonBody(req) {
  if (req.body && typeof req.body === "object") {
    return req.body;
  }

  if (typeof req.body === "string") {
    return req.body ? JSON.parse(req.body) : {};
  }

  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }

  if (!chunks.length) {
    return {};
  }

  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? JSON.parse(raw) : {};
}

module.exports = {
  applyCors,
  enforceMethod,
  json,
  parseJsonBody,
};
