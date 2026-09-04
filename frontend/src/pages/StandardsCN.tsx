import { useState, useEffect } from "react";
import { fetchStandards } from "../services/api";

interface Curriculum {
  slug: string;
  name: string;
  country: string;
  version?: string;
  textIncluded?: boolean;
  license?: string;
  topicCount?: number;
  topics?: Array<{
    key: string;
    code: string;
    data: Record<string, string>;
  }>;
}

const CURRICULUM_INFO: Record<string, { color: string; icon: string; cn: string }> = {
  "uk-nc-2013": { color: "#7C3AED", icon: "🇬🇧", cn: "英国国家课程" },
  "ccss-ela": { color: "#EA580C", icon: "📖", cn: "美国共同核心·英语" },
  "ccss-math": { color: "#2563EB", icon: "🔢", cn: "美国共同核心·数学" },
  "ngss-k5": { color: "#16A34A", icon: "🔬", cn: "新一代科学标准 K-5" },
  "ngss-ms": { color: "#059669", icon: "🧪", cn: "新一代科学标准·初中" },
  "ib-pyp-pspe": { color: "#DB2777", icon: "🌍", cn: "IB PYP 个人社会体育" },
  "c3-social-studies": { color: "#9333EA", icon: "🏛️", cn: "C3 社会研究框架" },
};

export default function StandardsCN() {
  const [curricula, setCurricula] = useState<Curriculum[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [detail, setDetail] = useState<Curriculum | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchStandards()
      .then((d) => { setCurricula(d.curricula || []); setLoading(false); })
      .catch((e) => { console.error(e); setLoading(false); });
  }, []);

  const loadDetail = async (slug: string) => {
    if (selected === slug) { setSelected(null); setDetail(null); return; }
    setSelected(slug);
    setDetailLoading(true);
    try { setDetail(await fetchStandards(slug)); } catch (e) { console.error(e); }
    setDetailLoading(false);
  };

  const filteredTopics = detail?.topics?.filter((t) => {
    if (!search) return true;
    const lower = search.toLowerCase();
    return t.code?.toLowerCase().includes(lower) || t.data?.title?.toLowerCase().includes(lower) || t.data?.description?.toLowerCase().includes(lower);
  }) || [];

  if (loading) return <p className="text-gray-500 text-center py-8">加载中...</p>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">课程标准体系</h2>
        <p className="text-gray-500 mt-1">7 套国际课程标准，映射到 1,590 个微主题</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {curricula.map((c) => {
          const info = CURRICULUM_INFO[c.slug] || { color: "#6B7280", icon: "📐", cn: c.slug };
          const isSelected = selected === c.slug;
          return (
            <button key={c.slug} onClick={() => loadDetail(c.slug)}
              className={`text-left p-4 rounded-lg border-2 transition-all hover:shadow-md ${
                isSelected ? "border-blue-500 shadow-md bg-blue-50" : "border-gray-200 bg-white hover:border-gray-300"
              }`}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{info.icon}</span>
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: info.color + "20", color: info.color }}>{c.country}</span>
              </div>
              <h3 className="font-semibold text-gray-900 text-sm">{info.cn}</h3>
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{c.name}</p>
            </button>
          );
        })}
      </div>

      {selected && (
        <div className="bg-white rounded-lg shadow p-5">
          {detailLoading ? <p className="text-gray-500">加载中...</p> : detail ? (
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{detail.name}</h3>
                  <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                    <span>{detail.country}</span>
                    {detail.version && <span>v{detail.version}</span>}
                    {detail.textIncluded !== undefined && (
                      <span className={`px-2 py-0.5 rounded text-xs ${detail.textIncluded ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                        {detail.textIncluded ? "全文" : "仅代码"}
                      </span>
                    )}
                  </div>
                </div>
                <button onClick={() => { setSelected(null); setDetail(null); }} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
              </div>

              {detail.topics && detail.topics.length > 0 && (
                <>
                  <div className="flex gap-2">
                    <input type="text" placeholder={`搜索 ${detail.topics.length} 条标准...`}
                      value={search} onChange={e => setSearch(e.target.value)}
                      className="border rounded px-3 py-1.5 text-sm flex-1" />
                    <span className="text-sm text-gray-500 self-center">{filteredTopics.length} 条</span>
                  </div>

                  <div className="max-h-96 overflow-auto space-y-1">
                    {filteredTopics.slice(0, 100).map((t) => (
                      <div key={t.key} className="flex items-start gap-3 p-2 rounded hover:bg-gray-50 text-sm">
                        <span className="font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded shrink-0">{t.code}</span>
                        <div className="min-w-0">
                          <div className="font-medium text-gray-900">{t.data?.title || t.code}</div>
                          {t.data?.description && <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{t.data.description}</p>}
                          <div className="flex flex-wrap gap-2 mt-1">
                            {t.data?.gradeLevel && <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">年级 {t.data.gradeLevel}</span>}
                            {t.data?.domain && <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{t.data.domain}</span>}
                            {t.data?.keyStage && <span className="text-xs bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded">{t.data.keyStage}</span>}
                            {t.data?.year && <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">{t.data.year}</span>}
                          </div>
                        </div>
                      </div>
                    ))}
                    {filteredTopics.length > 100 && <p className="text-center text-sm text-gray-400 py-2">显示前 100 条，共 {filteredTopics.length} 条</p>}
                  </div>
                </>
              )}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
