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
import topicsRouter from "./routes/topics.js";
import metaRouter from "./routes/meta.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

// Middleware
app.use(cors({ origin: CONFIG.corsOrigin }));
app.use(compression());
app.use(express.json());
app.use(requestLogger);

// Cache control for API responses
app.use("/api/graph", (req, res, next) => {
  res.set("Cache-Control", "public, max-age=300"); // 5min
  next();
});
app.use("/api/subjects", (req, res, next) => {
  res.set("Cache-Control", "public, max-age=300");
  next();
});
app.use("/api/domains", (req, res, next) => {
  res.set("Cache-Control", "public, max-age=300");
  next();
});
app.use("/api/clusters", (req, res, next) => {
  res.set("Cache-Control", "public, max-age=300");
  next();
});
app.use("/api/standards", (req, res, next) => {
  res.set("Cache-Control", "public, max-age=300");
  next();
});

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
