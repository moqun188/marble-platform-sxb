import rateLimit from "express-rate-limit";

// General API rate limiter: 100 requests per minute per IP
export const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100,
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  message: {
    error: "Too many requests",
    message: "You have exceeded the 100 requests per minute limit. Please try again later.",
    retryAfter: "Check Retry-After header",
  },
  keyGenerator: (req) => {
    // Use X-Forwarded-For if behind proxy, else use IP
    return req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || req.ip;
  },
});

// Stricter limiter for search: 30 requests per minute
export const searchLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many search requests",
    message: "Search is limited to 30 requests per minute.",
  },
});

// Graph endpoint limiter: 10 requests per minute (heavy computation)
export const graphLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many graph requests",
    message: "Graph endpoint is limited to 10 requests per minute due to large data payload.",
  },
});
