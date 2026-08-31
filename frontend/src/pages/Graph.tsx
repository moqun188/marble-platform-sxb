import { useState, useEffect, useRef } from "react";
import cytoscape from "cytoscape";
import { getGraph, getTopicPath, type GraphData } from "../services/api";

const SUBJECTS = ["", "Science", "Mathematics", "English", "History", "Personal & Social Development", "Life Skills", "Computing", "Learning to Learn"];
const COLORS: Record<string, string> = {
  Science: "#4CAF50", Mathematics: "#2196F3", English: "#FF9800", History: "#9C27B0",
  "Personal & Social Development": "#E91E63", "Life Skills": "#00BCD4",
  Computing: "#607D8B", "Learning to Learn": "#795548",
};

export default function GraphPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<cytoscape.Core | null>(null);
  const [subject, setSubject] = useState("");
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ nodes: 0, edges: 0 });
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  useEffect(() => {
    loadGraph();
    return () => { cyRef.current?.destroy(); };
  }, [subject]);

  const loadGraph = async () => {
    setLoading(true);
    try {
      const data: GraphData = await getGraph(subject || undefined);
      setStats({ nodes: data.nodes.length, edges: data.edges.length });
      renderGraph(data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const renderGraph = (data: GraphData) => {
    if (cyRef.current) cyRef.current.destroy();
    if (!containerRef.current) return;

    const elements = [
      ...data.nodes.map(n => ({
        data: { id: n.id, label: n.label, subject: n.subject, age: `${n.ageStart}-${n.ageEnd}`, centrality: n.centrality },
      })),
      ...data.edges.map(e => ({
        data: { source: e.source, target: e.target, strength: e.strength },
      })),
    ];

    const cy = cytoscape({
      container: containerRef.current,
      elements,
      style: [
        {
          selector: "node",
          style: {
            label: "data(label)",
            "background-color": (el: cytoscape.NodeSingular) => COLORS[el.data("subject")] || "#999",
            width: (el: cytoscape.NodeSingular) => Math.max(8, (el.data("centrality") || 0) * 30 + 8),
            height: (el: cytoscape.NodeSingular) => Math.max(8, (el.data("centrality") || 0) * 30 + 8),
            "font-size": "8px",
            color: "#333",
            "text-valign": "bottom",
            "text-margin-y": 4,
          } as any,
        },
        {
          selector: "edge",
          style: {
            width: 1,
            "line-color": "#ccc",
            "target-arrow-color": "#ccc",
            "target-arrow-shape": "triangle",
            "curve-style": "bezier",
            "line-style": (el: cytoscape.EdgeSingular) => el.data("strength") === "soft" ? "dashed" : "solid",
          } as any,
        },
      ],
      layout: { name: "cose", animate: false, nodeRepulsion: () => 8000 } as any,
      minZoom: 0.1,
      maxZoom: 5,
    });

    cy.on("tap", "node", (evt) => {
      const nodeId = evt.target.id();
      setSelectedNode(nodeId);
      highlightPath(cy, nodeId);
    });

    cyRef.current = cy;
  };

  const highlightPath = async (cy: cytoscape.Core, nodeId: string) => {
    try {
      const path = await getTopicPath(nodeId);
      const pathIds = new Set(path.map(t => t.id));
      cy.elements().removeClass("highlighted dimmed");
      cy.elements().forEach(el => {
        if (el.isNode() && pathIds.has(el.id())) {
          el.addClass("highlighted");
        } else {
          el.addClass("dimmed");
        }
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Knowledge Graph</h2>
        <div className="flex items-center gap-3">
          <select value={subject} onChange={e => setSubject(e.target.value)}
            className="border rounded px-3 py-1.5 text-sm">
            <option value="">All Subjects</option>
            {SUBJECTS.filter(Boolean).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <span className="text-sm text-gray-500">{stats.nodes} nodes, {stats.edges} edges</span>
        </div>
      </div>

      {loading && <p className="text-gray-500">Loading graph...</p>}

      <div ref={containerRef}
        className="bg-white rounded-lg shadow"
        style={{ height: "calc(100vh - 220px)", minHeight: "500px" }} />

      {selectedNode && (
        <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-sm">
          <p className="text-sm"><strong>Selected:</strong> {selectedNode}</p>
          <p className="text-xs text-gray-500 mt-1">Path highlighted from entry</p>
        </div>
      )}
    </div>
  );
}