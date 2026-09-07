import { describe, it, expect } from 'vitest'
import {
  generateMockGraph,
  generateMockSubjects,
  generateMockTopics,
  generateMockTopic,
  generateMockPrereqs,
  generateMockUnlocks,
  generateMockPath,
  generateMockClusters,
  generateMockStandards,
} from '../mock'

describe('generateMockGraph', () => {
  it('returns nodes and edges', () => {
    const graph = generateMockGraph()
    expect(graph.nodes.length).toBeGreaterThan(0)
    expect(graph.edges.length).toBeGreaterThan(0)
  })

  it('each node has required fields', () => {
    const { nodes } = generateMockGraph()
    for (const node of nodes) {
      expect(node.id).toBeTruthy()
      expect(node.label).toBeTruthy()
      expect(node.subject).toBeTruthy()
    }
  })

  it('edges reference valid node ids', () => {
    const { nodes, edges } = generateMockGraph()
    const nodeIds = new Set(nodes.map((n) => n.id))
    for (const edge of edges) {
      expect(nodeIds.has(edge.source)).toBe(true)
      expect(nodeIds.has(edge.target)).toBe(true)
    }
  })

  it('edge strength is hard or soft', () => {
    const { edges } = generateMockGraph()
    for (const edge of edges) {
      expect(['hard', 'soft']).toContain(edge.strength)
    }
  })

  it('has cross-subject links', () => {
    const { edges, nodes } = generateMockGraph()
    const nodeMap = new Map(nodes.map((n) => [n.id, n]))
    const crossLinks = edges.filter((e) => {
      const src = nodeMap.get(e.source)
      const tgt = nodeMap.get(e.target)
      return src && tgt && src.subject !== tgt.subject
    })
    expect(crossLinks.length).toBeGreaterThan(0)
  })
})

describe('generateMockSubjects', () => {
  it('returns 8 subjects', () => {
    const subjects = generateMockSubjects()
    expect(subjects).toHaveLength(8)
  })

  it('each subject has name, count, domains', () => {
    const subjects = generateMockSubjects()
    for (const s of subjects) {
      expect(s.name).toBeTruthy()
      expect(s.count).toBeGreaterThan(0)
      expect(s.domains!.length).toBeGreaterThan(0)
    }
  })
})

describe('generateMockTopics', () => {
  it('returns topics across all subjects', () => {
    const topics = generateMockTopics()
    expect(topics.length).toBeGreaterThan(0)
    const subjects = new Set(topics.map((t) => t.subject))
    expect(subjects.size).toBe(8)
  })

  it('each topic has required fields', () => {
    const topics = generateMockTopics()
    for (const t of topics) {
      expect(t.id).toMatch(/^mt_/)
      expect(t.name).toBeTruthy()
      expect(t.subject).toBeTruthy()
      expect(t.ageRangeStart).toBeGreaterThan(0)
    }
  })
})

describe('generateMockTopic', () => {
  it('returns topic for valid id', () => {
    const topics = generateMockTopics()
    const first = topics[0]
    const found = generateMockTopic(first.id)
    expect(found).not.toBeNull()
    expect(found!.id).toBe(first.id)
    expect(found!.name).toBe(first.name)
  })

  it('returns null for invalid id', () => {
    expect(generateMockTopic('nonexistent_id')).toBeNull()
  })
})

describe('generateMockPrereqs', () => {
  it('returns empty for first topic in subject', () => {
    const prereqs = generateMockPrereqs('mt_sci_0')
    expect(Array.isArray(prereqs)).toBe(true)
  })

  it('returns topics with lower id in same subject', () => {
    const prereqs = generateMockPrereqs('mt_sci_3')
    for (const p of prereqs) {
      expect(p.subject).toBe('Science')
      expect(p.id < 'mt_sci_3').toBe(true)
    }
  })

  it('returns empty for nonexistent id', () => {
    expect(generateMockPrereqs('nonexistent')).toEqual([])
  })
})

describe('generateMockUnlocks', () => {
  it('returns topics with higher id in same subject', () => {
    const unlocks = generateMockUnlocks('mt_sci_2')
    for (const u of unlocks) {
      expect(u.subject).toBe('Science')
      expect(u.id > 'mt_sci_2').toBe(true)
    }
  })

  it('returns empty for nonexistent id', () => {
    expect(generateMockUnlocks('nonexistent')).toEqual([])
  })
})

describe('generateMockPath', () => {
  it('returns a path ending at the given topic', () => {
    const path = generateMockPath('mt_sci_3')
    expect(path.length).toBeGreaterThan(0)
    expect(path[path.length - 1].id).toBe('mt_sci_3')
  })

  it('returns empty for nonexistent id', () => {
    expect(generateMockPath('nonexistent')).toEqual([])
  })
})

describe('generateMockClusters', () => {
  it('returns cluster objects with required fields', () => {
    const clusters = generateMockClusters()
    expect(clusters.length).toBeGreaterThan(0)
    for (const c of clusters) {
      expect(c.subject).toBeTruthy()
      expect(c.domain).toBeTruthy()
      expect(c.summary).toBeTruthy()
      expect(c.ageRangeStart).toBeGreaterThan(0)
    }
  })
})

describe('generateMockStandards', () => {
  it('returns 7 standards', () => {
    const standards = generateMockStandards()
    expect(standards).toHaveLength(7)
  })

  it('each standard has id and name', () => {
    const standards = generateMockStandards()
    for (const s of standards) {
      expect(s.id).toBeTruthy()
      expect(s.name).toBeTruthy()
    }
  })
})
