# xiangbo 任务记忆

> 研发 2 — 前端 + 可视化
> 创建日期: 2026-08-31
> 最后更新: 2026-08-31 11:25

## 个人信息
- 姓名: xiangbo
- 角色: 前端研发
- 负责模块: React 前端、知识图谱可视化、UI/UX

## 任务清单

### Phase 1: 前端框架 (Week 1-2)

#### X1 - 项目初始化 ✅ 已完成 (2026-08-31)
- React 19 + TypeScript + Vite 8 ✅
- Tailwind CSS v4 样式系统 ✅
- React Router v7 路由配置 ✅
- 项目结构搭建 ✅
- 包管理：npm ✅
- Git 初始化 + 首次提交 ✅
- 构建验证通过 ✅
- 实际耗时: ~30min
- commit: 78d5274

#### X2 - 基础 UI 框架 ✅ 已完成 (2026-08-31)
- 布局组件（Header, Sidebar, Content）✅
- 路由配置（React Router v7）✅
- 主题/样式系统（Tailwind CSS v4 + dark mode）✅
- 侧边栏折叠/展开 ✅
- 暗色主题切换（localStorage 持久化）✅
- 面包屑导航 ✅
- 实际耗时: ~10min
- commit: 495cd7e

### Phase 2: 核心页面 (Week 3-4)

#### X3 - 主题列表页 🔶 基础完成 (2026-08-31)
- 筛选器：学科 ✅、搜索 ✅
- 表格展示 ✅
- 分页 ✅（客户端）
- Mock 数据降级 ✅
- 待联调: zhaolei Z5 API
- commit: 8e180df

#### X4 - 主题详情页 ✅ 已完成 (2026-08-31)
- 描述/Evidence/Assessment 三项信息卡片 ✅
- 前置依赖/学习路径/解锁主题 三栏布局 ✅
- Mock 数据降级 ✅
- commit: 3b50ba5

### Phase 3: 可视化 (Week 5-6)

#### X5 - 知识图谱可视化 ✅ 已完成 (2026-08-31)
- Cytoscape.js 力导向布局 (cose) ✅
- 支持 circle/concentric 布局切换 ✅
- 节点按学科着色 (8色) ✅
- hard=实线+箭头, soft=虚线 ✅
- 点击高亮邻居 + 侧边详情面板 ✅
- 搜索定位 + 学科筛选 ✅
- 缩放/拖拽/平移 ✅
- lazy import 代码分割 ✅
- commit: cf222dc

#### X6 - 交互功能 ✅ 已完成 (2026-08-31)
- 节点点击 → 高亮相邻节点 ✅ (X5)
- 路径高亮 BFS 最短路径 ✅
- 入口节点金色标记 ✅
- 路径步骤面板（起点→终点）✅
- 缩放、拖拽、平移 ✅ (X5)
- 搜索定位 ✅ (X5)
- commit: 76dede4

### Phase 4: 补充页面 (Week 5-6)

#### X7 - 学科总览页 ✅ 已完成 (2026-08-31)
- 学科统计卡片 + 进度条 ✅
- Mock 数据降级 ✅
- commit: 8e180df

#### X8 - 领域摘要页 ✅ 已完成 (2026-08-31)
- Parent-friendly 领域摘要卡片 ✅
- 学科筛选 + 年龄段标签 ✅
- 12 个领域 mock 数据 ✅
- commit: 3b50ba5

#### X9 - 课程标准对齐页 ✅ 已完成 (2026-08-31)
- 7 套国际课程标准 ✅
- 可折叠卡片 + 搜索 ✅
- 主题映射可点击跳转 ✅
- commit: 3b50ba5

### Phase 5: 优化上线 (Week 7-8)

#### X10 - 响应式适配 ⏳ 未开始
- 移动端布局
- 预估: 4h

#### X11 - 性能优化 ⏳ 未开始
- 懒加载
- 虚拟滚动（大列表）
- 预估: 3h

