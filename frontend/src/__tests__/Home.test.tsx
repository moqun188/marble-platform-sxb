import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Home from '../pages/Home'

function renderHome() {
  return render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>,
  )
}

describe('Home', () => {
  it('renders the title', () => {
    renderHome()
    expect(screen.getByText('Marble Knowledge Graph')).toBeInTheDocument()
  })

  it('renders the subtitle', () => {
    renderHome()
    // "1,590 micro-topics" appears in subtitle AND stats, use getAllByText
    const matches = screen.getAllByText(/1,590 micro-topics/)
    expect(matches.length).toBeGreaterThan(0)
  })

  it('renders four navigation cards', () => {
    renderHome()
    expect(screen.getByText('Browse Topics')).toBeInTheDocument()
    expect(screen.getByText('Knowledge Graph')).toBeInTheDocument()
    expect(screen.getByText('By Subject')).toBeInTheDocument()
    expect(screen.getByText('For Parents')).toBeInTheDocument()
  })

  it('navigation cards link to correct routes', () => {
    renderHome()
    expect(screen.getByText('Browse Topics').closest('a')).toHaveAttribute('href', '/topics')
    expect(screen.getByText('Knowledge Graph').closest('a')).toHaveAttribute('href', '/graph')
    expect(screen.getByText('By Subject').closest('a')).toHaveAttribute('href', '/subjects')
    expect(screen.getByText('For Parents').closest('a')).toHaveAttribute('href', '/clusters')
  })

  it('renders the stats section', () => {
    renderHome()
    // Stats appear in the bottom section
    expect(screen.getByText('Topics')).toBeInTheDocument()
    expect(screen.getByText('Dependencies')).toBeInTheDocument()
    expect(screen.getByText('Standards')).toBeInTheDocument()
  })

  it('renders stat numbers', () => {
    renderHome()
    expect(screen.getByText('1,590')).toBeInTheDocument()
    expect(screen.getByText('3,221')).toBeInTheDocument()
    expect(screen.getByText('7')).toBeInTheDocument()
  })
})
