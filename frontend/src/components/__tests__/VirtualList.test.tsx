import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { VirtualList } from '../VirtualList'

const items = Array.from({ length: 1000 }, (_, i) => ({
  id: i,
  label: `Item ${i}`,
}))

function renderList(overrides = {}) {
  const defaults = {
    items,
    itemHeight: 40,
    containerHeight: 200,
    renderItem: (item: (typeof items)[0], index: number) => (
      <div key={item.id} data-testid={`item-${item.id}`}>
        {item.label} (idx {index})
      </div>
    ),
    ...overrides,
  }
  return render(<VirtualList {...defaults} />)
}

describe('VirtualList', () => {
  it('renders only visible items (not all 1000)', () => {
    renderList()
    // container height 200 / item height 40 = 5 visible + overscan
    const rendered = screen.queryAllByTestId(/^item-/)
    expect(rendered.length).toBeLessThan(1000)
    expect(rendered.length).toBeGreaterThan(0)
  })

  it('renders first items initially', () => {
    renderList()
    expect(screen.getByTestId('item-0')).toBeInTheDocument()
    expect(screen.getByTestId('item-1')).toBeInTheDocument()
  })

  it('does not render items far below the viewport', () => {
    renderList()
    expect(screen.queryByTestId('item-999')).not.toBeInTheDocument()
  })

  it('renders correct items after scrolling', () => {
    const { container } = renderList()
    const scrollContainer = container.firstChild as HTMLElement

    // Scroll down: 40px * 100 = 4000px → should show items around index 100
    fireEvent.scroll(scrollContainer, { target: { scrollTop: 4000 } })

    // Item 0 should no longer be visible
    expect(screen.queryByTestId('item-0')).not.toBeInTheDocument()
    // Item 100 should be visible (4000/40 = 100)
    expect(screen.getByTestId('item-100')).toBeInTheDocument()
  })

  it('applies overscan correctly', () => {
    // overscan=10 means we render 10 extra items above and below
    renderList({ overscan: 10 })
    const rendered = screen.queryAllByTestId(/^item-/)
    // visible: 200/40 = 5, overscan: 10 above + 10 below = 25 total max
    expect(rendered.length).toBeLessThanOrEqual(25)
    expect(rendered.length).toBeGreaterThan(10)
  })

  it('handles empty items', () => {
    renderList({ items: [] })
    const rendered = screen.queryAllByTestId(/^item-/)
    expect(rendered).toHaveLength(0)
  })

  it('renders index correctly in renderItem', () => {
    renderList()
    const firstItem = screen.getByTestId('item-0')
    expect(firstItem).toHaveTextContent('idx 0')
  })
})
