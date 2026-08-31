import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  timeout: 10000,
});

export interface Topic {
  id: string;
  type: string;
  subject: string;
  domain: string | null;
  name: string | null;
  description: string;
  ageRangeStart: number | null;
  ageRangeEnd: number | null;
  centrality: number | null;
  evidence: string[];
  assessmentPrompt: string | null;
  standards: string[];
}

export interface GraphNode {
  id: string;
  label: string;
  subject: string;
  domain: string;
  ageStart: number;
  ageEnd: number;
  type: string;
  centrality: number;
}

export interface GraphEdge {
  source: string;
  target: string;
  strength: "hard" | "soft";
  reason: string;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface Subject {
  name: string;
  count: number;
  domains: string[];
}

export interface Cluster {
  subject: string;
  domain: string;
  ageRangeStart: number;
  summary: string;
}

export async function getTopics(params?: {
  subject?: string;
  domain?: string;
  type?: string;
  ageMin?: number;
  ageMax?: number;
  q?: string;
  limit?: number;
  offset?: number;
}) {
  const { data } = await api.get("/topics", { params });
  return data as { total: number; offset: number; limit: number; data: Topic[] };
}

export async function getTopic(id: string) {
  const { data } = await api.get(`/topics/${id}`);
  return data as Topic;
}

export async function getTopicPrereqs(id: string) {
  const { data } = await api.get(`/topics/${id}/prereqs`);
  return data as (Topic & { strength: string; reason: string })[];
}

export async function getTopicUnlocks(id: string) {
  const { data } = await api.get(`/topics/${id}/unlocks`);
  return data as (Topic & { strength: string; reason: string })[];
}

export async function getTopicPath(id: string) {
  const { data } = await api.get(`/topics/${id}/path`);
  return data as Topic[];
}

export async function getSubjects() {
  const { data } = await api.get("/subjects");
  return data as Subject[];
}

export async function getClusters(subject?: string) {
  const { data } = await api.get("/clusters", { params: { subject } });
  return data as Cluster[];
}

export async function getGraph(subject?: string) {
  const { data } = await api.get("/graph", { params: { subject } });
  return data as GraphData;
}

export async function getStandards(curriculum?: string) {
  const { data } = await api.get("/standards", { params: { curriculum } });
  return data;
}