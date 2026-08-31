/** Marble 主题类型 */
export interface Topic {
  id: string
  name: string
  description?: string
  subject: string
  domain?: string
  cluster?: string
  ageRange?: string
  type?: string
  evidence?: string
  assessmentPrompt?: string
  prerequisites?: string[]
}

/** 主题列表筛选参数 */
export interface TopicFilters {
  subject?: string
  age?: string
  type?: string
  search?: string
  page?: number
  pageSize?: number
}

/** 分页响应 */
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
}

/** 学科统计 */
export interface SubjectStat {
  subject: string
  count: number
  domains?: string[]
}

/** 领域 */
export interface Domain {
  id: string
  name: string
  subject: string
  topicCount: number
}

/** 领域摘要（parent-friendly） */
export interface Cluster {
  id: string
  name: string
  description?: string
  subject: string
  ageGroups?: string[]
  topics?: string[]
}

/** 课程标准 */
export interface Standard {
  id: string
  name: string
  description?: string
  topics?: string[]
}

/** 图节点 */
export interface GraphNode {
  id: string
  label: string
  subject: string
  age?: string
  domain?: string
}

/** 图边 */
export interface GraphEdge {
  source: string
  target: string
  strength: 'hard' | 'soft'
}

/** 完整图数据 */
export interface GraphData {
  nodes: GraphNode[]
  edges: GraphEdge[]
}