#### X12 - 前端测试 ⏳ 未开始
- 单元测试（Vitest）
- E2E 测试（Playwright）
- 预估: 4h

## 进度记录

### 2026-08-31
- [x] X1 完成：前端项目初始化
  - 技术栈: React 19 + TS + Vite 8 + Tailwind CSS v4 + React Router v7
  - 8 个页面，API 层，类型定义
  - commit: 78d5274
- [x] X2 完成：基础 UI 框架细化
  - 侧边栏折叠、暗色主题、面包屑
  - commit: 495cd7e
- [x] MVP 完成：完整可演示前端
  - Home 全新介绍页（Hero/数据/学科/功能/路线）
  - Graph mock 图数据 + 节点点击交互
  - Topics mock 列表 + 搜索筛选分页
  - Subjects mock 统计卡片
  - 所有页面 API 失败自动降级 mock
  - commit: 8e180df
- [x] X4+X7-X9 完成：主题详情/学科/领域/课标
  - TopicDetail: 描述+证据+评估+依赖三栏
  - Clusters: 12 个领域 + 学科筛选
  - Standards: 7 套标准 + 折叠卡片 + 主题跳转
  - commit: 3b50ba5
- [x] X5 完成：Cytoscape.js 知识图谱可视化
  - 力导向布局 + 3 种布局切换
  - 节点着色/边样式/点击高亮/搜索/筛选
  - 侧边详情面板 + 连接统计
  - 代码分割: 主包 270KB + Graph chunk 444KB
  - commit: cf222dc
- [x] X6 完成：交互功能 + 路径高亮
  - BFS 最短路径（优先 hard 边）
  - 红色高亮路径节点+边
  - 路径步骤面板（🟡→🔵→🔴）
  - 入口节点金色双线边框
  - commit: 76dede4

## 技术笔记

### 项目结构
```
marble-platform-frontend/
├── src/
│   ├── components/layout/   # Layout, Sidebar, Header
│   ├── pages/               # 8 个页面组件
│   ├── services/api.ts      # API 封装
│   ├── types/topic.ts       # TypeScript 类型
│   ├── hooks/               # 自定义 hooks (待用)
│   ├── utils/               # 工具函数 (待用)
│   ├── App.tsx              # 路由配置
│   ├── main.tsx             # 入口
│   └── index.css            # Tailwind + 全局样式
├── vite.config.ts           # Vite + Tailwind + API 代理
├── tsconfig.json
└── package.json
```

### 可视化技术选型（已确认）
- **Cytoscape.js** — 1,590 节点规模最合适
- X1 中用 Canvas 简单占位，X5 正式集成 Cytoscape.js

### 节点着色方案（按学科）
```js
const subjectColors = {
  'Science': '#4CAF50',
  'Mathematics': '#2196F3',
  'English': '#FF9800',
  'History': '#9C27B0',
  'Personal & Social Development': '#E91E63',
  'Life Skills': '#00BCD4',
  'Computing': '#607D8B',
  'Learning to Learn': '#795548',
}
```

### API 端点（后端 zhaolei 提供）
- `GET /api/topics?subject=&age=&type=` — 主题列表
- `GET /api/topics/:id` — 主题详情
- `GET /api/topics/:id/prereqs` — 前置依赖
- `GET /api/topics/:id/unlocks` — 解锁链
- `GET /api/topics/:id/path` — 学习路径
- `GET /api/subjects` — 学科统计
- `GET /api/domains` — 领域列表
- `GET /api/clusters` — 领域摘要
- `GET /api/standards` — 课程标准
- `GET /api/graph` — 完整图数据

## 服务器信息
- IP: 124.222.188.198
- 用户: ubuntu
- 密码: Simperfect123.
- 前端构建产物由 Nginx 托管
- 建议前端端口: 由 Nginx 统一代理
