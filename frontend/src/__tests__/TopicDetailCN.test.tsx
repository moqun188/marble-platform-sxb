import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import TopicDetailCN from '../pages/TopicDetailCN'

vi.mock('../services/api', () => ({
  fetchTopic: vi.fn(),
  fetchPrereqs: vi.fn(),
  fetchUnlocks: vi.fn(),
  fetchPath: vi.fn(),
}))

vi.mock('cytoscape', () => {
  const mockCy = {
    on: vi.fn(),
    layout: vi.fn().mockReturnValue({ run: vi.fn() }),
    fit: vi.fn(),
    animate: vi.fn(),
    stop: vi.fn(),
    elements: vi.fn().mockReturnValue({ stop: vi.fn() }),
    destroy: vi.fn(),
  }
  return { default: vi.fn().mockReturnValue(mockCy) }
})

import { fetchTopic, fetchPrereqs, fetchUnlocks, fetchPath } from '../services/api'

const mockFetchTopic = vi.mocked(fetchTopic)
const mockFetchPrereqs = vi.mocked(fetchPrereqs)
const mockFetchUnlocks = vi.mocked(fetchUnlocks)
const mockFetchPath = vi.mocked(fetchPath)

const mockTopic = {
  id: 'mt_sci_0',
  name: 'Forces and Motion',
  subject: 'Science',
  domain: 'Forces & Motion',
  type: 'CONCEPTUAL',
  ageRangeStart: 6,
  ageRangeEnd: 8,
  description: 'Understand how objects move and the forces that act upon them.',
  evidence: ['Identify different types of forces', 'Predict effect of forces on objects'],
  assessmentPrompt: 'Draw a diagram showing forces on a ball.',
  centrality: 0.543,
  standards: ['ccss-math:MP.4', 'ngss-k5:PS2-1'],
}

function renderDetail(id = 'mt_sci_0') {
  return render(
    <MemoryRouter initialEntries={[`/cn/topic/${id}`]}>
      <Routes>
        <Route path="/cn/topic/:id" element={<TopicDetailCN />} />
      </Routes>
    </MemoryRouter>,
  )
}

beforeEach(() => {
  vi.clearAllMocks()
  mockFetchTopic.mockResolvedValue(mockTopic)
  mockFetchPrereqs.mockResolvedValue([])
  mockFetchUnlocks.mockResolvedValue([])
  mockFetchPath.mockResolvedValue([])
})

