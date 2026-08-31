import { useEffect, useState } from 'react'
import { fetchSubjects } from '../services/api'
import { generateMockSubjects } from '../services/mock'
import type { SubjectStat } from '../types/topic'

const subjectColors: Record<string, string> = {
  Science: '#4CAF50',
  Mathematics: '#2196F3',
  English: '#FF9800',
  History: '#9C27B0',
  'Personal & Social Development': '#E91E63',
  'Life Skills': '#00BCD4',
  Computing: '#607D8B',
  'Learning to Learn': '#795548',
}

const subjectIcons: Record<string, string> = {
  Science: '🔬',
  Mathematics: '🔢',
  English: '📖',
  History: '🏛️',
  'Personal & Social Development': '🤝',
  'Life Skills': '🛠️',
  Computing: '💻',
  'Learning to Learn': '🧠',
}

export default function Subjects() {
  const [subjects, setSubjects] = useState<SubjectStat[]>([])
  const [loading, setLoading] = useState(true)
  const [usingMock, setUsingMock] = useState(false)

  useEffect(() => {
    fetchSubjects()
      .then((d) => {
        setSubjects(d)
        setUsingMock(false)
      })
      .catch(() => {
        setSubjects(generateMockSubjects())
        setUsingMock(true)
      })
      .finally(() => setLoading(false))
  }, [])

  const total = subjects.reduce((s, x) => s + x.count, 0)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold">学科总览</h2>
          {usingMock && (
            <span className="text-xs text-amber-500 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded mt-1 inline-block">
              ⚠️ 使用演示数据
            </span>
          )}
        </div>
        {total > 0 && <span className="text-sm text-gray-500">共 {total} 个微主题</span>}
      </div>

      {loading ? (
        <p className="text-gray-400">加载中...</p>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {subjects.map((s) => (
            <div key={s.subject} className="bg-white dark:bg-gray-900 rounded-xl border border-[var(--color-border)] p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{subjectIcons[s.subject] || '📚'}</span>
                <div>
                  <h3 className="font-semibold">{s.subject}</h3>
                  <p className="text-xs text-gray-500">{s.domains?.length || 0} 个领域</p>
                </div>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-4xl font-bold" style={{ color: subjectColors[s.subject] || '#94A3B8' }}>
                  {s.count}
                </span>
                <span className="text-sm text-gray-500 mb-1">微主题</span>
              </div>
              <div className="mt-3 bg-gray-100 dark:bg-gray-800 rounded-full h-1.5">
                <div
                  className="h-1.5 rounded-full"
                  style={{
                    width: `${Math.min((s.count / 400) * 100, 100)}%`,
                    backgroundColor: subjectColors[s.subject] || '#94A3B8',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
