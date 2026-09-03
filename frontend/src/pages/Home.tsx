import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="text-center py-8 sm:py-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
          Marble Knowledge Graph
        </h1>
        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-2">
          1,590 micro-topics across 8 subjects, connected by 3,221 prerequisite
          dependencies. Explore how children learn.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { to: "/topics", label: "Browse Topics", desc: "1,590 micro-topics", icon: "📚" },
          { to: "/graph", label: "Knowledge Graph", desc: "Interactive visualization", icon: "🔮" },
          { to: "/subjects", label: "By Subject", desc: "8 subjects", icon: "🎓" },
          { to: "/clusters", label: "For Parents", desc: "183 summaries", icon: "👨‍👩‍👧" },
        ].map((card) => (
          <Link
            key={card.to}
            to={card.to}
            className="block p-4 sm:p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <div className="text-2xl sm:text-3xl mb-2">{card.icon}</div>
            <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{card.label}</h3>
            <p className="text-xs sm:text-sm text-gray-500">{card.desc}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3 sm:gap-4 text-center">
        <div className="bg-white rounded-lg shadow p-4 sm:p-5">
          <div className="text-2xl sm:text-3xl font-bold text-blue-600">1,590</div>
          <div className="text-xs sm:text-sm text-gray-500 mt-1">Topics</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 sm:p-5">
          <div className="text-2xl sm:text-3xl font-bold text-green-600">3,221</div>
          <div className="text-xs sm:text-sm text-gray-500 mt-1">Dependencies</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 sm:p-5">
          <div className="text-2xl sm:text-3xl font-bold text-purple-600">7</div>
          <div className="text-xs sm:text-sm text-gray-500 mt-1">Standards</div>
        </div>
      </div>
    </div>
  );
}
