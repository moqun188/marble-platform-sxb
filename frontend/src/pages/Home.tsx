import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="space-y-8">
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Marble Knowledge Graph
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          1,590 micro-topics across 8 subjects, connected by 3,221 prerequisite
          dependencies. Explore how children learn.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { to: "/topics", label: "Browse Topics", desc: "1,590 micro-topics", icon: "📚" },
          { to: "/graph", label: "Knowledge Graph", desc: "Interactive visualization", icon: "🔮" },
          { to: "/subjects", label: "By Subject", desc: "8 subjects", icon: "🎓" },
          { to: "/clusters", label: "For Parents", desc: "183 summaries", icon: "👨‍👩‍👧" },
        ].map((card) => (
          <Link
            key={card.to}
            to={card.to}
            className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <div className="text-3xl mb-2">{card.icon}</div>
            <h3 className="font-semibold text-gray-900">{card.label}</h3>
            <p className="text-sm text-gray-500">{card.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}