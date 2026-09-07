import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import App from '../App'

vi.mock('../services/api', () => ({
  fetchTopics: vi.fn().mockResolvedValue({ data: [], total: 0, offset: 0, limit: 200 }),
  fetchTopic: vi.fn().mockResolvedValue(null),
  fetchPrereqs: vi.fn().mockResolvedValue([]),
  fetchUnlocks: vi.fn().mockResolvedValue([]),
  fetchPath: vi.fn().mockResolvedValue([]),
  fetchSubjects: vi.fn().mockResolvedValue([]),
  fetchDomains: vi.fn().mockResolvedValue([]),
  fetchClusters: vi.fn().mockResolvedValue([]),
  fetchStandards: vi.fn().mockResolvedValue([]),
  fetchGraph: vi.fn().mockResolvedValue({ nodes: [], edges: [] }),
}))

describe('App routing', () => {
  it('renders home page on /', async () => {
    window.history.pushState({}, '', '/')
    render(<App />)
    await waitFor(() => {
      expect(screen.getByText('Marble Knowledge Graph')).toBeInTheDocument()
    })
  })

  it('renders EN navigation links on /', async () => {
    window.history.pushState({}, '', '/')
    render(<App />)
    // Use getByRole('link') to target the nav links specifically
    await waitFor(() => {
      expect(screen.getByRole('link', { name: 'Topics' })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'Graph' })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'Subjects' })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'Clusters' })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'Standards' })).toBeInTheDocument()
    })
  })

  it('renders language switch buttons', () => {
    window.history.pushState({}, '', '/')
    render(<App />)
    expect(screen.getByRole('link', { name: '中文' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'EN' })).toBeInTheDocument()
  })

  it('navigates to topics page', async () => {
    window.history.pushState({}, '', '/topics')
    render(<App />)
    await waitFor(() => {
      expect(screen.getByText(/Topics \(/)).toBeInTheDocument()
    })
  })

  it('renders cn routes with Chinese nav', async () => {
    window.history.pushState({}, '', '/cn')
    render(<App />)
    await waitFor(() => {
      expect(screen.getByText('知识图谱')).toBeInTheDocument()
      expect(screen.getByRole('link', { name: '知识点' })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: '图谱' })).toBeInTheDocument()
    })
  })
})
