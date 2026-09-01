import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import TopicsPage from "./pages/Topics";
import TopicDetail from "./pages/TopicDetail";
import GraphPage from "./pages/Graph";
import SubjectsPage from "./pages/Subjects";
import ClustersPage from "./pages/Clusters";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/topics" element={<TopicsPage />} />
          <Route path="/topic/:id" element={<TopicDetail />} />
          <Route path="/graph" element={<GraphPage />} />
          <Route path="/subjects" element={<SubjectsPage />} />
          <Route path="/clusters" element={<ClustersPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
