import express from "express";
import cors from "cors";
import { CONFIG } from "./config.js";
import { logger } from "./utils/logger.js";
import { loadData } from "./services/data.js";
import { requestLogger } from "./middleware/request-logger.js";
import { errorHandler, notFoundHandler } from "./middleware/error.js";
import topicsRouter from "./routes/topics.js";
import metaRouter from "./routes/meta.js";

const app = express();

// Middleware
app.use(cors({ origin: CONFIG.corsOrigin }));
app.use(express.json());
app.use(requestLogger);

// Load data on startup
loadData();

// Routes
app.use("/api/topics", topicsRouter);
app.use("/api", metaRouter);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(CONFIG.port, "0.0.0.0", () => {
  logger.info(`Marble API running on port ${CONFIG.port} [${CONFIG.nodeEnv}]`);
});

