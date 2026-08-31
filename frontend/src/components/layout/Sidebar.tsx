import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/', label: '首页', icon: '🏠', end: true },
  { to: '/topics', label: '主题列表', icon: '📚' },
  { to: '/graph', label: '知识图谱', icon: '🕸️' },
  { to: '/subjects', label: '学科总览', icon: '📊' },
  { to: '/domains', label: '领域列表', icon: '🗂️' },
  { to: '/clusters', label: '领域摘要', icon: '👶' },
  { to: '/standards', label: '课程标准', icon: '📐' },
]

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  return (
    <aside
      className={`bg-[var(--color-sidebar)] text-[var(--color-sidebar-text)] flex flex-col min-h-screen transition-all duration-200 ${
        collapsed ? 'w-16' : 'w-56'
      }`}
    >
      {/* Logo */}
      <div className="px-4 py-4 border-b border-white/10 flex items-center justify-between">
        <div className={`flex items-center gap-2 ${collapsed ? 'justify-center w-full' : ''}`}>
          <span className="text-lg">🧠</span>
          {!collapsed && (
            <div>
              <h1 className="text-sm font-bold text-white tracking-tight">Marble</h1>
              <p className="text-[10px] opacity-50">知识图谱平台</p>
            </div>
          )}
        </div>
        <button
          onClick={onToggle}
          className={`text-white/40 hover:text-white/80 text-xs transition-colors ${collapsed ? 'hidden' : ''}`}
          title="收起侧边栏"
        >
          ◀
        </button>
      </div>

      {/* 导航 */}
      <nav className="flex-1 py-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            title={collapsed ? item.label : undefined}
            className={({ isActive }) =>
              `flex items-center gap-3 mx-2 rounded-lg text-sm transition-colors ${
                collapsed ? 'justify-center px-2 py-2.5' : 'px-3 py-2.5'
              } ${
                isActive
                  ? 'bg-white/10 text-white'
                  : 'hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <span className="text-base shrink-0">{item.icon}</span>
            {!collapsed && <span className="truncate">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* 展开按钮（折叠时显示） */}
      {collapsed && (
        <button
          onClick={onToggle}
          className="mx-2 mb-2 py-2 text-white/40 hover:text-white/80 hover:bg-white/5 rounded-lg text-xs transition-colors"
          title="展开侧边栏"
        >
          ▶
        </button>
      )}

      {/* 版本 */}
      <div className={`px-4 py-3 text-[10px] opacity-30 border-t border-white/10 ${collapsed ? 'text-center' : ''}`}>
        {collapsed ? 'v0.1' : 'Marble Platform v0.1.0'}
      </div>
    </aside>
  )
}
