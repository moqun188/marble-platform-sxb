import { useState, useEffect } from "react";
import { getSubjects, type Subject } from "../services/api";

const COLORS: Record<string, string> = {
  Science: "#4CAF50", Mathematics: "#2196F3", English: "#FF9800", History: "#9C27B0",
  "Personal & Social Development": "#E91E63", "Life Skills": "#00BCD4",
  Computing: "#607D8B", "Learning to Learn": "#795548",
};

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);

  useEffect(() => {
    getSubjects().then(setSubjects).catch(console.error);
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Subjects</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {subjects.map(s => (
          <div key={s.name} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-4 h-4 rounded-full" style={{ background: COLORS[s.name] || "#999" }} />
              <h3 className="text-lg font-semibold">{s.name}</h3>
              <span className="text-sm text-gray-500 ml-auto">{s.count} topics</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {s.domains.map(d => (
                <span key={d} className="text-xs bg-gray-100 px-2 py-1 rounded">{d}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}