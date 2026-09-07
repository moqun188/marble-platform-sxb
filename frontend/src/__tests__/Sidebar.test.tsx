import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import Sidebar from '../components/layout/Sidebar'

function renderSidebar(collapsed = false) {
  const onToggle = vi.fn()
  const result = render(
    <MemoryRouter>
      <Sidebar collapsed={collapsed} onToggle={onToggle} />
    </MemoryRouter>,
  )
  return { ...result, onToggle }
}

describe('Sidebar', () => {
  it('renders all nav items when expanded', () => {
    renderSidebar(false)
    expect(screen.getByText('首页')).toBeInTheDocument()
    expect(screen.getByText('主题列表')).toBeInTheDocument()
    expect(screen.getByText('知识图谱')).toBeInTheDocument()
    expect(screen.getByText('学科总览')).toBeInTheDocument()
    expect(screen.getByText('领域列表')).toBeInTheDocument()
    expect(screen.getByText('领域摘要')).toBeInTheDocument()
    expect(screen.getByText('课程标准')).toBeInTheDocument()
  })

  it('renders the logo text when expanded', () => {
    renderSidebar(false)
    expect(screen.getByText('Marble')).toBeInTheDocument()
    expect(screen.getByText('知识图谱平台')).toBeInTheDocument()
  })

  it('hides labels when collapsed', () => {
    renderSidebar(true)
    expect(screen.queryByText('首页')).not.toBeInTheDocument()
    expect(screen.queryByText('Marble')).not.toBeInTheDocument()
  })

  it('still shows icons when collapsed', () => {
    renderSidebar(true)
    expect(screen.getByText('🏠')).toBeInTheDocument()
    expect(screen.getByText('📚')).toBeInTheDocument()
  })

  it('shows expand button when collapsed', () => {
    renderSidebar(true)
    expect(screen.getByTitle('展开侧边栏')).toBeInTheDocument()
  })

  it('calls onToggle when expand button clicked', async () => {
    const { onToggle } = renderSidebar(true)
    const user = userEvent.setup()
    await user.click(screen.getByTitle('展开侧边栏'))
    expect(onToggle).toHaveBeenCalledTimes(1)
  })

  it('shows collapse button when expanded', () => {
    renderSidebar(false)
    expect(screen.getByTitle('收起侧边栏')).toBeInTheDocument()
  })

  it('calls onToggle when collapse button clicked', async () => {
    const { onToggle } = renderSidebar(false)
    const user = userEvent.setup()
    await user.click(screen.getByTitle('收起侧边栏'))
    expect(onToggle).toHaveBeenCalledTimes(1)
  })

  it('shows version text when expanded', () => {
    renderSidebar(false)
    expect(screen.getByText('Marble Platform v0.1.0')).toBeInTheDocument()
  })

  it('shows short version when collapsed', () => {
    renderSidebar(true)
    expect(screen.getByText('v0.1')).toBeInTheDocument()
  })
})
