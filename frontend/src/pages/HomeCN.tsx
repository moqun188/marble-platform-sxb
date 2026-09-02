import { Link } from "react-router-dom";

export default function HomeCN() {
  return (
    <div className="space-y-8">
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Marble 知识图谱</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          涵盖 8 大学科、1,590 个知识点，通过 3,221 条先修关系连接。
          探索孩子是如何一步步学习的。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { to: "/cn/topics", label: "知识点浏览", desc: "1,590 个微主题", icon: "📚" },
          { to: "/cn/graph", label: "知识图谱", desc: "交互式可视化", icon: "🔮" },
          { to: "/cn/subjects", label: "学科总览", desc: "8 大学科", icon: "🎓" },
          { to: "/cn/clusters", label: "家长指南", desc: "183 段简明摘要", icon: "👨‍👩‍👧" },
        ].map((card) => (
          <Link key={card.to} to={card.to}
            className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="text-3xl mb-2">{card.icon}</div>
            <h3 className="font-semibold text-gray-900">{card.label}</h3>
            <p className="text-sm text-gray-500">{card.desc}</p>
          </Link>
        ))}
      </div>

      <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
        <h2 className="font-semibold text-blue-900 mb-2">💡 什么是知识图谱？</h2>
        <p className="text-sm text-blue-800 leading-relaxed">
          知识图谱将零散的知识点用"先修关系"连接成网络。比如，孩子要学"分数加减"，
          必须先掌握"分数是什么"和"通分"。通过图谱，我们可以清晰看到每个知识点的
          <strong>前因后果</strong>，找到学习卡点的根源。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        <div className="bg-white rounded-lg shadow p-5">
          <div className="text-3xl font-bold text-blue-600">1,590</div>
          <div className="text-sm text-gray-500 mt-1">知识点</div>
        </div>
        <div className="bg-white rounded-lg shadow p-5">
          <div className="text-3xl font-bold text-green-600">3,221</div>
          <div className="text-sm text-gray-500 mt-1">先修关系</div>
        </div>
        <div className="bg-white rounded-lg shadow p-5">
          <div className="text-3xl font-bold text-purple-600">7</div>
          <div className="text-sm text-gray-500 mt-1">课程标准体系</div>
        </div>
      </div>
    </div>
  );
}
