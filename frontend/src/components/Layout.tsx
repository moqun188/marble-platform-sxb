import { Link, Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-6">
          <Link to="/" className="text-xl font-bold text-blue-600">
            🔮 Marble Knowledge Graph
          </Link>
          <nav className="flex gap-4 text-sm">
            <Link to="/topics" className="text-gray-600 hover:text-blue-600">Topics</Link>
            <Link to="/graph" className="text-gray-600 hover:text-blue-600">Graph</Link>
            <Link to="/subjects" className="text-gray-600 hover:text-blue-600">Subjects</Link>
            <Link to="/clusters" className="text-gray-600 hover:text-blue-600">Clusters</Link>
          </nav>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}