import { Router } from "express";
import { getTopics, getById, getPrereqMap, getUnlockMap } from "../services/data.js";
import { validateTopicId, validatePagination, validateSubject, validateTopicType, sanitizeSearch } from "../middleware/validate.js";

const router = Router();

// GET /api/topics — list with filtering
router.get("/", validatePagination, validateSubject, validateTopicType, sanitizeSearch, (req, res) => {
  let result = getTopics();
  const { subject, domain, type, ageMin, ageMax, q, limit, offset } = req.query;

  if (subject) result = result.filter((t) => t.subject === subject);
  if (domain) result = result.filter((t) => t.domain === domain);
  if (type) result = result.filter((t) => t.type === type);
  if (ageMin) result = result.filter((t) => t.ageRangeStart >= +ageMin);
  if (ageMax) result = result.filter((t) => t.ageRangeEnd <= +ageMax);
  if (q) {
    const lower = q.toLowerCase();
    result = result.filter(
      (t) => t.name?.toLowerCase().includes(lower) || t.description?.toLowerCase().includes(lower)
    );
  }

  const total = result.length;
  const off = Math.max(0, +(offset || 0));
  const lim = Math.min(Math.max(1, +(limit || 50)), 500);
  result = result.slice(off, off + lim);

  res.json({ total, offset: off, limit: lim, data: result });
});

// GET /api/topics/:id — single topic
router.get("/:id", validateTopicId, (req, res) => {
  const topic = getById().get(req.params.id);
  if (!topic) return res.status(404).json({ error: "Topic not found" });
  res.json(topic);
});

// GET /api/topics/:id/prereqs — prerequisites
router.get("/:id/prereqs", validateTopicId, (req, res) => {
  const byId = getById();
  const edges = getPrereqMap().get(req.params.id) || [];
  const result = edges.map((d) => ({
    ...byId.get(d.prerequisiteId),
    strength: d.strength,
    reason: d.reason,
  }));
  res.json(result);
});

// GET /api/topics/:id/unlocks — unlocked topics
router.get("/:id/unlocks", validateTopicId, (req, res) => {
  const byId = getById();
  const edges = getUnlockMap().get(req.params.id) || [];
  const result = edges.map((d) => ({
    ...byId.get(d.topicId),
    strength: d.strength,
    reason: d.reason,
  }));
  res.json(result);
});

// GET /api/topics/:id/path — learning path
router.get("/:id/path", validateTopicId, (req, res) => {
  const byId = getById();
  const prereqMap = getPrereqMap();
  const target = req.params.id;
  if (!byId.has(target)) return res.status(404).json({ error: "Topic not found" });

  const visited = new Set();
  const queue = [[target, [target]]];
  visited.add(target);

  while (queue.length > 0) {
    const [node, path] = queue.shift();
    const edges = prereqMap.get(node) || [];
    if (edges.length === 0) {
      return res.json(path.map((id) => byId.get(id)));
    }
    for (const d of edges) {
      if (!visited.has(d.prerequisiteId)) {
        visited.add(d.prerequisiteId);
        queue.push([d.prerequisiteId, [d.prerequisiteId, ...path]]);
      }
    }
  }
  res.json([byId.get(target)]);
});

export default router;
