import { config } from "dotenv";
config();

export const CONFIG = {
  port: parseInt(process.env.PORT || "3200"),
  nodeEnv: process.env.NODE_ENV || "development",
  logLevel: process.env.LOG_LEVEL || "info",
  corsOrigin: process.env.CORS_ORIGIN || "*",
};

