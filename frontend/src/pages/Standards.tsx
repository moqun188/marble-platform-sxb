import { useEffect, useState } from 'react'
import { fetchStandards } from '../services/api'
import { generateMockStandards } from '../services/mock'
import type { Curriculum } from '../types/topic'

const countryFlags: Record<string, string> = {
  GB: '🇬🇧',
  US: '🇺🇸',
  International: '🌍',
  AU: '🇦🇺',
  SG: '🇸🇬',
  IE: '🇮🇪',
  NZ: '🇳🇿',
}

export default function Standards() {
  const [curricula, setCurricula] = useState<Curriculum[]>([])
  const [loading, setLoading] = useState(true)
  const [usingMock, setUsingMock] = useState(false)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchStandards()
      .then((d) => {
        if (d.curricula && d.curricula.length > 0) {
          setCurricula(d.curricula)
          setUsingMock(false)
        } else {
          throw new Error('empty')
        }
      })
      .catch(() => {
        const mock = generateMockStandards()
        setCurricula(mock.map((m) => ({ slug: m.id, name: m.name, country: 'International', standardCount: m.topics?.length || 0 })))
        setUsingMock(true)
      })
      .finally(() => setLoading(false))
  }, [])

  const filtered = curricula.filter(
    (c) => !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.slug.toLowerCase().includes(search.toLowerCase())
  )

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
        <span className="text-sm text-gray-500">{curricula.length} 套标准</span>
      </div>
      <p className="text-sm text-[var(--color-text-secondary)] mb-5">
        将国际课程标准映射到具体微主题，方便教研对标
      </p>

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filtered.map((c) => (
            <div key={c.slug} className="bg-white dark:bg-gray-900 rounded-xl border border-[var(--color-border)] p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                <span className="text-2xl">{countryFlags[c.country] || '📘'}</span>
                <div className="min-w-0">
                  <h3 className="font-semibold text-sm mb-1 leading-tight">{c.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 font-mono">{c.slug}</span>
                    <span className="text-xs text-gray-300">•</span>
                    <span className="text-xs text-gray-500">{c.country}</span>
                    {c.standardCount > 0 && (
                      <>
                        <span className="text-xs text-gray-300">•</span>
                        <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 rounded-full">
                          {c.standardCount} 标准
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
