import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import TopicsPage from "./pages/Topics";
import TopicDetail from "./pages/TopicDetail";
import GraphPage from "./pages/Graph";
import SubjectsPage from "./pages/Subjects";
import ClustersPage from "./pages/Clusters";
import HomeCN from "./pages/HomeCN";
import TopicsCN from "./pages/TopicsCN";
import TopicDetailCN from "./pages/TopicDetailCN";

function Layout() {
  const location = useLocation();
  const isCN = location.pathname.startsWith("/cn");

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-6">
          <Link to={isCN ? "/cn" : "/"} className="text-xl font-bold text-blue-600">
            🔮 Marble {isCN ? "知识图谱" : "Knowledge Graph"}
          </Link>
          <nav className="flex gap-4 text-sm">
            {isCN ? (
              <>
                <Link to="/cn/topics" className="text-gray-600 hover:text-blue-600">知识点</Link>
                <Link to="/cn/graph" className="text-gray-600 hover:text-blue-600">图谱</Link>
                <Link to="/cn/subjects" className="text-gray-600 hover:text-blue-600">学科</Link>
                <Link to="/cn/clusters" className="text-gray-600 hover:text-blue-600">家长</Link>
              </>
            ) : (
              <>
                <Link to="/topics" className="text-gray-600 hover:text-blue-600">Topics</Link>
                <Link to="/graph" className="text-gray-600 hover:text-blue-600">Graph</Link>
                <Link to="/subjects" className="text-gray-600 hover:text-blue-600">Subjects</Link>
                <Link to="/clusters" className="text-gray-600 hover:text-blue-600">Clusters</Link>
              </>
            )}
          </nav>
          <div className="ml-auto flex gap-2 text-sm">
            <Link to="/cn" className={`px-2 py-1 rounded ${isCN ? "bg-blue-100 text-blue-700" : "text-gray-500 hover:text-blue-600"}`}>
              中文
            </Link>
            <Link to="/" className={`px-2 py-1 rounded ${!isCN ? "bg-blue-100 text-blue-700" : "text-gray-500 hover:text-blue-600"}`}>
              EN
            </Link>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-6">
        <Routes>
          {/* English */}
          <Route path="/" element={<Home />} />
          <Route path="/topics" element={<TopicsPage />} />
          <Route path="/topic/:id" element={<TopicDetail />} />
          <Route path="/graph" element={<GraphPage />} />
          <Route path="/subjects" element={<SubjectsPage />} />
          <Route path="/clusters" element={<ClustersPage />} />
          {/* Chinese */}
          <Route path="/cn" element={<HomeCN />} />
          <Route path="/cn/topics" element={<TopicsCN />} />
          <Route path="/cn/topic/:id" element={<TopicDetailCN />} />
          <Route path="/cn/graph" element={<GraphPage />} />
          <Route path="/cn/subjects" element={<SubjectsPage />} />
          <Route path="/cn/clusters" element={<ClustersPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}
