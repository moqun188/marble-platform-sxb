import { useState, useEffect, useRef, useCallback } from "react";
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

const ROW_HEIGHT = 48;
const OVERSCAN = 10;

export default function TopicsPage() {
  const navigate = useNavigate();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ subject: "", type: "", search: "" });
  const [offset, setOffset] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const limit = 200;

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

  const handleScroll = useCallback(() => {
    if (containerRef.current) setScrollTop(containerRef.current.scrollTop);
  }, []);

  const containerHeight = 600;
  const totalHeight = topics.length * ROW_HEIGHT;
  const startIdx = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - OVERSCAN);
  const endIdx = Math.min(topics.length, Math.ceil((scrollTop + containerHeight) / ROW_HEIGHT) + OVERSCAN);
  const visibleTopics = topics.slice(startIdx, endIdx);
  const offsetY = startIdx * ROW_HEIGHT;

  return (
    <div className="space-y-4">
      <h2 className="text-xl sm:text-2xl font-bold">Topics ({total})</h2>

      {/* Filters — stack on mobile */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 bg-white p-3 sm:p-4 rounded-lg shadow">
        <select value={filters.subject} onChange={e => { setFilters(f => ({...f, subject: e.target.value})); setOffset(0); }}
          className="border rounded px-3 py-2 text-sm">
          <option value="">All Subjects</option>
          {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={filters.type} onChange={e => { setFilters(f => ({...f, type: e.target.value})); setOffset(0); }}
          className="border rounded px-3 py-2 text-sm">
          <option value="">All Types</option>
          {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <div className="flex gap-2 flex-1">
          <input type="text" placeholder="Search..." value={filters.search}
            onChange={e => setFilters(f => ({...f, search: e.target.value}))}
            onKeyDown={e => e.key === "Enter" && load()} className="border rounded px-3 py-2 text-sm flex-1" />
          <button onClick={load} className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 shrink-0">
            Search
          </button>
        </div>
      </div>

      {loading ? <p className="text-gray-500">Loading...</p> : (
        <>
          {/* Desktop table (hidden on small screens) */}
          <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-left sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-2 w-[40%]">Name</th>
                  <th className="px-4 py-2 w-[20%]">Subject</th>
                  <th className="px-4 py-2 w-[20%]">Domain</th>
                  <th className="px-4 py-2 w-[10%]">Type</th>
                  <th className="px-4 py-2 w-[10%]">Age</th>
                </tr>
              </thead>
            </table>
            <div ref={containerRef} onScroll={handleScroll} style={{ height: containerHeight, overflow: "auto" }}>
              <div style={{ height: totalHeight, position: "relative" }}>
                <div style={{ position: "absolute", top: offsetY, width: "100%" }}>
                  <table className="w-full text-sm">
                    <tbody>
                      {visibleTopics.map((t) => (
                        <tr key={t.id} className="border-t hover:bg-blue-50 cursor-pointer transition-colors"
                          style={{ height: ROW_HEIGHT }} onClick={() => navigate(`/topic/${t.id}`)}>
                          <td className="px-4 py-2 font-medium text-blue-700 hover:underline w-[40%]">{t.name}</td>
                          <td className="px-4 py-2 w-[20%]">
                            <span className="inline-flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full shrink-0" style={{background: COLORS[t.subject] || "#999"}} />
                              {t.subject}
                            </span>
                          </td>
                          <td className="px-4 py-2 text-gray-600 w-[20%] truncate">{t.domain}</td>
                          <td className="px-4 py-2 w-[10%]"><span className="text-xs bg-gray-100 px-2 py-0.5 rounded">{t.type}</span></td>
                          <td className="px-4 py-2 text-gray-600 w-[10%]">{t.ageRangeStart}-{t.ageRangeEnd}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile card list (visible on small screens) */}
          <div className="md:hidden space-y-2">
            {topics.map((t) => (
              <div key={t.id} onClick={() => navigate(`/topic/${t.id}`)}
                className="bg-white rounded-lg shadow p-3 active:bg-blue-50 cursor-pointer">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-blue-700 text-sm truncate">{t.name}</div>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{background: COLORS[t.subject] || "#999"}} />
                      <span className="text-xs text-gray-500">{t.subject}</span>
                      {t.domain && <span className="text-xs text-gray-400">· {t.domain}</span>}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">{t.type}</span>
                    <span className="text-xs text-gray-400">{t.ageRangeStart}-{t.ageRangeEnd}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
        <span className="text-sm text-gray-500">
          {total > 0 ? `${offset+1}-${Math.min(offset+limit, total)} of ${total}` : "No results"}
        </span>
        <div className="flex gap-2">
          <button disabled={offset === 0} onClick={() => { setOffset(o => Math.max(0, o - limit)); setTopics([]); }}
            className="px-3 py-1.5 border rounded text-sm disabled:opacity-50 hover:bg-gray-50">Previous</button>
          <button disabled={offset + limit >= total} onClick={() => { setOffset(o => o + limit); setTopics([]); }}
            className="px-3 py-1.5 border rounded text-sm disabled:opacity-50 hover:bg-gray-50">Next</button>
        </div>
      </div>
    </div>
  );
}
