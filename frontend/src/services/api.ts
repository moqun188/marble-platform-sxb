import type {
  Topic,
  TopicFilters,
  PaginatedResponse,
  SubjectStat,
  Domain,
  Cluster,
  GraphData,
} from '../types/topic'

const BASE = '/api'

async function get<T>(path: string, params?: Record<string, string | number | undefined>): Promise<T> {
  const url = new URL(path, window.location.origin)
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== '') url.searchParams.set(k, String(v))
    })
  }
  const res = await fetch(url.toString())
  if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText}`)
  return res.json()
}

/** 主题列表 */
export function fetchTopics(filters?: TopicFilters): Promise<PaginatedResponse<Topic>> {
  const params: Record<string, string | number | undefined> = {}
  if (filters?.subject) params.subject = filters.subject
  if (filters?.domain) params.domain = filters.domain
  if (filters?.type) params.type = filters.type
  if (filters?.search) params.search = filters.search
  if (filters?.offset !== undefined) params.offset = filters.offset
  if (filters?.limit !== undefined) params.limit = filters.limit
  return get(`${BASE}/topics`, params)
}

/** 主题详情 */
export function fetchTopic(id: string): Promise<Topic> {
  return get(`${BASE}/topics/${id}`)
}

/** 前置依赖 */
export function fetchPrereqs(id: string): Promise<Topic[]> {
  return get(`${BASE}/topics/${id}/prereqs`)
}

/** 解锁链 */
export function fetchUnlocks(id: string): Promise<Topic[]> {
  return get(`${BASE}/topics/${id}/unlocks`)
}

/** 学习路径 */
export function fetchPath(id: string): Promise<Topic[]> {
  return get(`${BASE}/topics/${id}/path`)
}

/** 学科统计 */
export function fetchSubjects(): Promise<SubjectStat[]> {
  return get(`${BASE}/subjects`)
}

/** 领域列表 */
export function fetchDomains(): Promise<Domain[]> {
  return get(`${BASE}/domains`)
}

/** 领域摘要 */
export function fetchClusters(): Promise<Cluster[]> {
  return get(`${BASE}/clusters`)
}

/** 课程标准 */
export function fetchStandards(curriculum?: string): Promise<any> {
  if (curriculum) return get(`${BASE}/standards`, { curriculum })
  return get(`${BASE}/standards`)
}

/** 完整图数据 */
export function fetchGraph(): Promise<GraphData> {
  return get(`${BASE}/graph`)
}
