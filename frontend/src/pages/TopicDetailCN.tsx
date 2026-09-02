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

const SUBJECT_CN: Record<string, string> = {
  Science: "科学", Mathematics: "数学", English: "英语", History: "历史",
  "Personal & Social Development": "社会情感发展", "Life Skills": "生活技能",
  Computing: "计算思维", "Learning to Learn": "学会学习",
};

const TYPE_CN: Record<string, string> = {
  CONCEPTUAL: "概念理解", PROCEDURAL: "程序性知识",
  REPRESENTATIONAL: "表征能力", LANGUAGE: "语言能力", META: "元认知",
};

const DOMAIN_CN: Record<string, string> = {
  "Grammar & Punctuation": "语法与标点", "Phonics & Word Reading": "拼读与词汇阅读",
  "Reading Comprehension": "阅读理解", "Writing Composition": "写作",
  "Speaking & Listening": "口语与听力", "Vocabulary": "词汇",
  "Spelling & Word Study": "拼写与词汇学习", "Handwriting & Transcription": "书写",
  "English Thinking": "英语思维",
  "Addition & Subtraction": "加减法", "Multiplication & Division": "乘除法",
  "Fractions": "分数", "Geometry": "几何", "Measurement": "测量",
  "Counting & Cardinality": "计数与基数", "Number Representation & Place Value": "数位与位值",
  "Algebra": "代数", "Data & Statistics": "数据与统计",
  "Mathematical Thinking": "数学思维", "Probability": "概率",
  "Ratio & Proportion": "比例",
  "Animals of the World": "世界动物", "Dinosaurs & Paleontology": "恐龙与古生物",
  "Earth's Systems": "地球系统", "Ecosystems & Habitats": "生态系统与栖息地",
  "Energy": "能量", "Forces & Motion": "力与运动",
  "Insects & Minibeasts": "昆虫与小生物", "Matter & Materials": "物质与材料",
  "Ocean Life": "海洋生物", "Organisms & Life Processes": "生物与生命过程",
  "Polar Regions": "极地", "Rainforests": "雨林",
  "Scientific Inquiry": "科学探究", "Space Exploration": "太空探索",
  "Space Systems & Earth's History": "太空系统与地球历史",
  "The Human Body": "人体", "Volcanoes & Earthquakes": "火山与地震",
  "Waves, Light & Sound": "波、光与声", "Weather & Climate": "天气与气候",
  "Ancient Egypt": "古埃及", "Ancient Greece & Rome": "古希腊与罗马",
  "Historical Thinking": "历史思维", "Medieval Times": "中世纪",
  "Emotional Literacy": "情绪素养", "Empathy & Social Awareness": "同理心与社会意识",
  "Friendship & Cooperation": "友谊与合作", "Responsible Decision-Making": "负责任决策",
  "Self-Awareness": "自我认知", "Self-Regulation & Resilience": "自我调节与韧性",
  "Entrepreneurship": "创业思维", "Money & Finance": "理财",
  "Artificial Intelligence": "人工智能",
  "Learning to Learn": "学会学习",
};

