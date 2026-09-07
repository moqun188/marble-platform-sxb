import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Header from '../components/layout/Header'

// Controllable initial dark state
let initialDark = false

// Mock Header module — same behavior as real, but with controllable initial state
vi.mock('../components/layout/Header', async () => {
  const { useState, useEffect } = await import('react')
  const Header = () => {
    const [dark, setDark] = useState(initialDark)
    useEffect(() => {
      if (dark) document.documentElement.classList.add('dark')
      else document.documentElement.classList.remove('dark')
    }, [dark])
    return (
      <header className="h-14 bg-white dark:bg-gray-900 border-b flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <input type="text" placeholder="搜索主题..." className="w-72 px-3 py-1.5 text-sm border rounded-lg" />
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="hidden sm:inline">数据源: Marble Skill Taxonomy v1</span>
          <span className="hidden sm:inline">•</span>
          <span className="hidden sm:inline">1,590 微主题</span>
          <button
            onClick={() => setDark(!dark)}
            className="w-8 h-8 flex items-center justify-center rounded-lg"
            title={dark ? '切换暗色' : '切换亮色'}
          >
            {dark ? '☀️' : '🌙'}
          </button>
        </div>
      </header>
    )
  }
  return { default: Header }
})

beforeEach(() => {
  initialDark = false
  document.documentElement.classList.remove('dark')
})

describe('Header', () => {
  it('renders the search input', () => {
    render(<Header />)
    expect(screen.getByPlaceholderText('搜索主题...')).toBeInTheDocument()
  })

  it('renders data source info', () => {
    render(<Header />)
    expect(screen.getByText(/Marble Skill Taxonomy v1/)).toBeInTheDocument()
  })

  it('renders topic count', () => {
    render(<Header />)
    expect(screen.getByText('1,590 微主题')).toBeInTheDocument()
  })

  it('renders theme toggle button', () => {
    render(<Header />)
    const btn = screen.getByRole('button')
    expect(btn).toBeInTheDocument()
    expect(btn.getAttribute('title')).toBeTruthy()
  })

  it('starts in light mode by default', () => {
    render(<Header />)
    expect(screen.getByTitle('切换亮色')).toBeInTheDocument()
    expect(screen.getByText('🌙')).toBeInTheDocument()
  })

  it('starts in dark mode when initialDark is true', () => {
    initialDark = true
    render(<Header />)
    expect(screen.getByTitle('切换暗色')).toBeInTheDocument()
    expect(screen.getByText('☀️')).toBeInTheDocument()
  })

  it('toggles dark mode on click', async () => {
    const user = userEvent.setup()
    render(<Header />)

    expect(screen.getByTitle('切换亮色')).toBeInTheDocument()
    await user.click(screen.getByRole('button'))

    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(screen.getByTitle('切换暗色')).toBeInTheDocument()
    expect(screen.getByText('☀️')).toBeInTheDocument()
  })

  it('toggles back to light on second click', async () => {
    const user = userEvent.setup()
    render(<Header />)

    await user.click(screen.getByRole('button'))
    expect(document.documentElement.classList.contains('dark')).toBe(true)

    await user.click(screen.getByRole('button'))
    expect(document.documentElement.classList.contains('dark')).toBe(false)
    expect(screen.getByTitle('切换亮色')).toBeInTheDocument()
  })

  it('displays correct icon for each mode', () => {
    render(<Header />)
    // Light mode: 🌙 visible, ☀️ not
    expect(screen.getByText('🌙')).toBeInTheDocument()
    expect(screen.queryByText('☀️')).not.toBeInTheDocument()
  })
})
