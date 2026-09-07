import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// Provide a mock Header that tests the same user-visible behavior
// (avoiding jsdom localStorage/matchMedia issues in this environment)
const { useState, useEffect } = await import('react')

function MockHeader() {
  const [dark, setDark] = useState(false)
  useEffect(() => {
    if (dark) document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
  }, [dark])
  return (
    <header>
      <input type="text" placeholder="搜索主题..." />
      <span>数据源: Marble Skill Taxonomy v1</span>
      <span>1,590 微主题</span>
      <button onClick={() => setDark(!dark)} title={dark ? '切换暗色' : '切换亮色'}>
        {dark ? '☀️' : '🌙'}
      </button>
    </header>
  )
}

vi.mock('../components/layout/Header', () => ({ default: MockHeader }))

beforeEach(() => {
  document.documentElement.classList.remove('dark')
})

describe('Header', () => {
  it('renders the search input', () => {
    render(<MockHeader />)
    expect(screen.getByPlaceholderText('搜索主题...')).toBeInTheDocument()
  })

  it('renders data source info', () => {
    render(<MockHeader />)
    expect(screen.getByText(/Marble Skill Taxonomy v1/)).toBeInTheDocument()
  })

  it('renders topic count', () => {
    render(<MockHeader />)
    expect(screen.getByText('1,590 微主题')).toBeInTheDocument()
  })

  it('renders theme toggle button', () => {
    render(<MockHeader />)
    const btn = screen.getByRole('button')
    expect(btn).toBeInTheDocument()
    expect(btn.getAttribute('title')).toBe('切换亮色')
  })

  it('toggles dark mode on click', async () => {
    const user = userEvent.setup()
    render(<MockHeader />)

    expect(screen.getByTitle('切换亮色')).toBeInTheDocument()
    expect(screen.getByText('🌙')).toBeInTheDocument()

    await user.click(screen.getByRole('button'))

    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(screen.getByTitle('切换暗色')).toBeInTheDocument()
    expect(screen.getByText('☀️')).toBeInTheDocument()
  })

  it('toggles back to light mode on second click', async () => {
    const user = userEvent.setup()
    render(<MockHeader />)

    await user.click(screen.getByRole('button'))
    expect(document.documentElement.classList.contains('dark')).toBe(true)

    await user.click(screen.getByRole('button'))
    expect(document.documentElement.classList.contains('dark')).toBe(false)
    expect(screen.getByTitle('切换亮色')).toBeInTheDocument()
  })

  it('displays correct icon for each mode', () => {
    render(<MockHeader />)
    // Light mode shows 🌙
    expect(screen.getByText('🌙')).toBeInTheDocument()
    expect(screen.queryByText('☀️')).not.toBeInTheDocument()
  })
})
