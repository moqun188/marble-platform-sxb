import { Link } from 'react-router-dom'

const subjects = [
  { name: 'Science', count: 387, color: '#4CAF50', icon: '🔬' },
  { name: 'Mathematics', count: 312, color: '#2196F3', icon: '🔢' },
  { name: 'English', count: 256, color: '#FF9800', icon: '📖' },
  { name: 'History', count: 178, color: '#9C27B0', icon: '🏛️' },
  { name: 'Personal & Social Dev', count: 134, color: '#E91E63', icon: '🤝' },
  { name: 'Life Skills', count: 112, color: '#00BCD4', icon: '🛠️' },
  { name: 'Computing', count: 98, color: '#607D8B', icon: '💻' },
  { name: 'Learning to Learn', count: 113, color: '#795548', icon: '🧠' },
]

const features = [
  {
    icon: '🔗',
    title: '知识依赖可视化',
    desc: '1,590 个微主题通过 3,221 条先修链连接成 DAG 图，直观展示知识间的依赖关系。',
  },
  {
    icon: '🗺️',
    title: '学习路径诊断',
    desc: '从入口到目标主题的完整学习路径，帮助教师和家长定位学生知识断层。',
  },
  {
    icon: '📐',
    title: '课程标准对齐',
    desc: '覆盖 7 套国际课程标准，将抽象标准映射到具体可教、可测的微主题。',
  },
  {
    icon: '🤖',
    title: 'AI 教育底座',
    desc: '标准化知识结构为智能教育产品提供数据基础，支撑自适应学习和智能推荐。',
  },
]

const timeline = [
  { phase: 'Phase 1', title: 'REST API 服务', desc: '知识查询、依赖链追溯、标准映射', status: 'done' },
  { phase: 'Phase 2', title: 'Web 可视化', desc: '交互式知识图谱浏览', status: 'current' },
  { phase: 'Phase 3', title: '智能诊断', desc: '输入学生表现，输出知识断层分析', status: 'planned' },
]

export default function Home() {
  const maxCount = Math.max(...subjects.map((s) => s.count))

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
          K-12 教育知识图谱服务平台，将 <strong>1,590</strong> 个微主题通过 <strong>3,221</strong> 条先修链连接成结构化知识网络。
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
        <DataCard icon="📚" label="微主题" value="1,590" sub="可教、可测的最小知识单元" color="#3B82F6" />
        <DataCard icon="🔗" label="先修链" value="3,221" sub="知识依赖关系" color="#10B981" />
        <DataCard icon="🎓" label="学科" value="8" sub="覆盖 K-12 核心领域" color="#8B5CF6" />
        <DataCard icon="📐" label="课程标准" value="7" sub="国际课程标准对齐" color="#F59E0B" />
      </section>

      {/* 学科分布 */}
      <section className="bg-white dark:bg-gray-900 rounded-xl border border-[var(--color-border)] p-6">
        <h3 className="text-lg font-semibold mb-5">学科分布</h3>
        <div className="space-y-3">
          {subjects.map((s) => (
            <div key={s.name} className="flex items-center gap-3">
              <span className="text-base w-6 text-center">{s.icon}</span>
              <span className="text-sm w-44 truncate">{s.name}</span>
              <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full h-2.5">
                <div
                  className="h-2.5 rounded-full transition-all duration-500"
                  style={{
                    width: `${(s.count / maxCount) * 100}%`,
                    backgroundColor: s.color,
                  }}
                />
              </div>
              <span className="text-sm text-gray-500 w-10 text-right font-mono">{s.count}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 核心功能 */}
      <section>
        <h3 className="text-lg font-semibold mb-5">核心功能</h3>
        <div className="grid grid-cols-2 gap-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-white dark:bg-gray-900 rounded-xl border border-[var(--color-border)] p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{f.icon}</span>
                <h4 className="font-semibold">{f.title}</h4>
              </div>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 产品路线 */}
      <section className="bg-white dark:bg-gray-900 rounded-xl border border-[var(--color-border)] p-6">
        <h3 className="text-lg font-semibold mb-5">产品路线</h3>
        <div className="flex gap-4">
          {timeline.map((t, i) => (
            <div key={t.phase} className="flex-1 relative">
              <div className="flex items-center gap-2 mb-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    t.status === 'done'
                      ? 'bg-green-500'
                      : t.status === 'current'
                      ? 'bg-blue-500 animate-pulse'
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                />
                <span className="text-xs font-mono text-gray-400">{t.phase}</span>
              </div>
              <h4 className="font-semibold text-sm mb-1">{t.title}</h4>
              <p className="text-xs text-[var(--color-text-secondary)]">{t.desc}</p>
              {i < timeline.length - 1 && (
                <div className="absolute top-[18px] left-[calc(100%+4px)] w-[calc(100%-12px)] h-px bg-gray-200 dark:bg-gray-700" />
              )}
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
