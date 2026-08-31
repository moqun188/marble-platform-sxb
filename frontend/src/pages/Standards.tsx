import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchStandards } from '../services/api'
import { generateMockStandards, generateMockTopics } from '../services/mock'
import type { Standard, Topic } from '../types/topic'

export default function Standards() {
  const [standards, setStandards] = useState<Standard[]>([])
  const [allTopics, setAllTopics] = useState<Topic[]>([])
  const [loading, setLoading] = useState(true)
  const [usingMock, setUsingMock] = useState(false)
  const [search, setSearch] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([
      fetchStandards().catch(() => null),
    ]).then(([s]) => {
      if (s && s.length > 0) {
        setStandards(s)
        setUsingMock(false)
      } else {
        setStandards(generateMockStandards())
        setAllTopics(generateMockTopics())
        setUsingMock(true)
      }
    }).finally(() => setLoading(false))
  }, [])

  const filtered = standards.filter(
    (s) => !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.description?.toLowerCase().includes(search.toLowerCase())
  )

  const totalTopics = standards.reduce((sum, s) => sum + (s.topics?.length || 0), 0)

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-xl font-bold">课程标准</h2>
          {usingMock && (
            <span className="text-xs text-amber-500 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded mt-1 inline-block">
              ⚠️ 使用演示数据
            </span>
          )}
        </div>
        <span className="text-sm text-gray-500">{standards.length} 套标准 / {totalTopics} 次映射</span>
      </div>
      <p className="text-sm text-[var(--color-text-secondary)] mb-5">
        将国际课程标准映射到具体微主题，方便教研对标
      </p>

      {/* 搜索 */}
      <input
        type="text"
        placeholder="搜索标准名称..."
        className="px-3 py-2 text-sm border rounded-lg w-72 mb-5 bg-white dark:bg-gray-800 dark:border-gray-700"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <p className="text-gray-400">加载中...</p>
      ) : filtered.length === 0 ? (
        <p className="text-gray-400">无匹配结果</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((s) => {
            const isExpanded = expandedId === s.id
            // 查找关联主题的详情（mock 模式）
            const relatedTopics = usingMock
              ? allTopics.filter((t) => s.topics?.includes(t.name))
              : []

            return (
              <div
                key={s.id}
                className="bg-white dark:bg-gray-900 rounded-xl border border-[var(--color-border)] overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* 头部 */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : s.id)}
                  className="w-full text-left px-5 py-4 flex items-center justify-between"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-sm">{s.name}</h3>
                      {s.topics && (
                        <span className="text-[10px] px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-500">
                          {s.topics.length} 主题
                        </span>
                      )}
                    </div>
                    {s.description && (
                      <p className="text-xs text-[var(--color-text-secondary)] truncate">{s.description}</p>
                    )}
                  </div>
                  <span className="text-gray-300 text-sm ml-3">{isExpanded ? '▲' : '▼'}</span>
                </button>

                {/* 展开内容 */}
                {isExpanded && (
                  <div className="px-5 pb-4 border-t border-gray-100 dark:border-gray-800 pt-3">
                    {s.description && (
                      <p className="text-sm text-[var(--color-text-secondary)] mb-3">{s.description}</p>
                    )}

                    {s.topics && s.topics.length > 0 ? (
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-2">关联主题：</p>
                        <div className="flex flex-wrap gap-2">
                          {s.topics.map((topicName) => {
                            const topicDetail = relatedTopics.find((t) => t.name === topicName)
                            return topicDetail ? (
                              <Link
                                key={topicName}
                                to={`/topics/${topicDetail.id}`}
                                className="text-xs px-2.5 py-1 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                              >
                                {topicName}
                              </Link>
                            ) : (
                              <span key={topicName} className="text-xs px-2.5 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
                                {topicName}
                              </span>
                            )
                          })}
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400">暂无关联主题</p>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
