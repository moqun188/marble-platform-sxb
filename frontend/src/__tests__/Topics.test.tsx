import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import TopicsPage from '../pages/Topics'

vi.mock('../services/api', () => ({
  fetchTopics: vi.fn(),
}))

import { fetchTopics } from '../services/api'
const mockFetchTopics = vi.mocked(fetchTopics)

const mockTopicsResponse = {
  data: [
    { id: 'mt_sci_0', name: 'Forces and Motion', subject: 'Science', domain: 'Physics', type: 'CONCEPTUAL', ageRangeStart: 6, ageRangeEnd: 8 },
    { id: 'mt_sci_1', name: 'Living Things', subject: 'Science', domain: 'Biology', type: 'PROCEDURAL', ageRangeStart: 8, ageRangeEnd: 10 },
    { id: 'mt_mat_0', name: 'Number Bonds', subject: 'Mathematics', domain: 'Number', type: 'CONCEPTUAL', ageRangeStart: 4, ageRangeEnd: 6 },
  ],
  total: 3,
  offset: 0,
  limit: 200,
}

function renderTopics() {
  return render(
    <MemoryRouter>
      <TopicsPage />
    </MemoryRouter>,
  )
}

beforeEach(() => {
  mockFetchTopics.mockReset()
  mockFetchTopics.mockResolvedValue(mockTopicsResponse)
})

describe('TopicsPage', () => {
  it('renders the heading with total count', async () => {
    renderTopics()
    await waitFor(() => {
      expect(screen.getByText('Topics (3)')).toBeInTheDocument()
    })
  })

  it('renders topic names in mobile card list', async () => {
    renderTopics()
    await waitFor(() => {
      // Mobile card list (md:hidden) always renders in jsdom (no real viewport)
      // Each topic name appears as a link/text in the card
      const topicElements = screen.getAllByText('Forces and Motion')
      expect(topicElements.length).toBeGreaterThan(0)
    })
  })

  it('renders all topic names', async () => {
    renderTopics()
    await waitFor(() => {
      expect(screen.getAllByText('Forces and Motion').length).toBeGreaterThan(0)
      expect(screen.getAllByText('Living Things').length).toBeGreaterThan(0)
      expect(screen.getAllByText('Number Bonds').length).toBeGreaterThan(0)
    })
  })

  it('renders filter dropdowns', () => {
    renderTopics()
    expect(screen.getByText('All Subjects')).toBeInTheDocument()
    expect(screen.getByText('All Types')).toBeInTheDocument()
  })

  it('renders search input', () => {
    renderTopics()
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument()
  })

  it('renders pagination info', async () => {
    renderTopics()
    await waitFor(() => {
      expect(screen.getByText('1-3 of 3')).toBeInTheDocument()
    })
  })

  it('calls fetchTopics on mount', async () => {
    renderTopics()
    await waitFor(() => {
      expect(mockFetchTopics).toHaveBeenCalledTimes(1)
    })
  })

  it('shows loading state initially', () => {
    mockFetchTopics.mockReturnValue(new Promise(() => {}))
    renderTopics()
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('renders pagination buttons', async () => {
    renderTopics()
    await waitFor(() => {
      expect(screen.getByText('Previous')).toBeInTheDocument()
      expect(screen.getByText('Next')).toBeInTheDocument()
    })
  })

  it('previous button is disabled on first page', async () => {
    renderTopics()
    await waitFor(() => {
      expect(screen.getByText('Previous')).toBeDisabled()
    })
  })
})
