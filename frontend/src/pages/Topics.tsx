import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchTopics } from "../services/api";
import type { Topic } from "../types/topic";

const SUBJECTS = ["Science", "Mathematics", "English", "History", "Personal & Social Development", "Life Skills", "Computing", "Learning to Learn"];
const TYPES = ["CONCEPTUAL", "PROCEDURAL", "REPRESENTATIONAL", "LANGUAGE", "META"];
const COLORS: Record<string, string> = {
  Science: "#4CAF50", Mathematics: "#2196F3", English: "#FF9800", History: "#9C27B0",
  "Personal & Social Development": "#E91E63", "Life Skills": "#00BCD4",
  Computing: "#607D8B", "Learning to Learn": "#795548",
};

export default function TopicsPage() {
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
      <h2 className="text-2xl font-bold">Topics ({total})</h2>
      <div className="flex flex-wrap gap-3 bg-white p-4 rounded-lg shadow">
        <select value={filters.subject} onChange={e => { setFilters(f => ({...f, subject: e.target.value})); setOffset(0); }}
          className="border rounded px-3 py-1.5 text-sm">
          <option value="">All Subjects</option>
          {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={filters.type} onChange={e => { setFilters(f => ({...f, type: e.target.value})); setOffset(0); }}
          className="border rounded px-3 py-1.5 text-sm">
          <option value="">All Types</option>
          {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <div className="flex gap-2 flex-1">
          <input type="text" placeholder="Search..." value={filters.search}
            onChange={e => setFilters(f => ({...f, search: e.target.value}))}
            onKeyDown={e => e.key === "Enter" && load()} className="border rounded px-3 py-1.5 text-sm flex-1" />
          <button onClick={load} className="bg-blue-600 text-white px-4 py-1.5 rounded text-sm hover:bg-blue-700">Search</button>
        </div>
      </div>
      {loading ? <p className="text-gray-500">Loading...</p> : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-left">
              <tr><th className="px-4 py-2">Name</th><th className="px-4 py-2">Subject</th><th className="px-4 py-2">Domain</th><th className="px-4 py-2">Type</th><th className="px-4 py-2">Age</th></tr>
            </thead>
            <tbody>
              {topics.map(t => (
                <tr key={t.id} className="border-t hover:bg-blue-50 cursor-pointer" onClick={() => navigate(`/topic/${t.id}`)}>
                  <td className="px-4 py-2 font-medium text-blue-700 hover:underline">{t.name}</td>
                  <td className="px-4 py-2">
                    <span className="inline-block w-2 h-2 rounded-full mr-1" style={{background: COLORS[t.subject] || "#999"}} />{t.subject}
                  </td>
                  <td className="px-4 py-2 text-gray-600">{t.domain}</td>
                  <td className="px-4 py-2"><span className="text-xs bg-gray-100 px-2 py-0.5 rounded">{t.type}</span></td>
                  <td className="px-4 py-2 text-gray-600">{t.ageRangeStart}-{t.ageRangeEnd}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">Showing {offset+1}-{Math.min(offset+limit, total)} of {total}</span>
        <div className="flex gap-2">
          <button disabled={offset === 0} onClick={() => setOffset(o => Math.max(0, o - limit))} className="px-3 py-1 border rounded text-sm disabled:opacity-50">Previous</button>
          <button disabled={offset + limit >= total} onClick={() => setOffset(o => o + limit)} className="px-3 py-1 border rounded text-sm disabled:opacity-50">Next</button>
        </div>
      </div>
    </div>
  );
}
