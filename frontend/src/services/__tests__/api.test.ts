import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  fetchTopics,
  fetchTopic,
  fetchPrereqs,
  fetchUnlocks,
  fetchPath,
  fetchSubjects,
  fetchDomains,
  fetchClusters,
  fetchStandards,
  fetchGraph,
} from '../api'

const mockFetch = vi.fn()
globalThis.fetch = mockFetch as typeof fetch

function mockJsonResponse(data: unknown, status = 200) {
  return Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    statusText: status === 200 ? 'OK' : 'Error',
    json: () => Promise.resolve(data),
  } as Response)
}

beforeEach(() => {
  mockFetch.mockReset()
})

describe('fetchTopics', () => {
  it('calls /api/topics with no params', async () => {
    const mockData = { data: [], total: 0, offset: 0, limit: 200 }
    mockFetch.mockReturnValue(mockJsonResponse(mockData))

    const result = await fetchTopics()

    expect(mockFetch).toHaveBeenCalledTimes(1)
    const url = new URL(mockFetch.mock.calls[0][0])
    expect(url.pathname).toBe('/api/topics')
    expect(result).toEqual(mockData)
  })

  it('passes filter params correctly', async () => {
    mockFetch.mockReturnValue(mockJsonResponse({ data: [], total: 0, offset: 0, limit: 50 }))

    await fetchTopics({ subject: 'Science', type: 'CONCEPTUAL', limit: 50, offset: 10 })

    const url = new URL(mockFetch.mock.calls[0][0])
    expect(url.searchParams.get('subject')).toBe('Science')
    expect(url.searchParams.get('type')).toBe('CONCEPTUAL')
    expect(url.searchParams.get('limit')).toBe('50')
    expect(url.searchParams.get('offset')).toBe('10')
  })

  it('skips undefined and empty params', async () => {
    mockFetch.mockReturnValue(mockJsonResponse({ data: [], total: 0, offset: 0, limit: 200 }))

    await fetchTopics({ subject: '', type: undefined })

    const url = new URL(mockFetch.mock.calls[0][0])
    expect(url.searchParams.has('subject')).toBe(false)
    expect(url.searchParams.has('type')).toBe(false)
  })
})

describe('fetchTopic', () => {
  it('calls /api/topics/:id', async () => {
    const topic = { id: 'mt_sci_0', name: 'Forces' }
    mockFetch.mockReturnValue(mockJsonResponse(topic))

    const result = await fetchTopic('mt_sci_0')

    const url = new URL(mockFetch.mock.calls[0][0])
    expect(url.pathname).toBe('/api/topics/mt_sci_0')
    expect(result).toEqual(topic)
  })
})

describe('fetchPrereqs', () => {
  it('calls /api/topics/:id/prereqs', async () => {
    mockFetch.mockReturnValue(mockJsonResponse([]))

    await fetchPrereqs('mt_sci_0')

    const url = new URL(mockFetch.mock.calls[0][0])
    expect(url.pathname).toBe('/api/topics/mt_sci_0/prereqs')
  })
})

describe('fetchUnlocks', () => {
  it('calls /api/topics/:id/unlocks', async () => {
    mockFetch.mockReturnValue(mockJsonResponse([]))

    await fetchUnlocks('mt_sci_0')

    const url = new URL(mockFetch.mock.calls[0][0])
    expect(url.pathname).toBe('/api/topics/mt_sci_0/unlocks')
  })
})

describe('fetchPath', () => {
  it('calls /api/topics/:id/path', async () => {
    mockFetch.mockReturnValue(mockJsonResponse([]))

    await fetchPath('mt_sci_0')

    const url = new URL(mockFetch.mock.calls[0][0])
    expect(url.pathname).toBe('/api/topics/mt_sci_0/path')
  })
})

describe('fetchSubjects', () => {
  it('calls /api/subjects', async () => {
    const subjects = [{ name: 'Science', count: 100 }]
    mockFetch.mockReturnValue(mockJsonResponse(subjects))

    const result = await fetchSubjects()

    const url = new URL(mockFetch.mock.calls[0][0])
    expect(url.pathname).toBe('/api/subjects')
    expect(result).toEqual(subjects)
  })
})

describe('fetchDomains', () => {
  it('calls /api/domains', async () => {
    mockFetch.mockReturnValue(mockJsonResponse([]))

    await fetchDomains()

    const url = new URL(mockFetch.mock.calls[0][0])
    expect(url.pathname).toBe('/api/domains')
  })
})

describe('fetchClusters', () => {
  it('calls /api/clusters', async () => {
    mockFetch.mockReturnValue(mockJsonResponse([]))

    await fetchClusters()

    const url = new URL(mockFetch.mock.calls[0][0])
    expect(url.pathname).toBe('/api/clusters')
  })
})

describe('fetchStandards', () => {
  it('calls /api/standards without curriculum', async () => {
    mockFetch.mockReturnValue(mockJsonResponse([]))

    await fetchStandards()

    const url = new URL(mockFetch.mock.calls[0][0])
    expect(url.pathname).toBe('/api/standards')
    expect(url.searchParams.has('curriculum')).toBe(false)
  })

  it('calls /api/standards with curriculum param', async () => {
    mockFetch.mockReturnValue(mockJsonResponse([]))

    await fetchStandards('uk-nc')

    const url = new URL(mockFetch.mock.calls[0][0])
    expect(url.searchParams.get('curriculum')).toBe('uk-nc')
  })
})

describe('fetchGraph', () => {
  it('calls /api/graph', async () => {
    const graph = { nodes: [], edges: [] }
    mockFetch.mockReturnValue(mockJsonResponse(graph))

    const result = await fetchGraph()

    const url = new URL(mockFetch.mock.calls[0][0])
    expect(url.pathname).toBe('/api/graph')
    expect(result).toEqual(graph)
  })
})

describe('error handling', () => {
  it('throws on non-ok response', async () => {
    mockFetch.mockReturnValue(mockJsonResponse(null, 404))

    await expect(fetchTopic('bad_id')).rejects.toThrow('API 404: Error')
  })

  it('throws on 500 response', async () => {
    mockFetch.mockReturnValue(mockJsonResponse(null, 500))

    await expect(fetchTopics()).rejects.toThrow('API 500: Error')
  })
})
