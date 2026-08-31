import { useEffect, useState } from 'react'
import { fetchDomains } from '../services/api'
import type { Domain } from '../types/topic'

export default function Domains() {
  const [domains, setDomains] = useState<Domain[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDomains()
      .then(setDomains)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">领域列表</h2>
      {loading ? (
        <p className="text-gray-400">加载中...</p>
      ) : domains.length === 0 ? (
        <p className="text-gray-400">暂无数据（后端 API 未就绪）</p>
      ) : (
        <div className="bg-white rounded-xl border border-[var(--color-border)] overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-4 py-3 font-medium">领域</th>
                <th className="px-4 py-3 font-medium">学科</th>
                <th className="px-4 py-3 font-medium">主题数</th>
              </tr>
            </thead>
            <tbody>
              {domains.map((d) => (
                <tr key={d.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{d.name}</td>
                  <td className="px-4 py-3 text-gray-600">{d.subject}</td>
                  <td className="px-4 py-3 text-gray-600">{d.topicCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
