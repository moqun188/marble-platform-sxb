import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import Graph from '../pages/Graph'

// Mock Cytoscape - factory must be self-contained (hoisted)
vi.mock('cytoscape', () => {
  const mockCyInstance = {
    nodes: vi.fn().mockReturnValue({
      length: 3,
      filter: vi.fn().mockReturnValue([]),
      forEach: vi.fn(),
      map: vi.fn().mockReturnValue(['Science', 'Mathematics']),
    }),
    edges: vi.fn().mockReturnValue({
      length: 2,
      forEach: vi.fn(),
    }),
    elements: vi.fn().mockReturnValue({
      addClass: vi.fn(),
      removeClass: vi.fn(),
    }),
    $id: vi.fn().mockReturnValue({
      length: 1,
      incomers: vi.fn().mockReturnValue({
        sources: vi.fn().mockReturnValue({ length: 0 }),
      }),
      outgoers: vi.fn().mockReturnValue({
        targets: vi.fn().mockReturnValue({ length: 0 }),
      }),
    }),
    collection: vi.fn().mockReturnValue({ merge: vi.fn() }),
    on: vi.fn(),
    layout: vi.fn().mockReturnValue({ run: vi.fn() }),
    fit: vi.fn(),
    animate: vi.fn(),
    stop: vi.fn(),
    destroy: vi.fn(),
  }
  return { default: vi.fn().mockReturnValue(mockCyInstance) }
})

vi.mock('../services/api', () => ({
  fetchGraph: vi.fn().mockResolvedValue({
    nodes: [
      { id: 'mt_sci_0', label: 'Forces', subject: 'Science', ageStart: 6, ageEnd: 8 },
      { id: 'mt_sci_1', label: 'Energy', subject: 'Science', ageStart: 8, ageEnd: 10 },
      { id: 'mt_mat_0', label: 'Number Bonds', subject: 'Mathematics', ageStart: 4, ageEnd: 6 },
    ],
    edges: [
      { source: 'mt_sci_0', target: 'mt_sci_1', strength: 'hard' },
      { source: 'mt_mat_0', target: 'mt_sci_0', strength: 'soft' },
    ],
  }),
}))

vi.mock('../services/mock', () => ({
  generateMockGraph: vi.fn().mockReturnValue({
    nodes: [
      { id: 'mt_sci_0', label: 'Forces', subject: 'Science', ageStart: 6, ageEnd: 8 },
      { id: 'mt_mat_0', label: 'Number Bonds', subject: 'Mathematics', ageStart: 4, ageEnd: 6 },
    ],
    edges: [
      { source: 'mt_mat_0', target: 'mt_sci_0', strength: 'hard' },
    ],
  }),
}))

function renderGraph() {
  return render(
    <MemoryRouter>
      <Graph />
    </MemoryRouter>,
  )
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('Graph Page', () => {
  it('renders the heading', async () => {
    renderGraph()
    await waitFor(() => {
      expect(screen.getByText('知识图谱')).toBeInTheDocument()
    })
  })

  it('renders search input', async () => {
    renderGraph()
    await waitFor(() => {
      expect(screen.getByPlaceholderText('🔍 搜索节点...')).toBeInTheDocument()
    })
  })

  it('renders layout selector options', async () => {
    renderGraph()
    await waitFor(() => {
      expect(screen.getByText('力导向布局')).toBeInTheDocument()
      expect(screen.getByText('环形布局')).toBeInTheDocument()
      expect(screen.getByText('同心圆布局')).toBeInTheDocument()
      expect(screen.getByText('网格布局')).toBeInTheDocument()
    })
  })

  it('renders action buttons', async () => {
    renderGraph()
    await waitFor(() => {
      expect(screen.getByText(/重新布局/)).toBeInTheDocument()
      expect(screen.getByText(/重置视图/)).toBeInTheDocument()
    })
  })

  it('renders subject filter buttons', async () => {
    renderGraph()
    await waitFor(() => {
      expect(screen.getByText('Science')).toBeInTheDocument()
      expect(screen.getByText('Mathematics')).toBeInTheDocument()
    })
  })

  it('renders node/edge count', async () => {
    renderGraph()
    await waitFor(() => {
      expect(screen.getByText(/3 节点.*2 边/)).toBeInTheDocument()
    })
  })

  it('renders help tips', async () => {
    renderGraph()
    await waitFor(() => {
      expect(screen.getByText(/点击节点高亮关联/)).toBeInTheDocument()
    })
  })

  it('loads data from API on mount', async () => {
    const { fetchGraph } = await import('../services/api')
    renderGraph()
    await waitFor(() => {
      expect(fetchGraph).toHaveBeenCalledTimes(1)
    })
  })

  it('falls back to mock data on API error', async () => {
    const { fetchGraph } = await import('../services/api')
    const { generateMockGraph } = await import('../services/mock')
    vi.mocked(fetchGraph).mockRejectedValueOnce(new Error('Network error'))

    renderGraph()
    await waitFor(() => {
      expect(generateMockGraph).toHaveBeenCalled()
      expect(screen.getByText(/演示数据/)).toBeInTheDocument()
    })
  })

  it('allows typing in search input', async () => {
    const user = userEvent.setup()
    renderGraph()
    await waitFor(() => {
      expect(screen.getByPlaceholderText('🔍 搜索节点...')).toBeInTheDocument()
    })

    const input = screen.getByPlaceholderText('🔍 搜索节点...')
    await user.type(input, 'Forces')
    expect(input).toHaveValue('Forces')
  })

  it('allows changing layout', async () => {
    const user = userEvent.setup()
    renderGraph()
    await waitFor(() => {
      expect(screen.getByText('力导向布局')).toBeInTheDocument()
    })

    const select = screen.getByDisplayValue('网格布局')
    await user.selectOptions(select, 'cose')
    expect(select).toHaveValue('cose')
  })

  it('subject filter buttons are clickable', async () => {
    const user = userEvent.setup()
    renderGraph()
    await waitFor(() => {
      expect(screen.getByText('Science')).toBeInTheDocument()
    })

    await user.click(screen.getByText('Science'))
    expect(screen.getByText('Science')).toBeInTheDocument()
  })

  it('reset button is clickable', async () => {
    const user = userEvent.setup()
    renderGraph()
    await waitFor(() => {
      expect(screen.getByText(/重置视图/)).toBeInTheDocument()
    })

    await user.click(screen.getByText(/重置视图/))
  })

  it('re-layout button is clickable', async () => {
    const user = userEvent.setup()
    renderGraph()
    await waitFor(() => {
      expect(screen.getByText(/重新布局/)).toBeInTheDocument()
    })

    await user.click(screen.getByText(/重新布局/))
  })
})
