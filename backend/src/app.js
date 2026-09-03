import express from "express";
import cors from "cors";
import compression from "compression";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { CONFIG } from "./config.js";
import { logger } from "./utils/logger.js";
import { loadData } from "./services/data.js";
import { requestLogger } from "./middleware/request-logger.js";
import { errorHandler, notFoundHandler } from "./middleware/error.js";
import { apiLimiter, searchLimiter, graphLimiter } from "./middleware/rate-limiter.js";
import topicsRouter from "./routes/topics.js";
import metaRouter from "./routes/meta.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

// Trust proxy (for X-Forwarded-For behind Docker/Nginx)
app.set("trust proxy", 1);

// Middleware
app.use(cors({ origin: CONFIG.corsOrigin }));
app.use(compression());
app.use(express.json());
app.use(requestLogger);

// Rate limiting
app.use("/api/", apiLimiter);
app.use("/api/topics", (req, res, next) => {
  // Apply search limiter only to list endpoint with query params
  if (req.query.q || req.query.search) {
    return searchLimiter(req, res, next);
  }
  next();
});
app.use("/api/graph", graphLimiter);

// Cache control for API responses
const cacheMiddleware = (seconds) => (req, res, next) => {
  res.set("Cache-Control", `public, max-age=${seconds}`);
  next();
};

app.use("/api/graph", cacheMiddleware(300));
app.use("/api/subjects", cacheMiddleware(300));
app.use("/api/domains", cacheMiddleware(300));
app.use("/api/clusters", cacheMiddleware(300));
app.use("/api/standards", cacheMiddleware(300));

// Load data on startup
loadData();

// Swagger UI
const swaggerDoc = YAML.load(join(__dirname, "../openapi.yaml"));
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc, {
  customCss: ".swagger-ui .topbar { display: none }",
  customSiteTitle: "Marble API Docs",
}));

// Routes
app.use("/api/topics", topicsRouter);
app.use("/api", metaRouter);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(CONFIG.port, "0.0.0.0", () => {
  logger.info(`Marble API running on port ${CONFIG.port} [${CONFIG.nodeEnv}]`);
  logger.info(`API docs: http://localhost:${CONFIG.port}/api/docs`);
});
