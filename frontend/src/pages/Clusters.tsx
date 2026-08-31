import { useEffect, useState } from 'react'
import { fetchClusters } from '../services/api'
import { generateMockClusters } from '../services/mock'
import type { Cluster } from '../types/topic'

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

export default function Clusters() {
  const [clusters, setClusters] = useState<Cluster[]>([])
  const [loading, setLoading] = useState(true)
  const [usingMock, setUsingMock] = useState(false)
  const [filterSubject, setFilterSubject] = useState('')

  useEffect(() => {
    fetchClusters()
      .then((d) => { setClusters(d); setUsingMock(false) })
      .catch(() => { setClusters(generateMockClusters()); setUsingMock(true) })
      .finally(() => setLoading(false))
  }, [])

  const filtered = filterSubject ? clusters.filter((c) => c.subject === filterSubject) : clusters
  const subjectList = [...new Set(clusters.map((c) => c.subject))]

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-xl font-bold">领域摘要</h2>
          {usingMock && (
            <span className="text-xs text-amber-500 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded mt-1 inline-block">
              ⚠️ 使用演示数据
            </span>
          )}
        </div>
        <span className="text-sm text-gray-500">{filtered.length} 个领域</span>
      </div>
      <p className="text-sm text-[var(--color-text-secondary)] mb-5">
        Parent-friendly 内容，帮助家长理解孩子在学什么
      </p>

      {/* 筛选 */}
      <div className="flex gap-2 mb-5 flex-wrap">
        <button
          onClick={() => setFilterSubject('')}
          className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
            !filterSubject ? 'bg-blue-500 text-white border-blue-500' : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
          }`}
        >
          全部
        </button>
        {subjectList.map((s) => (
          <button
            key={s}
            onClick={() => setFilterSubject(s)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              filterSubject === s ? 'bg-blue-500 text-white border-blue-500' : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
            }`}
          >
            {subjectIcons[s] || '📚'} {s}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-gray-400">加载中...</p>
      ) : filtered.length === 0 ? (
        <p className="text-gray-400">暂无数据</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((c) => (
            <div key={c.id} className="bg-white dark:bg-gray-900 rounded-xl border border-[var(--color-border)] p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2.5 mb-3">
                <span className="text-xl">{subjectIcons[c.subject] || '📚'}</span>
                <div>
                  <h3 className="font-semibold text-sm">{c.name}</h3>
                  <span className="text-xs text-gray-400">{c.subject}</span>
                </div>
              </div>
              {c.description && (
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-3">{c.description}</p>
              )}
              <div className="flex flex-wrap gap-1.5">
                {c.ageGroups?.map((ag) => (
                  <span key={ag} className="text-[10px] px-2 py-0.5 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 rounded-full">
                    {ag}
                  </span>
                ))}
              </div>
              {c.topics && c.topics.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                  <p className="text-[10px] text-gray-400 mb-1.5">包含主题：</p>
                  <div className="flex flex-wrap gap-1">
                    {c.topics.map((t) => (
                      <span key={t} className="text-[10px] px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
