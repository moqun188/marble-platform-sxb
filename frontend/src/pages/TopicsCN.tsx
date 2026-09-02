import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { fetchTopics } from "../services/api";
import type { Topic } from "../types/topic";

const SUBJECTS = [
  { en: "Science", cn: "科学" }, { en: "Mathematics", cn: "数学" },
  { en: "English", cn: "英语" }, { en: "History", cn: "历史" },
  { en: "Personal & Social Development", cn: "社会情感" },
  { en: "Life Skills", cn: "生活技能" }, { en: "Computing", cn: "计算思维" },
  { en: "Learning to Learn", cn: "学会学习" },
];
const TYPES = [
  { en: "CONCEPTUAL", cn: "概念理解" }, { en: "PROCEDURAL", cn: "程序性" },
  { en: "REPRESENTATIONAL", cn: "表征" }, { en: "LANGUAGE", cn: "语言" },
  { en: "META", cn: "元认知" },
];
const COLORS: Record<string, string> = {
  Science: "#4CAF50", Mathematics: "#2196F3", English: "#FF9800", History: "#9C27B0",
  "Personal & Social Development": "#E91E63", "Life Skills": "#00BCD4",
  Computing: "#607D8B", "Learning to Learn": "#795548",
};
const SUBJECT_CN: Record<string, string> = {
  Science: "科学", Mathematics: "数学", English: "英语", History: "历史",
  "Personal & Social Development": "社会情感", "Life Skills": "生活技能",
  Computing: "计算思维", "Learning to Learn": "学会学习",
};

export default function TopicsCN() {
  const navigate = useNavigate();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ subject: "", type: "", search: "" });
  const [offset, setOffset] = useState(0);
  const limit = 20;

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetchTopics({ subject: filters.subject, type: filters.type, search: filters.search, limit, offset });
      setTopics(res.data);
      setTotal(res.total);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { load(); }, [offset, filters.subject, filters.type]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">知识点列表 <span className="text-base text-gray-400 font-normal">（共 {total} 个）</span></h2>
        <Link to="/graph" className="text-sm text-blue-600 hover:underline">查看知识图谱 →</Link>
      </div>

      <div className="flex flex-wrap gap-3 bg-white p-4 rounded-lg shadow">
        <select value={filters.subject} onChange={e => { setFilters(f => ({...f, subject: e.target.value})); setOffset(0); }}
          className="border rounded px-3 py-1.5 text-sm">
          <option value="">全部学科</option>
          {SUBJECTS.map(s => <option key={s.en} value={s.en}>{s.cn}</option>)}
        </select>
        <select value={filters.type} onChange={e => { setFilters(f => ({...f, type: e.target.value})); setOffset(0); }}
          className="border rounded px-3 py-1.5 text-sm">
          <option value="">全部类型</option>
          {TYPES.map(t => <option key={t.en} value={t.en}>{t.cn}</option>)}
        </select>
        <div className="flex gap-2 flex-1">
          <input type="text" placeholder="搜索知识点..." value={filters.search}
            onChange={e => setFilters(f => ({...f, search: e.target.value}))}
            onKeyDown={e => e.key === "Enter" && load()} className="border rounded px-3 py-1.5 text-sm flex-1" />
          <button onClick={load} className="bg-blue-600 text-white px-4 py-1.5 rounded text-sm hover:bg-blue-700">搜索</button>
        </div>
      </div>

      {loading ? <p className="text-gray-500 text-center py-8">加载中...</p> : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-4 py-2 text-gray-600">知识点名称</th>
                <th className="px-4 py-2 text-gray-600">学科</th>
                <th className="px-4 py-2 text-gray-600">领域</th>
                <th className="px-4 py-2 text-gray-600">类型</th>
                <th className="px-4 py-2 text-gray-600">年龄</th>
              </tr>
            </thead>
            <tbody>
              {topics.map(t => (
                <tr key={t.id} className="border-t hover:bg-blue-50 cursor-pointer transition-colors"
                  onClick={() => navigate(`/cn/topic/${t.id}`)}>
                  <td className="px-4 py-2.5 font-medium text-blue-700 hover:underline">{t.name}</td>
                  <td className="px-4 py-2.5">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{background: COLORS[t.subject] || "#999"}} />
                      <span className="text-gray-700">{SUBJECT_CN[t.subject] || t.subject}</span>
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-gray-600">{t.domain}</td>
                  <td className="px-4 py-2.5">
                    <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">{t.type}</span>
                  </td>
                  <td className="px-4 py-2.5 text-gray-600">{t.ageRangeStart}-{t.ageRangeEnd}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">第 {offset+1}-{Math.min(offset+limit, total)} 个，共 {total} 个</span>
        <div className="flex gap-2">
          <button disabled={offset === 0} onClick={() => setOffset(o => Math.max(0, o - limit))}
            className="px-3 py-1 border rounded text-sm disabled:opacity-50 hover:bg-gray-50">上一页</button>
          <button disabled={offset + limit >= total} onClick={() => setOffset(o => o + limit)}
            className="px-3 py-1 border rounded text-sm disabled:opacity-50 hover:bg-gray-50">下一页</button>
        </div>
      </div>
    </div>
  );
}