export default function TopicDetailCN() {
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
      ...p.map((pr) => ({ data: { source: pr.id, target: t.id } })),
      ...u.map((un) => ({ data: { source: t.id, target: un.id } })),
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
    });
  };

  if (loading) return <p className="text-gray-500 py-8 text-center">加载中...</p>;
  if (!topic) return <p className="text-red-500 py-8 text-center">未找到该知识点</p>;
  const subjectColor = COLORS[topic.subject] || "#999";
  const subjectCn = SUBJECT_CN[topic.subject] || topic.subject;
  const domainCn = DOMAIN_CN[topic.domain || ""] || topic.domain || "";
  const typeCn = TYPE_CN[topic.type || ""] || topic.type || "";

  return (
    <div className="space-y-6">
      {/* 面包屑 */}
      <nav className="text-sm text-gray-500 flex items-center gap-2">
        <Link to="/topics" className="hover:text-blue-600">知识点列表</Link>
        <span>/</span>
        <span className="text-gray-400">{subjectCn}</span>
        {domainCn && <><span>/</span><span className="text-gray-400">{domainCn}</span></>}
        <span>/</span>
        <span className="text-gray-900 font-medium">{topic.name}</span>
      </nav>

      {/* 主信息卡片 */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="w-3 h-3 rounded-full" style={{ background: subjectColor }} />
              <span className="text-sm font-medium" style={{ color: subjectColor }}>{subjectCn}</span>
              {domainCn && <span className="text-sm text-gray-400">· {domainCn}</span>}
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">{topic.name}</h1>
            <p className="text-gray-700 leading-relaxed text-base">{topic.description}</p>
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0">
            <span className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">{topic.id}</span>
            <span className="text-xs px-2 py-1 rounded font-medium" style={{ background: subjectColor + "20", color: subjectColor }}>
              {typeCn}
            </span>
          </div>
        </div>

        {/* 元数据 */}
        <div className="flex flex-wrap gap-6 mt-5 pt-4 border-t text-sm">
          {topic.ageRangeStart != null && (
            <div>
              <span className="text-gray-500">适用年龄</span>
              <span className="ml-2 font-semibold text-gray-900">{topic.ageRangeStart}–{topic.ageRangeEnd} 岁</span>
            </div>
          )}
          {topic.centrality != null && (
            <div>
              <span className="text-gray-500">核心度</span>
              <span className="ml-2 font-semibold text-gray-900">{(topic.centrality * 100).toFixed(1)}%</span>
              <span className="ml-1 text-xs text-gray-400">（越高越基础）</span>
            </div>
          )}
          {topic.standards && (
            <div>
              <span className="text-gray-500">课标映射</span>
              <span className="ml-2 font-semibold text-gray-900">{topic.standards.length} 条</span>
            </div>
          )}
        </div>
      </div>

      {/* 掌握证据 & 评估提示 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {topic.evidence && topic.evidence.length > 0 && (
          <div className="bg-white rounded-lg shadow p-5">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <span className="text-green-500">✓</span> 掌握证据
            </h3>
            <ul className="space-y-2">
              {topic.evidence.map((e, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-green-400 mt-0.5 shrink-0">●</span>
                  <span>{e}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {topic.assessmentPrompt && (
          <div className="bg-white rounded-lg shadow p-5">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <span className="text-blue-500">?</span> 评估方法
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed bg-blue-50 rounded p-3 border-l-4 border-blue-300">
              {topic.assessmentPrompt.replace(/\{\{name\}\}/g, "孩子")}
            </p>
          </div>
        )}
      </div>

      {/* 学习路径 */}
      {path.length > 1 && (
        <div className="bg-white rounded-lg shadow p-5">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <span className="text-purple-500">→</span> 学习路径
            <span className="text-xs text-gray-400 font-normal">（共 {path.length} 步，从基础到当前）</span>
          </h3>
          <div className="flex flex-wrap items-center gap-1">
            {path.map((p, i) => (
              <span key={p.id} className="flex items-center gap-1">
                <Link to={`/topic/${p.id}`}
                  className={`text-xs px-2 py-1 rounded transition-colors ${p.id === id
                    ? "bg-blue-600 text-white font-medium shadow"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"}`}>
                  {p.name}
                </Link>
                {i < path.length - 1 && <span className="text-gray-300 text-sm">→</span>}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 依赖图 */}
      {(prereqs.length > 0 || unlocks.length > 0) && (
        <div className="bg-white rounded-lg shadow p-5">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <span className="text-orange-500">◈</span> 知识依赖关系
          </h3>
          <div className="flex gap-6 mb-3 text-xs text-gray-500">
            <span>⬆ 前置知识 ({prereqs.length})</span>
            <span className="border-l pl-6">⬇ 后续知识 ({unlocks.length})</span>
          </div>
          <div ref={graphRef} className="bg-gray-50 rounded border" style={{ height: "300px" }} />
        </div>
      )}

      {/* 前置知识 */}
      {prereqs.length > 0 && (
        <div className="bg-white rounded-lg shadow p-5">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <span className="text-red-500">⬆</span> 前置知识
            <span className="text-xs text-gray-400 font-normal">（学习当前知识点之前需要先掌握）</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {prereqs.map((p) => (
              <Link key={p.id} to={`/topic/${p.id}`}
                className="flex items-center gap-3 p-3 rounded hover:bg-gray-50 border transition-colors">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: COLORS[p.subject] || "#999" }} />
                <div className="min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">{p.name}</div>
                  <div className="text-xs text-gray-500">{SUBJECT_CN[p.subject] || p.subject}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 后续知识 */}
      {unlocks.length > 0 && (
        <div className="bg-white rounded-lg shadow p-5">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <span className="text-green-500">⬇</span> 后续知识
            <span className="text-xs text-gray-400 font-normal">（掌握当前知识点后可以继续学习）</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {unlocks.map((u) => (
              <Link key={u.id} to={`/topic/${u.id}`}
                className="flex items-center gap-3 p-3 rounded hover:bg-gray-50 border transition-colors">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: COLORS[u.subject] || "#999" }} />
                <div className="min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">{u.name}</div>
                  <div className="text-xs text-gray-500">{SUBJECT_CN[u.subject] || u.subject}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 课标映射 */}
      {topic.standards && topic.standards.length > 0 && (
        <div className="bg-white rounded-lg shadow p-5">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <span className="text-indigo-500">📐</span> 课标映射
          </h3>
          <div className="flex flex-wrap gap-2">
            {topic.standards.map((s) => {
              const [curriculum] = s.split(":");
              const badgeColor = curriculum === "ccss-math" ? "bg-blue-100 text-blue-700"
                : curriculum === "ccss-ela" ? "bg-orange-100 text-orange-700"
                : curriculum === "ngss-k5" || curriculum === "ngss-ms" ? "bg-green-100 text-green-700"
                : curriculum === "uk-nc-2013" ? "bg-purple-100 text-purple-700"
                : "bg-gray-100 text-gray-700";
              return <span key={s} className={`text-xs px-2 py-1 rounded font-mono ${badgeColor}`}>{s}</span>;
            })}
          </div>
        </div>
      )}
    </div>
  );
}
