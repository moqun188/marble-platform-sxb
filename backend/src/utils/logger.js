import { CONFIG } from "../config.js";

const LEVELS = { error: 0, warn: 1, info: 2, debug: 3 };
const currentLevel = LEVELS[CONFIG.logLevel] ?? 2;

function log(level, ...args) {
  if (LEVELS[level] <= currentLevel) {
    const ts = new Date().toISOString();
    const prefix = `[${ts}] [${level.toUpperCase()}]`;
    if (level === "error") {
      console.error(prefix, ...args);
    } else {
      console.log(prefix, ...args);
    }
  }
}

export const logger = {
  error: (...args) => log("error", ...args),
  warn: (...args) => log("warn", ...args),
  info: (...args) => log("info", ...args),
  debug: (...args) => log("debug", ...args),
};

