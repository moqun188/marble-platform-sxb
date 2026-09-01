import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import cytoscape from "cytoscape";
import { fetchTopic, fetchPrereqs, fetchUnlocks, fetchPath } from "../services/api";
import type { Topic } from "../types/topic";

const COLORS: Record<string, string> = {
  Science: "#4CAF50", Mathematics: "#2196F3", English: "#FF9800", History: "#9C27B0",
  "Personal & Social Development": "#E91E63", "Life Skills": "#00BCD4",
  Computing: "#607D8B", "Learning to Learn": "#795548",
};

const TYPE_LABELS: Record<string, string> = {
  CONCEPTUAL: "Conceptual", PROCEDURAL: "Procedural",
  REPRESENTATIONAL: "Representational", LANGUAGE: "Language", META: "Meta",
};

export default function TopicDetail() {
  const { id } = useParams<{ id: string }>();
  const [topic, setTopic] = useState<Topic | null>(null);
  const [prereqs, setPrereqs] = useState<Topic[]>([]);
  const [unlocks, setUnlocks] = useState<Topic[]>([]);
  const [path, setPath] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const graphRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<cytoscape.Core | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    cyRef.current?.destroy();
    Promise.all([
      fetchTopic(id), fetchPrereqs(id), fetchUnlocks(id), fetchPath(id),
    ]).then(([t, p, u, pa]) => {
      setTopic(t); setPrereqs(p); setUnlocks(u); setPath(pa); setLoading(false);
      renderLocalGraph(t, p, u);
    }).catch((e) => { console.error(e); setLoading(false); });
    return () => { cyRef.current?.destroy(); };
  }, [id]);

  const renderLocalGraph = (t: Topic, p: Topic[], u: Topic[]) => {
    if (!graphRef.current || (p.length === 0 && u.length === 0)) return;
    cyRef.current?.destroy();
    const nodes = [
      { data: { id: t.id, label: t.name || "", subject: t.subject, isCenter: true } },
      ...p.map((pr) => ({ data: { id: pr.id, label: pr.name || "", subject: pr.subject, isCenter: false } })),
      ...u.map((un) => ({ data: { id: un.id, label: un.name || "", subject: un.subject, isCenter: false } })),
    ];
    const edges = [
      ...p.map((pr) => ({ data: { source: pr.id, target: t.id, strength: "hard" } })),
      ...u.map((un) => ({ data: { source: t.id, target: un.id, strength: "hard" } })),
    ];
    cyRef.current = cytoscape({
      container: graphRef.current,
      elements: [...nodes, ...edges],
      style: [
        { selector: "node", style: {
          label: "data(label)",
          "background-color": (el: cytoscape.NodeSingular) => COLORS[el.data("subject")] || "#999",
          width: (el: cytoscape.NodeSingular) => el.data("isCenter") ? 30 : 18,
          height: (el: cytoscape.NodeSingular) => el.data("isCenter") ? 30 : 18,
          "font-size": "9px", color: "#333", "text-valign": "bottom", "text-margin-y": 4,
          "border-width": (el: cytoscape.NodeSingular) => el.data("isCenter") ? 3 : 0, "border-color": "#333",
        } as cytoscape.Css.Node },
        { selector: "edge", style: {
          width: 2, "line-color": "#aaa", "target-arrow-color": "#aaa",
          "target-arrow-shape": "triangle", "curve-style": "bezier",
        } as cytoscape.Css.Edge },
      ],
      layout: { name: "breadthfirst", directed: true, spacingFactor: 1.5 },
      userZoomingEnabled: true, userPanningEnabled: true,
    });
  };

  if (loading) return <p className="text-gray-500 py-8">Loading topic...</p>;
  if (!topic) return <p className="text-red-500 py-8">Topic not found</p>;
  const subjectColor = COLORS[topic.subject] || "#999";

  return (
    <div className="space-y-6">
      <nav className="text-sm text-gray-500 flex items-center gap-2">
        <Link to="/topics" className="hover:text-blue-600">Topics</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">{topic.name}</span>
      </nav>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="w-3 h-3 rounded-full" style={{ background: subjectColor }} />
              <span className="text-sm text-gray-500">{topic.subject}</span>
              {topic.domain && <span className="text-sm text-gray-400">/ {topic.domain}</span>}
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">{topic.name}</h1>
            <p className="text-gray-700 leading-relaxed">{topic.description}</p>
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0">
            <span className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">{topic.id}</span>
            {topic.type && (
              <span className="text-xs px-2 py-1 rounded" style={{ background: subjectColor + "20", color: subjectColor }}>
                {TYPE_LABELS[topic.type] || topic.type}
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t text-sm">
          {topic.ageRangeStart != null && (
            <div><span className="text-gray-500">Age:</span> <span className="font-medium">{topic.ageRangeStart}–{topic.ageRangeEnd}</span></div>
          )}
          {topic.centrality != null && (
            <div><span className="text-gray-500">Centrality:</span> <span className="font-medium">{topic.centrality.toFixed(3)}</span></div>
          )}
          {topic.standards && (
            <div><span className="text-gray-500">Standards:</span> <span className="font-medium">{topic.standards.length}</span></div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {topic.evidence && topic.evidence.length > 0 && (
          <div className="bg-white rounded-lg shadow p-5">
            <h3 className="font-semibold text-gray-900 mb-3">Evidence of Mastery</h3>
            <ul className="space-y-2">
              {topic.evidence.map((e, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-green-500 mt-0.5">✓</span>{e}
                </li>
              ))}
            </ul>
          </div>
        )}
        {topic.assessmentPrompt && (
          <div className="bg-white rounded-lg shadow p-5">
            <h3 className="font-semibold text-gray-900 mb-3">Assessment Prompt</h3>
            <p className="text-sm text-gray-700 leading-relaxed italic">"{topic.assessmentPrompt.replace(/\{\{name\}\}/g, "the child")}"</p>
          </div>
        )}
      </div>

      {path.length > 1 && (
        <div className="bg-white rounded-lg shadow p-5">
          <h3 className="font-semibold text-gray-900 mb-3">Learning Path ({path.length} steps)</h3>
          <div className="flex flex-wrap items-center gap-2">
            {path.map((p, i) => (
              <span key={p.id} className="flex items-center gap-1">
                <Link to={`/topic/${p.id}`}
                  className={`text-xs px-2 py-1 rounded ${p.id === id ? "bg-blue-600 text-white font-medium" : "bg-gray-100 hover:bg-gray-200 text-gray-700"}`}>
                  {p.name}
                </Link>
                {i < path.length - 1 && <span className="text-gray-400">→</span>}
              </span>
            ))}
          </div>
        </div>
      )}

      {(prereqs.length > 0 || unlocks.length > 0) && (
        <div className="bg-white rounded-lg shadow p-5">
          <h3 className="font-semibold text-gray-900 mb-3">Dependency Graph</h3>
          <div ref={graphRef} className="bg-gray-50 rounded" style={{ height: "300px" }} />
        </div>
      )}

      {prereqs.length > 0 && (
        <div className="bg-white rounded-lg shadow p-5">
          <h3 className="font-semibold text-gray-900 mb-3">Prerequisites ({prereqs.length})</h3>
          <div className="space-y-2">
            {prereqs.map((p) => (
              <Link key={p.id} to={`/topic/${p.id}`} className="flex items-center gap-3 p-3 rounded hover:bg-gray-50 border">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: COLORS[p.subject] || "#999" }} />
                <div className="min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">{p.name}</div>
                  <div className="text-xs text-gray-500">{p.subject} / {p.domain}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {unlocks.length > 0 && (
        <div className="bg-white rounded-lg shadow p-5">
          <h3 className="font-semibold text-gray-900 mb-3">Unlocks ({unlocks.length})</h3>
          <div className="space-y-2">
            {unlocks.map((u) => (
              <Link key={u.id} to={`/topic/${u.id}`} className="flex items-center gap-3 p-3 rounded hover:bg-gray-50 border">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: COLORS[u.subject] || "#999" }} />
                <div className="min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">{u.name}</div>
                  <div className="text-xs text-gray-500">{u.subject} / {u.domain}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {topic.standards && topic.standards.length > 0 && (
        <div className="bg-white rounded-lg shadow p-5">
          <h3 className="font-semibold text-gray-900 mb-3">Curriculum Standards ({topic.standards.length})</h3>
          <div className="flex flex-wrap gap-2">
            {topic.standards.map((s) => <span key={s} className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">{s}</span>)}
          </div>
        </div>
      )}
    </div>
  );
}
