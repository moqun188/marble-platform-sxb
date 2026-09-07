import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import StandardsPage from '../pages/Standards'

vi.mock('../services/api', () => ({
  fetchStandards: vi.fn(),
}))

import { fetchStandards } from '../services/api'
const mockFetchStandards = vi.mocked(fetchStandards)

const mockCurricula = {
  curricula: [
    { slug: 'uk-nc-2013', name: 'UK National Curriculum 2013', country: 'UK', version: '2013', topicCount: 200 },
    { slug: 'ccss-ela', name: 'Common Core State Standards ELA', country: 'US', topicCount: 150 },
    { slug: 'ccss-math', name: 'Common Core State Standards Math', country: 'US', topicCount: 180 },
    { slug: 'ngss-k5', name: 'Next Generation Science Standards K-5', country: 'US', topicCount: 120 },
  ],
}

const mockDetail = {
  slug: 'uk-nc-2013',
  name: 'UK National Curriculum 2013',
  country: 'UK',
  version: '2013',
  textIncluded: true,
  license: 'Open Government Licence v3.0',
  topics: [
    { key: 'std_1', code: 'Ma2/3.1', data: { title: 'Number bonds', description: 'Recall number bonds to 20', gradeLevel: '1', domain: 'Number' } },
    { key: 'std_2', code: 'Sc4/4.1', data: { title: 'Forces', description: 'Understand forces and motion', gradeLevel: '4', domain: 'Physics' } },
    { key: 'std_3', code: 'En3/4.1', data: { title: 'Writing', description: 'Plan and write stories', gradeLevel: '3' } },
  ],
}

function renderStandards() {
  return render(
    <MemoryRouter>
      <StandardsPage />
    </MemoryRouter>,
  )
}

beforeEach(() => {
  vi.clearAllMocks()
  // Default: list call returns curricula, detail call returns detail
  mockFetchStandards.mockImplementation((slug?: string) => {
    if (slug) return Promise.resolve(mockDetail)
    return Promise.resolve(mockCurricula)
  })
})

