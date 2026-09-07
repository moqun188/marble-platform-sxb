import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import TopicDetail from '../pages/TopicDetail'

vi.mock('../services/api', () => ({
  fetchTopic: vi.fn(),
  fetchPrereqs: vi.fn(),
  fetchUnlocks: vi.fn(),
  fetchPath: vi.fn(),
}))

import { fetchTopic, fetchPrereqs, fetchUnlocks, fetchPath } from '../services/api'

const mockFetchTopic = vi.mocked(fetchTopic)
const mockFetchPrereqs = vi.mocked(fetchPrereqs)
const mockFetchUnlocks = vi.mocked(fetchUnlocks)
const mockFetchPath = vi.mocked(fetchPath)

const mockTopic = {
  id: 'mt_sci_0',
  name: 'Forces and Motion',
  subject: 'Science',
  domain: 'Physics',
  type: 'CONCEPTUAL',
  ageRangeStart: 6,
  ageRangeEnd: 8,
  description: 'Understand how objects move and the forces that act upon them.',
  evidence: ['Identify different types of forces', 'Predict effect of forces on objects'],
  assessmentPrompt: 'Draw a diagram showing forces on a ball.',
  centrality: 0.543,
}

function renderDetail(id = 'mt_sci_0') {
  return render(
    <MemoryRouter initialEntries={[`/topic/${id}`]}>
      <Routes>
        <Route path="/topic/:id" element={<TopicDetail />} />
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

describe('TopicDetail', () => {
  it('shows loading state initially', () => {
    mockFetchTopic.mockReturnValue(new Promise(() => {}))
    renderDetail()
    expect(screen.getByText('Loading topic...')).toBeInTheDocument()
  })

  it('renders topic name', async () => {
    renderDetail()
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Forces and Motion' })).toBeInTheDocument()
    })
  })

  it('renders subject label', async () => {
    renderDetail()
    await waitFor(() => {
      // Subject appears in the metadata area
      const subjects = screen.getAllByText('Science')
      expect(subjects.length).toBeGreaterThan(0)
    })
  })

  it('renders topic description', async () => {
    renderDetail()
    await waitFor(() => {
      expect(screen.getByText(/Understand how objects move/)).toBeInTheDocument()
    })
  })

  it('renders topic id badge', async () => {
    renderDetail()
    await waitFor(() => {
      expect(screen.getByText('mt_sci_0')).toBeInTheDocument()
    })
  })

  it('renders type label', async () => {
    renderDetail()
    await waitFor(() => {
      expect(screen.getByText('Conceptual')).toBeInTheDocument()
    })
  })

  it('renders age range', async () => {
    renderDetail()
    await waitFor(() => {
      expect(screen.getByText('6–8')).toBeInTheDocument()
    })
  })

  it('renders centrality', async () => {
    renderDetail()
    await waitFor(() => {
      expect(screen.getByText('0.543')).toBeInTheDocument()
    })
  })

  it('renders evidence items', async () => {
    renderDetail()
    await waitFor(() => {
      expect(screen.getByText('Identify different types of forces')).toBeInTheDocument()
      expect(screen.getByText('Predict effect of forces on objects')).toBeInTheDocument()
    })
  })

  it('renders assessment prompt', async () => {
    renderDetail()
    await waitFor(() => {
      expect(screen.getByText(/Draw a diagram showing forces/)).toBeInTheDocument()
    })
  })

  it('renders breadcrumb navigation', async () => {
    renderDetail()
    await waitFor(() => {
      expect(screen.getByText('Topics')).toBeInTheDocument()
    })
  })

  it('shows "Topic not found" for missing topic', async () => {
    mockFetchTopic.mockResolvedValue(null as any)
    renderDetail('mt_nonexistent')
    await waitFor(() => {
      expect(screen.getByText('Topic not found')).toBeInTheDocument()
    })
  })

  it('renders prerequisites section when prereqs exist', async () => {
    mockFetchPrereqs.mockResolvedValue([
      { id: 'mt_sci_pre', name: 'Basic Forces', subject: 'Science', domain: 'Physics', type: 'CONCEPTUAL', ageRangeStart: 4, ageRangeEnd: 6 },
    ])
    renderDetail()
    await waitFor(() => {
      expect(screen.getByText('Prerequisites (1)')).toBeInTheDocument()
      expect(screen.getByText('Basic Forces')).toBeInTheDocument()
    })
  })

  it('renders unlocks section when unlocks exist', async () => {
    mockFetchUnlocks.mockResolvedValue([
      { id: 'mt_sci_next', name: 'Advanced Forces', subject: 'Science', domain: 'Physics', type: 'CONCEPTUAL', ageRangeStart: 8, ageRangeEnd: 10 },
    ])
    renderDetail()
    await waitFor(() => {
      expect(screen.getByText('Unlocks (1)')).toBeInTheDocument()
      expect(screen.getByText('Advanced Forces')).toBeInTheDocument()
    })
  })

  it('renders learning path when path has multiple steps', async () => {
    mockFetchPath.mockResolvedValue([
      { id: 'mt_sci_0', name: 'Forces and Motion', subject: 'Science', domain: 'Physics', type: 'CONCEPTUAL', ageRangeStart: 6, ageRangeEnd: 8 },
      { id: 'mt_sci_1', name: 'Energy', subject: 'Science', domain: 'Physics', type: 'CONCEPTUAL', ageRangeStart: 8, ageRangeEnd: 10 },
    ])
    renderDetail()
    await waitFor(() => {
      expect(screen.getByText('Learning Path (2 steps)')).toBeInTheDocument()
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
