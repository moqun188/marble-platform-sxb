/** Marble 主题类型 */
export interface Topic {
  id: string
  name: string
  description?: string
  subject: string
  domain?: string
  cluster?: string
  ageRangeStart?: number
  ageRangeEnd?: number
  type?: string
  evidence?: string[]
  assessmentPrompt?: string
  prerequisites?: string[]
  centrality?: number
  standards?: string[]
}

/** 主题列表筛选参数 */
export interface TopicFilters {
  subject?: string
  domain?: string
  age?: string
  type?: string
  search?: string
  page?: number
  pageSize?: number
  offset?: number
  limit?: number
}

/** 分页响应 */
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  offset: number
  limit: number
}

/** 学科统计 */
export interface SubjectStat {
  name: string
  count: number
  domains?: string[]
}

/** 领域 */
export interface Domain {
  subject: string
  domain: string
  count: number
}

/** 领域摘要（parent-friendly） */
export interface Cluster {
  subject: string
  domain: string
  ageRangeStart: number
  summary: string
}

/** 课程标准 */
export interface Curriculum {
  slug: string
  name: string
  country: string
  standardCount: number
}

export interface StandardsResponse {
  curricula: Curriculum[]
}

/** 图节点 */
export interface GraphNode {
  id: string
  label: string
  subject: string
  domain?: string
  ageStart?: number
  ageEnd?: number
  type?: string
  centrality?: number
}

/** 图边 */
export interface GraphEdge {
  source: string
  target: string
  strength: 'hard' | 'soft'
  reason?: string
}

/** 完整图数据 */
export interface GraphData {
  nodes: GraphNode[]
  edges: GraphEdge[]
}
