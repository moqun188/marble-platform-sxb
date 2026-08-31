import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { logger } from "../utils/logger.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = join(__dirname, "../../marble-data/data");

let _topics = null;
let _deps = null;
let _clusters = null;
let _standards = null;
let _byId = null;
let _prereqMap = null;
let _unlockMap = null;

export function loadData() {
  if (_topics) return;

  logger.info("Loading Marble data...");
  const start = Date.now();

  _topics = JSON.parse(readFileSync(join(dataDir, "topics.json"), "utf-8")).topics;
  _deps = JSON.parse(readFileSync(join(dataDir, "dependencies.json"), "utf-8")).dependencies;
  _clusters = JSON.parse(readFileSync(join(dataDir, "clusters.json"), "utf-8")).clusters;
  _standards = JSON.parse(readFileSync(join(dataDir, "curriculum-standards.json"), "utf-8"));

  _byId = new Map(_topics.map((t) => [t.id, t]));
  _prereqMap = new Map();
  _unlockMap = new Map();

  for (const d of _deps) {
    if (!_prereqMap.has(d.topicId)) _prereqMap.set(d.topicId, []);
    _prereqMap.get(d.topicId).push(d);
    if (!_unlockMap.has(d.prerequisiteId)) _unlockMap.set(d.prerequisiteId, []);
    _unlockMap.get(d.prerequisiteId).push(d);
  }

  const duration = Date.now() - start;
  logger.info(`Data loaded in ${duration}ms: ${_topics.length} topics, ${_deps.length} deps, ${_clusters.length} clusters`);
}

export function getTopics() { return _topics; }
export function getDeps() { return _deps; }
export function getClusters() { return _clusters; }
export function getStandards() { return _standards; }
export function getById() { return _byId; }
export function getPrereqMap() { return _prereqMap; }
export function getUnlockMap() { return _unlockMap; }

