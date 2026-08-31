import { Router } from "express";
import { getTopics, getDeps, getClusters, getStandards, getById } from "../services/data.js";

const router = Router();

// GET /api/health
router.get("/health", (req, res) => {
  res.json({ status: "ok", topics: getTopics().length, dependencies: getDeps().length });
});

// GET /api/subjects
router.get("/subjects", (req, res) => {
  const subjectMap = {};
  for (const t of getTopics()) {
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

// GET /api/domains
router.get("/domains", (req, res) => {
  const domainMap = {};
  for (const t of getTopics()) {
    const key = `${t.subject}::${t.domain}`;
    if (!domainMap[key]) domainMap[key] = { subject: t.subject, domain: t.domain, count: 0 };
    domainMap[key].count++;
  }
  res.json(Object.values(domainMap));
});

// GET /api/clusters
router.get("/clusters", (req, res) => {
  const { subject, domain } = req.query;
  let result = getClusters();
  if (subject) result = result.filter((c) => c.subject === subject);
  if (domain) result = result.filter((c) => c.domain === domain);
  res.json(result);
});

// GET /api/standards
router.get("/standards", (req, res) => {
  const { curriculum } = req.query;
  const standards = getStandards();
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

// GET /api/graph — full graph for visualization
router.get("/graph", (req, res) => {
  const { subject } = req.query;
  let filteredTopics = getTopics();
  if (subject) filteredTopics = filteredTopics.filter((t) => t.subject === subject);
  const topicIds = new Set(filteredTopics.map((t) => t.id));
  const filteredDeps = getDeps().filter((d) => topicIds.has(d.topicId) && topicIds.has(d.prerequisiteId));

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

export default router;

