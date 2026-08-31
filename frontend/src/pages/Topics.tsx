import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { fetchTopics } from '../services/api'
import { generateMockTopics } from '../services/mock'
import type { Topic, TopicFilters } from '../types/topic'

export default function Topics() {
  const [topics, setTopics] = useState<Topic[]>([])
  const [loading, setLoading] = useState(true)
  const [usingMock, setUsingMock] = useState(false)
  const [filters, setFilters] = useState<TopicFilters>({ page: 1, pageSize: 20 })
  const [search, setSearch] = useState('')

  useEffect(() => {
    setLoading(true)
    fetchTopics(filters)
      .then((res) => {
        setTopics(res.data)
        setUsingMock(false)
      })
      .catch(() => {
        // API 未就绪，使用 mock 数据
        setTopics(generateMockTopics())
        setUsingMock(true)
      })
      .finally(() => setLoading(false))
  }, [filters.subject, filters.type])

  // 客户端搜索 + 分页（mock 模式）
  const filtered = useMemo(() => {
    let result = topics
    if (search) {
      const q = search.toLowerCase()
      result = result.filter((t) => t.name.toLowerCase().includes(q) || t.subject.toLowerCase().includes(q))
    }
    if (filters.subject) {
      result = result.filter((t) => t.subject === filters.subject)
    }
    return result
  }, [topics, search, filters.subject])

  const total = filtered.length
  const pageSize = filters.pageSize || 20
  const page = filters.page || 1
  const paged = usingMock ? filtered.slice((page - 1) * pageSize, page * pageSize) : filtered

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold">主题列表</h2>
          {usingMock && (
            <span className="text-xs text-amber-500 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded mt-1 inline-block">
              ⚠️ 使用演示数据（后端 API 未就绪）
            </span>
          )}
        </div>
        <span className="text-sm text-gray-500">共 {total} 个主题</span>
      </div>

      {/* 筛选器 */}
      <div className="flex gap-3 mb-4">
        <select
          className="px-3 py-2 text-sm border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700"
          value={filters.subject || ''}
          onChange={(e) => setFilters({ ...filters, subject: e.target.value || undefined, page: 1 })}
        >
          <option value="">全部学科</option>
          <option value="Science">Science</option>
          <option value="Mathematics">Mathematics</option>
          <option value="English">English</option>
          <option value="History">History</option>
          <option value="Computing">Computing</option>
          <option value="Life Skills">Life Skills</option>
          <option value="Learning to Learn">Learning to Learn</option>
          <option value="Personal & Social Development">Personal & Social Dev</option>
        </select>
        <input
          type="text"
          placeholder="搜索主题名称..."
          className="px-3 py-2 text-sm border rounded-lg w-64 bg-white dark:bg-gray-800 dark:border-gray-700"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setFilters({ ...filters, page: 1 })
          }}
        />
      </div>

      {/* 表格 */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-[var(--color-border)] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">名称</th>
              <th className="px-4 py-3 font-medium">学科</th>
              <th className="px-4 py-3 font-medium">年龄段</th>
              <th className="px-4 py-3 font-medium">类型</th>
              <th className="px-4 py-3 font-medium">操作</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">加载中...</td></tr>
            ) : paged.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">无匹配结果</td></tr>
            ) : (
              paged.map((t) => (
                <tr key={t.id} className="border-t dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-4 py-3 font-medium">{t.name}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{t.subject}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{t.ageRange || '-'}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      t.type === 'core' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                    }`}>
                      {t.type || '-'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link to={`/topics/${t.id}`} className="text-blue-500 hover:underline">
                      详情
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 分页 */}
      {usingMock && (
        <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
          <span>第 {page} 页，共 {Math.ceil(total / pageSize)} 页</span>
          <div className="flex gap-2">
            <button
              className="px-3 py-1 border rounded disabled:opacity-40 dark:border-gray-700"
              disabled={page === 1}
              onClick={() => setFilters({ ...filters, page: page - 1 })}
            >
              上一页
            </button>
            <button
              className="px-3 py-1 border rounded disabled:opacity-40 dark:border-gray-700"
              disabled={page * pageSize >= total}
              onClick={() => setFilters({ ...filters, page: page + 1 })}
            >
              下一页
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