describe('TopicDetailCN', () => {
  it('shows loading state initially', () => {
    mockFetchTopic.mockReturnValue(new Promise(() => {}))
    renderDetail()
    expect(screen.getByText('加载中...')).toBeInTheDocument()
  })

  it('renders topic name', async () => {
    renderDetail()
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Forces and Motion' })).toBeInTheDocument()
    })
  })

  it('renders Chinese subject name', async () => {
    renderDetail()
    await waitFor(() => {
      // "科学" appears in breadcrumb + metadata, use getAllByText
      const els = screen.getAllByText('科学')
      expect(els.length).toBeGreaterThan(0)
    })
  })

  it('renders Chinese domain name', async () => {
    renderDetail()
    await waitFor(() => {
      // "力与运动" appears in metadata area
      const els = screen.getAllByText(/力与运动/)
      expect(els.length).toBeGreaterThan(0)
    })
  })

  it('renders Chinese type name', async () => {
    renderDetail()
    await waitFor(() => {
      expect(screen.getByText('概念理解')).toBeInTheDocument()
    })
  })

  it('renders topic description', async () => {
    renderDetail()
    await waitFor(() => {
      expect(screen.getByText(/Understand how objects move/)).toBeInTheDocument()
    })
  })

  it('renders topic id', async () => {
    renderDetail()
    await waitFor(() => {
      expect(screen.getByText('mt_sci_0')).toBeInTheDocument()
    })
  })

  it('renders age range in Chinese', async () => {
    renderDetail()
    await waitFor(() => {
      expect(screen.getByText(/6–8 岁/)).toBeInTheDocument()
    })
  })

  it('renders centrality as percentage', async () => {
    renderDetail()
    await waitFor(() => {
      expect(screen.getByText('54.3%')).toBeInTheDocument()
    })
  })

  it('renders evidence section in Chinese', async () => {
    renderDetail()
    await waitFor(() => {
      expect(screen.getByText('掌握证据')).toBeInTheDocument()
      expect(screen.getByText('Identify different types of forces')).toBeInTheDocument()
    })
  })

  it('renders assessment section in Chinese', async () => {
    renderDetail()
    await waitFor(() => {
      expect(screen.getByText('评估方法')).toBeInTheDocument()
    })
  })

  it('renders breadcrumb in Chinese', async () => {
    renderDetail()
    await waitFor(() => {
      expect(screen.getByText('知识点列表')).toBeInTheDocument()
    })
  })

  it('shows "未找到该知识点" for missing topic', async () => {
    mockFetchTopic.mockResolvedValue(null as any)
    renderDetail('mt_nonexistent')
    await waitFor(() => {
      expect(screen.getByText('未找到该知识点')).toBeInTheDocument()
    })
  })

  it('renders prerequisites in Chinese', async () => {
    mockFetchPrereqs.mockResolvedValue([
      { id: 'mt_sci_pre', name: 'Basic Forces', subject: 'Science', domain: 'Forces & Motion', type: 'CONCEPTUAL', ageRangeStart: 4, ageRangeEnd: 6 },
    ])
    renderDetail()
    await waitFor(() => {
      expect(screen.getByText('前置知识')).toBeInTheDocument()
      expect(screen.getByText('Basic Forces')).toBeInTheDocument()
    })
  })

  it('renders unlocks in Chinese', async () => {
    mockFetchUnlocks.mockResolvedValue([
      { id: 'mt_sci_next', name: 'Advanced Forces', subject: 'Science', domain: 'Forces & Motion', type: 'CONCEPTUAL', ageRangeStart: 8, ageRangeEnd: 10 },
    ])
    renderDetail()
    await waitFor(() => {
      expect(screen.getByText('后续知识')).toBeInTheDocument()
      expect(screen.getByText('Advanced Forces')).toBeInTheDocument()
    })
  })

  it('renders learning path in Chinese', async () => {
    mockFetchPath.mockResolvedValue([
      { id: 'mt_sci_0', name: 'Forces and Motion', subject: 'Science', domain: 'Forces & Motion', type: 'CONCEPTUAL', ageRangeStart: 6, ageRangeEnd: 8 },
      { id: 'mt_sci_1', name: 'Energy', subject: 'Science', domain: 'Forces & Motion', type: 'CONCEPTUAL', ageRangeStart: 8, ageRangeEnd: 10 },
    ])
    renderDetail()
    await waitFor(() => {
      expect(screen.getByText('学习路径')).toBeInTheDocument()
      expect(screen.getByText(/共 2 步/)).toBeInTheDocument()
    })
  })

  it('renders standards with color-coded badges', async () => {
    renderDetail()
    await waitFor(() => {
      // '课标映射' appears in metadata + section heading
      const els = screen.getAllByText('课标映射')
      expect(els.length).toBeGreaterThan(0)
      expect(screen.getByText('ccss-math:MP.4')).toBeInTheDocument()
      expect(screen.getByText('ngss-k5:PS2-1')).toBeInTheDocument()
    })
  })

  it('renders dependency graph section when prereqs exist', async () => {
    mockFetchPrereqs.mockResolvedValue([
      { id: 'mt_sci_pre', name: 'Basic Forces', subject: 'Science', domain: 'Forces & Motion', type: 'CONCEPTUAL', ageRangeStart: 4, ageRangeEnd: 6 },
    ])
    renderDetail()
    await waitFor(() => {
      expect(screen.getByText('知识依赖关系')).toBeInTheDocument()
    })
  })

  it('calls all four API functions on mount', async () => {
    renderDetail()
    await waitFor(() => {
      expect(mockFetchTopic).toHaveBeenCalledWith('mt_sci_0')
      expect(mockFetchPrereqs).toHaveBeenCalledWith('mt_sci_0')
      expect(mockFetchUnlocks).toHaveBeenCalledWith('mt_sci_0')
      expect(mockFetchPath).toHaveBeenCalledWith('mt_sci_0')
    })
  })
})
