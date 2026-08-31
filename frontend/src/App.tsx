import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import Topics from './pages/Topics'
import TopicDetail from './pages/TopicDetail'
import Subjects from './pages/Subjects'
import Domains from './pages/Domains'
import Clusters from './pages/Clusters'
import Standards from './pages/Standards'

// Cytoscape.js 较大，懒加载
const Graph = lazy(() => import('./pages/Graph'))

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/topics" element={<Topics />} />
          <Route path="/topics/:id" element={<TopicDetail />} />
          <Route path="/graph" element={<Suspense fallback={<div className="flex items-center justify-center h-64 text-gray-400">加载图谱组件...</div>}><Graph /></Suspense>} />
          <Route path="/subjects" element={<Subjects />} />
          <Route path="/domains" element={<Domains />} />
          <Route path="/clusters" element={<Clusters />} />
          <Route path="/standards" element={<Standards />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
