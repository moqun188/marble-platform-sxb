import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { fetchTopic, fetchPrereqs, fetchUnlocks, fetchPath } from '../services/api'
import { generateMockTopic, generateMockPrereqs, generateMockUnlocks, generateMockPath } from '../services/mock'
import type { Topic } from '../types/topic'

export default function TopicDetail() {
  const { id } = useParams<{ id: string }>()
  const [topic, setTopic] = useState<Topic | null>(null)
  const [prereqs, setPrereqs] = useState<Topic[]>([])
  const [unlocks, setUnlocks] = useState<Topic[]>([])
  const [path, setPath] = useState<Topic[]>([])
  const [loading, setLoading] = useState(true)
  const [usingMock, setUsingMock] = useState(false)

  useEffect(() => {
    if (!id) return
    setLoading(true)

    // 尝试 API，失败降级 mock
    Promise.all([
      fetchTopic(id).catch(() => null),
      fetchPrereqs(id).catch(() => []),
      fetchUnlocks(id).catch(() => []),
      fetchPath(id).catch(() => []),
    ]).then(([t, p, u, pa]) => {
      if (t) {
        setTopic(t)
        setPrereqs(p)
        setUnlocks(u)
        setPath(pa)
        setUsingMock(false)
      } else {
        setTopic(generateMockTopic(id))
        setPrereqs(generateMockPrereqs(id))
        setUnlocks(generateMockUnlocks(id))
        setPath(generateMockPath(id))
        setUsingMock(true)
      }
    }).finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-400">加载中...</div>
  if (!topic) return (
    <div className="text-center py-16">
      <p className="text-gray-400 text-lg mb-4">主题未找到</p>
      <Link to="/topics" className="text-blue-500 hover:underline">← 返回列表</Link>
    </div>
  )

  return (
    <div className="max-w-4xl">
      <Link to="/topics" className="text-sm text-blue-500 hover:underline mb-4 inline-block">
        ← 返回列表
      </Link>

      {usingMock && (
        <span className="text-xs text-amber-500 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded mb-3 inline-block">
          ⚠️ 使用演示数据
        </span>
      )}

      {/* 标题区 */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">{topic.name}</h2>
        <div className="flex gap-2 flex-wrap">
          {topic.subject && <Tag color="blue">{topic.subject}</Tag>}
          {topic.ageRange && <Tag color="green">{topic.ageRange}</Tag>}
          {topic.type && <Tag color={topic.type === 'core' ? 'purple' : 'gray'}>{topic.type}</Tag>}
        </div>
      </div>

      {/* 描述 */}
      {topic.description && (
        <Card title="📖 描述">
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{topic.description}</p>
        </Card>
      )}

      {/* Evidence */}
      {topic.evidence && (
        <Card title="✅ 学习证据">
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{topic.evidence}</p>
        </Card>
      )}

      {/* Assessment Prompt */}
      {topic.assessmentPrompt && (
        <Card title="📝 评估提示">
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed italic">{topic.assessmentPrompt}</p>
        </Card>
      )}

      {/* 依赖关系 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <DepList title="⬆️ 前置依赖" items={prereqs} color="orange" empty="无前置要求" />
        <DepList title="🔗 学习路径" items={path} color="blue" empty="入口主题" />
        <DepList title="⬇️ 解锁主题" items={unlocks} color="green" empty="终端主题" />
      </div>
    </div>
  )
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-[var(--color-border)] p-5 mb-4">
      <h3 className="font-semibold mb-3 text-sm">{title}</h3>
      {children}
    </div>
  )
}

function Tag({ color, children }: { color: string; children: React.ReactNode }) {
  const colors: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    green: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    purple: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    gray: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  }
  return <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${colors[color] || colors.gray}`}>{children}</span>
}

function DepList({ title, items, color, empty }: { title: string; items: Topic[]; color: string; empty: string }) {
  const colorMap: Record<string, string> = {
    orange: 'border-orange-200 bg-orange-50/50 dark:border-orange-900/40 dark:bg-orange-900/10',
    blue: 'border-blue-200 bg-blue-50/50 dark:border-blue-900/40 dark:bg-blue-900/10',
    green: 'border-green-200 bg-green-50/50 dark:border-green-900/40 dark:bg-green-900/10',
  }
  return (
    <div className={`rounded-xl border p-4 ${colorMap[color] || ''}`}>
      <h4 className="font-semibold text-sm mb-3">{title}</h4>
      {items.length === 0 ? (
        <p className="text-xs text-gray-400">{empty}</p>
      ) : (
        <ul className="space-y-2">
          {items.map((t) => (
            <li key={t.id}>
              <Link to={`/topics/${t.id}`} className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600 shrink-0" />
                {t.name}
              </Link>
              {t.subject && <span className="text-[10px] text-gray-400 ml-3">{t.subject}</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
