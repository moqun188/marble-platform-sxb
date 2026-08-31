import { useEffect, useState } from 'react'
import { fetchDomains } from '../services/api'
import type { Domain } from '../types/topic'

export default function Domains() {
  const [domains, setDomains] = useState<Domain[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchDomains()
      .then(setDomains)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtered = domains.filter((d) =>
    !search || d.domain.toLowerCase().includes(search.toLowerCase()) || d.subject.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">领域列表</h2>
        <span className="text-sm text-gray-500">{domains.length} 个领域</span>
      </div>

      <input
        type="text"
        placeholder="搜索领域..."
        className="px-3 py-2 text-sm border rounded-lg w-64 mb-4 bg-white dark:bg-gray-800 dark:border-gray-700"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <p className="text-gray-400">加载中...</p>
      ) : filtered.length === 0 ? (
        <p className="text-gray-400">无匹配结果</p>
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-[var(--color-border)] overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800 text-left">
              <tr>
                <th className="px-4 py-3 font-medium">领域</th>
                <th className="px-4 py-3 font-medium">学科</th>
                <th className="px-4 py-3 font-medium">主题数</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((d) => (
                <tr key={`${d.subject}-${d.domain}`} className="border-t dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="px-4 py-3 font-medium">{d.domain}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{d.subject}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400 font-mono">{d.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
