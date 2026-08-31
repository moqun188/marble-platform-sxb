import { Link, useLocation } from 'react-router-dom'

const routeLabels: Record<string, string> = {
  '/': '首页',
  '/topics': '主题列表',
  '/graph': '知识图谱',
  '/subjects': '学科总览',
  '/domains': '领域列表',
  '/clusters': '领域摘要',
  '/standards': '课程标准',
}

export default function Breadcrumbs() {
  const location = useLocation()
  const segments = location.pathname.split('/').filter(Boolean)

  if (location.pathname === '/') return null

  const crumbs: { path: string; label: string }[] = [
    { path: '/', label: '首页' },
  ]

  let currentPath = ''
  for (const seg of segments) {
    currentPath += `/${seg}`
    const label = routeLabels[currentPath] || decodeURIComponent(seg)
    crumbs.push({ path: currentPath, label })
  }

  return (
    <nav className="flex items-center gap-1.5 text-sm mb-5">
      {crumbs.map((crumb, i) => (
        <span key={crumb.path} className="flex items-center gap-1.5">
          {i > 0 && <span className="text-gray-300">/</span>}
          {i === crumbs.length - 1 ? (
            <span className="text-[var(--color-text)] font-medium">{crumb.label}</span>
          ) : (
            <Link to={crumb.path} className="text-[var(--color-text-secondary)] hover:text-blue-500 transition-colors">
              {crumb.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  )
}
