import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchSubjects } from '../services/api'
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

export default function Home() {
  const [subjects, setSubjects] = useState<SubjectStat[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSubjects()
      .then(setSubjects)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const totalTopics = subjects.reduce((s, x) => s + x.count, 0)

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      {/* Hero */}
      <section className="text-center py-8">
        <div className="text-5xl mb-4">🧠</div>
        <h2 className="text-3xl font-bold text-[var(--color-text)] mb-3">
          Marble 知识图谱平台
        </h2>
        <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto leading-relaxed">
          基于 <a href="https://github.com/withmarbleapp/os-taxonomy" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Marble Skill Taxonomy</a> 构建的
          K-12 教育知识图谱服务平台，将 <strong>{totalTopics || '1,590'}</strong> 个微主题通过 <strong>3,221</strong> 条先修链连接成结构化知识网络。
        </p>
        <div className="flex justify-center gap-3 mt-6">
          <Link
            to="/graph"
            className="px-5 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
          >
            🕸️ 浏览知识图谱
          </Link>
          <Link
            to="/topics"
            className="px-5 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm font-medium"
          >
            📚 查看主题列表
          </Link>
        </div>
      </section>

      {/* 核心数据 */}
      <section className="grid grid-cols-4 gap-4">
        <DataCard icon="📚" label="微主题" value={String(totalTopics || '1,590')} sub="可教、可测的最小知识单元" color="#3B82F6" />
        <DataCard icon="🔗" label="先修链" value="3,221" sub="知识依赖关系" color="#10B981" />
        <DataCard icon="🎓" label="学科" value={String(subjects.length || '8')} sub="覆盖 K-12 核心领域" color="#8B5CF6" />
        <DataCard icon="📐" label="课程标准" value="7" sub="国际课程标准对齐" color="#F59E0B" />
      </section>

      {/* 学科分布 */}
      <section className="bg-white dark:bg-gray-900 rounded-xl border border-[var(--color-border)] p-6">
        <h3 className="text-lg font-semibold mb-5">学科分布</h3>
        {loading ? (
          <p className="text-sm text-gray-400">加载中...</p>
        ) : subjects.length > 0 ? (
          <div className="space-y-3">
            {subjects.map((s) => (
              <div key={s.name} className="flex items-center gap-3">
                <span className="text-base w-6 text-center">{subjectIcons[s.name] || '📚'}</span>
                <span className="text-sm w-44 truncate">{s.name}</span>
                <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full h-2.5">
                  <div
                    className="h-2.5 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min((s.count / (Math.max(...subjects.map(x => x.count)) || 1)) * 100, 100)}%`,
                      backgroundColor: subjectColors[s.name] || '#94A3B8',
                    }}
                  />
                </div>
                <span className="text-sm text-gray-500 w-10 text-right font-mono">{s.count}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400">暂无数据</p>
        )}
      </section>

      {/* 核心功能 */}
      <section>
        <h3 className="text-lg font-semibold mb-5">核心功能</h3>
        <div className="grid grid-cols-2 gap-4">
          {[
            { icon: '🔗', title: '知识依赖可视化', desc: '1,590 个微主题通过 3,221 条先修链连接成 DAG 图，直观展示知识间的依赖关系。' },
            { icon: '🗺️', title: '学习路径诊断', desc: '从入口到目标主题的完整学习路径，帮助教师和家长定位学生知识断层。' },
            { icon: '📐', title: '课程标准对齐', desc: '覆盖 7 套国际课程标准，将抽象标准映射到具体可教、可测的微主题。' },
            { icon: '🤖', title: 'AI 教育底座', desc: '标准化知识结构为智能教育产品提供数据基础，支撑自适应学习和智能推荐。' },
          ].map((f) => (
            <div key={f.title} className="bg-white dark:bg-gray-900 rounded-xl border border-[var(--color-border)] p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{f.icon}</span>
                <h4 className="font-semibold">{f.title}</h4>
              </div>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 数据来源 */}
      <section className="text-center text-xs text-gray-400 pb-4">
        <p>
          数据来源: <a href="https://github.com/withmarbleapp/os-taxonomy" target="_blank" rel="noopener" className="hover:underline">Marble Skill Taxonomy v1</a>
          {' '}• 许可: ODbL 1.0 (数据库) + CC BY-SA 4.0 (内容)
        </p>
      </section>
    </div>
  )
}

function DataCard({ icon, label, value, sub, color }: { icon: string; label: string; value: string; sub: string; color: string }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-[var(--color-border)] p-5 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">{icon}</span>
        <span className="text-sm text-[var(--color-text-secondary)]">{label}</span>
      </div>
      <div className="text-3xl font-bold mb-1" style={{ color }}>{value}</div>
      <p className="text-xs text-[var(--color-text-secondary)]">{sub}</p>
    </div>
  )
}
