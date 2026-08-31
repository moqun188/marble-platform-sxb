import express from "express";
import cors from "cors";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3200;

app.use(cors());
app.use(express.json());

// --- Load Marble Data ---
const dataDir = join(__dirname, "../marble-data/data");
const topics = JSON.parse(readFileSync(join(dataDir, "topics.json"), "utf-8")).topics;
const deps = JSON.parse(readFileSync(join(dataDir, "dependencies.json"), "utf-8")).dependencies;
const clusters = JSON.parse(readFileSync(join(dataDir, "clusters.json"), "utf-8")).clusters;
const standards = JSON.parse(readFileSync(join(dataDir, "curriculum-standards.json"), "utf-8"));

// Build indexes
const byId = new Map(topics.map((t) => [t.id, t]));
const prereqMap = new Map();
const unlockMap = new Map();
for (const d of deps) {
  if (!prereqMap.has(d.topicId)) prereqMap.set(d.topicId, []);
  prereqMap.get(d.topicId).push(d);
  if (!unlockMap.has(d.prerequisiteId)) unlockMap.set(d.prerequisiteId, []);
  unlockMap.get(d.prerequisiteId).push(d);
}

// --- Routes ---

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", topics: topics.length, dependencies: deps.length });
});

// Topics list with filtering
app.get("/api/topics", (req, res) => {
  let result = topics;
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
  const off = +(offset || 0);
  const lim = +(limit || 50);
  result = result.slice(off, off + lim);
  res.json({ total, offset: off, limit: lim, data: result });
});

// Topic detail
app.get("/api/topics/:id", (req, res) => {
  const topic = byId.get(req.params.id);
  if (!topic) return res.status(404).json({ error: "Topic not found" });
  res.json(topic);
});

// Prerequisites of a topic
app.get("/api/topics/:id/prereqs", (req, res) => {
  const edges = prereqMap.get(req.params.id) || [];
  const result = edges.map((d) => ({
    ...byId.get(d.prerequisiteId),
    strength: d.strength,
    reason: d.reason,
  }));
  res.json(result);
});

// Topics unlocked by a topic
app.get("/api/topics/:id/unlocks", (req, res) => {
  const edges = unlockMap.get(req.params.id) || [];
  const result = edges.map((d) => ({
    ...byId.get(d.topicId),
    strength: d.strength,
    reason: d.reason,
  }));
  res.json(result);
});

// Learning path from entry to target (BFS)
app.get("/api/topics/:id/path", (req, res) => {
  const target = req.params.id;
  if (!byId.has(target)) return res.status(404).json({ error: "Topic not found" });

  // BFS backwards from target to find shortest path from an entry node
  const visited = new Set();
  const queue = [[target, [target]]];
  visited.add(target);
  while (queue.length > 0) {
    const [node, path] = queue.shift();
    const edges = prereqMap.get(node) || [];
    if (edges.length === 0) {
      // This is an entry node
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

// Subjects
app.get("/api/subjects", (req, res) => {
  const subjectMap = {};
  for (const t of topics) {
    if (!subjectMap[t.subject]) subjectMap[t.subject] = { count: 0, domains: new Set() };
    subjectMap[t.subject].count++;
    if (t.domain) subjectMap[t.subject].domains.add(t.domain);
  }
  const result = Object.entries(subjectMap).map(([name, data]) => ({
    name,
    count: data.count,
    domains: [...data.domains],
  }));
  res.json(result);
});

// Domains
app.get("/api/domains", (req, res) => {
  const domainMap = {};
  for (const t of topics) {
    const key = `${t.subject}::${t.domain}`;
    if (!domainMap[key]) domainMap[key] = { subject: t.subject, domain: t.domain, count: 0 };
    domainMap[key].count++;
  }
  res.json(Object.values(domainMap));
});

// Clusters
app.get("/api/clusters", (req, res) => {
  const { subject, domain } = req.query;
  let result = clusters;
  if (subject) result = result.filter((c) => c.subject === subject);
  if (domain) result = result.filter((c) => c.domain === domain);
  res.json(result);
});

// Standards
app.get("/api/standards", (req, res) => {
  const { curriculum } = req.query;
  if (curriculum) {
    const found = standards.curricula.find((c) => c.slug === curriculum);
    return res.json(found || null);
  }
  res.json({
    curricula: standards.curricula.map((c) => ({
      slug: c.slug,
      name: c.name,
      country: c.country,
      standardCount: c.standards?.length || 0,
    })),
  });
});

// Full graph (for visualization)
app.get("/api/graph", (req, res) => {
  const { subject } = req.query;
  let filteredTopics = topics;
  if (subject) filteredTopics = topics.filter((t) => t.subject === subject);
  const topicIds = new Set(filteredTopics.map((t) => t.id));
  const filteredDeps = deps.filter((d) => topicIds.has(d.topicId) && topicIds.has(d.prerequisiteId));
  res.json({
    nodes: filteredTopics.map((t) => ({
      id: t.id,
      label: t.name,
      subject: t.subject,
      domain: t.domain,
      ageStart: t.ageRangeStart,
      ageEnd: t.ageRangeEnd,
      type: t.type,
      centrality: t.centrality,
    })),
    edges: filteredDeps.map((d) => ({
      source: d.prerequisiteId,
      target: d.topicId,
      strength: d.strength,
      reason: d.reason,
    })),
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Marble API running on port ${PORT}`);
});