describe('StandardsPage', () => {
  it('shows loading state initially', () => {
    mockFetchStandards.mockReturnValue(new Promise(() => {}))
    renderStandards()
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('renders the heading', async () => {
    renderStandards()
    await waitFor(() => {
      expect(screen.getByText('Curriculum Standards')).toBeInTheDocument()
    })
  })

  it('renders subtitle', async () => {
    renderStandards()
    await waitFor(() => {
      expect(screen.getByText(/7 curriculum frameworks/)).toBeInTheDocument()
    })
  })

  it('renders curriculum cards', async () => {
    renderStandards()
    await waitFor(() => {
      expect(screen.getByText('UK National Curriculum')).toBeInTheDocument()
      expect(screen.getByText('Common Core ELA')).toBeInTheDocument()
      expect(screen.getByText('Common Core Math')).toBeInTheDocument()
      expect(screen.getByText('NGSS K-5')).toBeInTheDocument()
    })
  })

  it('renders country badges', async () => {
    renderStandards()
    await waitFor(() => {
      expect(screen.getAllByText('UK').length).toBeGreaterThan(0)
      expect(screen.getAllByText('US').length).toBeGreaterThan(0)
    })
  })

  it('renders flag icons', async () => {
    renderStandards()
    await waitFor(() => {
      expect(screen.getByText('🇬🇧')).toBeInTheDocument()
      expect(screen.getByText('📖')).toBeInTheDocument()
      expect(screen.getByText('🔢')).toBeInTheDocument()
      expect(screen.getByText('🔬')).toBeInTheDocument()
    })
  })

  it('clicking a card loads detail data', async () => {
    const user = userEvent.setup()
    renderStandards()
    await waitFor(() => {
      expect(screen.getByText('UK National Curriculum')).toBeInTheDocument()
    })

    // Click the card that contains "UK National Curriculum" (the shortName)
    const card = screen.getByText('UK National Curriculum').closest('button')!
    await user.click(card)

    await waitFor(() => {
      expect(mockFetchStandards).toHaveBeenCalledWith('uk-nc-2013')
    })
  })

  it('shows detail panel content after clicking', async () => {
    const user = userEvent.setup()
    renderStandards()
    await waitFor(() => {
      expect(screen.getByText('UK National Curriculum')).toBeInTheDocument()
    })

    const card = screen.getByText('UK National Curriculum').closest('button')!
    await user.click(card)

    // Wait for detail to load
    await waitFor(() => {
      expect(screen.getByText('Open Government Licence v3.0')).toBeInTheDocument()
    })
  })

  it('renders standards list in detail', async () => {
    const user = userEvent.setup()
    renderStandards()
    await waitFor(() => {
      expect(screen.getByText('UK National Curriculum')).toBeInTheDocument()
    })

    const card = screen.getByText('UK National Curriculum').closest('button')!
    await user.click(card)

    await waitFor(() => {
      expect(screen.getByText('Ma2/3.1')).toBeInTheDocument()
      expect(screen.getByText('Number bonds')).toBeInTheDocument()
      expect(screen.getByText('Sc4/4.1')).toBeInTheDocument()
      expect(screen.getByText('Forces')).toBeInTheDocument()
    })
  })

  it('renders search within standards', async () => {
    const user = userEvent.setup()
    renderStandards()
    await waitFor(() => {
      expect(screen.getByText('UK National Curriculum')).toBeInTheDocument()
    })

    const card = screen.getByText('UK National Curriculum').closest('button')!
    await user.click(card)

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Search 3 standards/)).toBeInTheDocument()
      expect(screen.getByText('3 results')).toBeInTheDocument()
    })
  })

  it('filters standards by search', async () => {
    const user = userEvent.setup()
    renderStandards()
    await waitFor(() => {
      expect(screen.getByText('UK National Curriculum')).toBeInTheDocument()
    })

    const card = screen.getByText('UK National Curriculum').closest('button')!
    await user.click(card)

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Search 3 standards/)).toBeInTheDocument()
    })

    const searchInput = screen.getByPlaceholderText(/Search 3 standards/)
    await user.type(searchInput, 'Number')

    await waitFor(() => {
      expect(screen.getByText('1 results')).toBeInTheDocument()
      expect(screen.getByText('Number bonds')).toBeInTheDocument()
      expect(screen.queryByText('Forces')).not.toBeInTheDocument()
    })
  })

  it('renders grade/domain tags', async () => {
    const user = userEvent.setup()
    renderStandards()
    await waitFor(() => {
      expect(screen.getByText('UK National Curriculum')).toBeInTheDocument()
    })

    const card = screen.getByText('UK National Curriculum').closest('button')!
    await user.click(card)

    await waitFor(() => {
      expect(screen.getByText('Grade 1')).toBeInTheDocument()
      expect(screen.getByText('Grade 4')).toBeInTheDocument()
      expect(screen.getByText('Number')).toBeInTheDocument()
      expect(screen.getByText('Physics')).toBeInTheDocument()
    })
  })

  it('close button hides detail panel', async () => {
    const user = userEvent.setup()
    renderStandards()
    await waitFor(() => {
      expect(screen.getByText('UK National Curriculum')).toBeInTheDocument()
    })

    const card = screen.getByText('UK National Curriculum').closest('button')!
    await user.click(card)

    await waitFor(() => {
      expect(screen.getByText('Open Government Licence v3.0')).toBeInTheDocument()
    })

    const closeBtn = screen.getByText('×')
    await user.click(closeBtn)

    await waitFor(() => {
      expect(screen.queryByText('Open Government Licence v3.0')).not.toBeInTheDocument()
    })
  })

  it('shows textIncluded badge', async () => {
    const user = userEvent.setup()
    renderStandards()
    await waitFor(() => {
      expect(screen.getByText('UK National Curriculum')).toBeInTheDocument()
    })

    const card = screen.getByText('UK National Curriculum').closest('button')!
    await user.click(card)

    await waitFor(() => {
      expect(screen.getByText('Full text')).toBeInTheDocument()
    })
  })

  it('handles API error gracefully', async () => {
    mockFetchStandards.mockRejectedValue(new Error('API error'))
    renderStandards()
    await waitFor(() => {
      expect(screen.getByText('Curriculum Standards')).toBeInTheDocument()
    })
  })
})
