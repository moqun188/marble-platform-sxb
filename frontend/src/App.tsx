import { useState } from "react";
import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";

const Home = lazy(() => import("./pages/Home"));
const TopicsPage = lazy(() => import("./pages/Topics"));
const TopicDetail = lazy(() => import("./pages/TopicDetail"));
const GraphPage = lazy(() => import("./pages/Graph"));
const SubjectsPage = lazy(() => import("./pages/Subjects"));
const ClustersPage = lazy(() => import("./pages/Clusters"));
const HomeCN = lazy(() => import("./pages/HomeCN"));
const TopicsCN = lazy(() => import("./pages/TopicsCN"));
const StandardsPage = lazy(() => import("./pages/Standards"));
const StandardsCN = lazy(() => import("./pages/StandardsCN"));
const TopicDetailCN = lazy(() => import("./pages/TopicDetailCN"));

function Loading() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <span className="ml-3 text-gray-500">Loading...</span>
    </div>
  );
}

function Layout() {
  const location = useLocation();
  const isCN = location.pathname.startsWith("/cn");
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = isCN
    ? [
        { to: "/cn/topics", label: "知识点" },
        { to: "/cn/graph", label: "图谱" },
        { to: "/cn/subjects", label: "学科" },
        { to: "/cn/clusters", label: "家长" },
        { to: "/cn/standards", label: "课标" },
      ]
    : [
        { to: "/topics", label: "Topics" },
        { to: "/graph", label: "Graph" },
        { to: "/subjects", label: "Subjects" },
        { to: "/clusters", label: "Clusters" },
        { to: "/standards", label: "Standards" },
      ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
          {/* Logo */}
          <Link to={isCN ? "/cn" : "/"} className="text-lg sm:text-xl font-bold text-blue-600 shrink-0">
            {isCN ? "知识图谱" : "Marble"}
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex gap-4 text-sm">
            {navLinks.map((l) => (
              <Link key={l.to} to={l.to} className="text-gray-600 hover:text-blue-600 transition-colors">
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Language switch */}
          <div className="hidden sm:flex gap-1 text-sm">
            <Link to="/cn" className={`px-2 py-1 rounded transition-colors ${isCN ? "bg-blue-100 text-blue-700" : "text-gray-500 hover:text-blue-600"}`}>
              中文
            </Link>
            <Link to="/" className={`px-2 py-1 rounded transition-colors ${!isCN ? "bg-blue-100 text-blue-700" : "text-gray-500 hover:text-blue-600"}`}>
              EN
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-gray-600 hover:text-blue-600"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t bg-white px-4 py-3 space-y-2">
            {navLinks.map((l) => (
              <Link key={l.to} to={l.to}
                onClick={() => setMenuOpen(false)}
                className="block py-2 text-gray-700 hover:text-blue-600 border-b border-gray-100 last:border-0">
                {l.label}
              </Link>
            ))}
            <div className="flex gap-2 pt-2">
              <Link to="/cn" onClick={() => setMenuOpen(false)}
                className={`px-3 py-1.5 rounded text-sm ${isCN ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"}`}>
                中文
              </Link>
              <Link to="/" onClick={() => setMenuOpen(false)}
                className={`px-3 py-1.5 rounded text-sm ${!isCN ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"}`}>
                EN
              </Link>
            </div>
          </div>
        )}
      </header>

      <main className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/topics" element={<TopicsPage />} />
            <Route path="/topic/:id" element={<TopicDetail />} />
            <Route path="/graph" element={<GraphPage />} />
            <Route path="/subjects" element={<SubjectsPage />} />
            <Route path="/clusters" element={<ClustersPage />} />
            <Route path="/standards" element={<StandardsPage />} />
            <Route path="/cn" element={<HomeCN />} />
            <Route path="/cn/topics" element={<TopicsCN />} />
            <Route path="/cn/topic/:id" element={<TopicDetailCN />} />
            <Route path="/cn/graph" element={<GraphPage />} />
            <Route path="/cn/subjects" element={<SubjectsPage />} />
            <Route path="/cn/clusters" element={<ClustersPage />} />
            <Route path="/cn/standards" element={<StandardsCN />} />
          </Routes>
        </Suspense>
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
