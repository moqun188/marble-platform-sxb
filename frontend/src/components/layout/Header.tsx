import { useEffect, useState } from 'react'

export default function Header() {
  const [dark, setDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('marble-theme') === 'dark' ||
        (!localStorage.getItem('marble-theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
    }
    return false
  })

  useEffect(() => {
    const root = document.documentElement
    if (dark) {
      root.classList.add('dark')
      localStorage.setItem('marble-theme', 'dark')
    } else {
      root.classList.remove('dark')
      localStorage.setItem('marble-theme', 'light')
    }
  }, [dark])

  return (
    <header className="h-14 bg-white dark:bg-gray-900 border-b border-[var(--color-border)] flex items-center justify-between px-6 transition-colors">
      <div className="flex items-center gap-3">
        <input
          type="text"
          placeholder="搜索主题..."
          className="w-72 px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent placeholder-gray-400"
        />
      </div>
      <div className="flex items-center gap-4 text-sm text-[var(--color-text-secondary)]">
        <span className="hidden sm:inline">数据源: Marble Skill Taxonomy v1</span>
        <span className="hidden sm:inline">•</span>
        <span className="hidden sm:inline">1,590 微主题</span>
        <button
          onClick={() => setDark(!dark)}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-base"
          title={dark ? '切换亮色' : '切换暗色'}
        >
          {dark ? '☀️' : '🌙'}
        </button>
      </div>
    </header>
  )
}
