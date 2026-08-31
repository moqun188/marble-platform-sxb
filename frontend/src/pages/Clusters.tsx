import { useState, useEffect } from "react";
import { getClusters, type Cluster } from "../services/api";

const SUBJECTS = ["", "Science", "Mathematics", "English", "History", "Personal & Social Development", "Life Skills", "Computing", "Learning to Learn"];

export default function ClustersPage() {
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [subject, setSubject] = useState("");

  useEffect(() => {
    getClusters(subject || undefined).then(setClusters).catch(console.error);
  }, [subject]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Domain Summaries for Parents</h2>
        <select value={subject} onChange={e => setSubject(e.target.value)}
          className="border rounded px-3 py-1.5 text-sm">
          <option value="">All Subjects</option>
          {SUBJECTS.filter(Boolean).map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {clusters.map((c, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-600">{c.subject}</span>
              <span className="text-xs text-gray-400">Age {c.ageRangeStart}+</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">{c.domain}</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{c.summary}</p>
          </div>
        ))}
      </div>
    </div>
  );
}