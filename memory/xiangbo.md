# xiangbo 任务记忆

> 研发 2 — 前端 + 可视化
> 创建日期: 2026-08-31

## 个人信息
- 姓名: xiangbo
- 角色: 前端研发
- 负责模块: React 前端、知识图谱可视化、UI/UX

## 任务清单

### Phase 1: 前端框架 (Week 1-2)

#### X1 - 项目初始化 ⏳ 未开始
- React + TypeScript + Vite
- 项目结构搭建
- 包管理：npm/pnpm
- 预估: 3h

#### X2 - 基础 UI 框架 ⏳ 未开始
- 布局组件（Header, Sidebar, Content）
- 路由配置（React Router）
- 主题/样式系统（Tailwind CSS 或 Ant Design）
- 预估: 4h

### Phase 2: 核心页面 (Week 3-4)

#### X3 - 主题列表页 ⏳ 未开始
- 筛选器：学科、年龄、类型
- 表格展示：支持排序、搜索
- 分页
- 依赖: zhaolei Z5 API
- 预估: 6h

#### X4 - 主题详情页 ⏳ 未开始
- 基本信息展示（name, description, evidence）
- 依赖关系图（局部）
- assessmentPrompt 展示
- 依赖: zhaolei Z5 API
- 预估: 6h

### Phase 3: 可视化 (Week 5-6)

#### X5 - 知识图谱可视化 ⏳ 未开始
- 技术选型：D3.js 或 Cytoscape.js
- 力导向图布局
- 节点着色（按学科）
- 边的样式（hard=实线, soft=虚线）
- 依赖: zhaolei Z8 API
- 预估: 12h

#### X6 - 交互功能 ⏳ 未开始
- 节点点击 → 高亮相邻节点
- 路径高亮（从入口到选中节点）
- 缩放、拖拽、平移
- 搜索定位
- 预估: 8h

### Phase 4: 补充页面 (Week 5-6)

#### X7 - 学科总览页 ⏳ 未开始
- 按学科展示统计
- 领域分布图
- 预估: 4h

#### X8 - 领域摘要页 ⏳ 未开始
- parent-friendly 内容展示
- 按年龄分组
- 预估: 3h

#### X9 - 课程标准对齐页 ⏳ 未开始
- 标准列表 + 搜索
- 标准 → 主题映射
- 预估: 4h

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
- [ ] 任务分配完成，等待开始

## 技术笔记

### 可视化技术选型

**D3.js**
- 优点：极致灵活，自定义能力强
- 缺点：学习曲线陡，代码量大

**Cytoscape.js**
- 优点：图论专用，内置布局算法，API 简洁
- 缺点：样式自定义不如 D3 灵活

**建议**：1,590 节点规模，Cytoscape.js 更合适。如果需要高度定制再考虑 D3。

### 图数据格式
```js
// Cytoscape.js 格式
const elements = [
  // nodes
  { data: { id: 'mt_xxx', label: 'Building sentences', subject: 'English', age: '4-6' } },
  // edges
  { data: { source: 'mt_xxx', target: 'mt_yyy', strength: 'hard' } }
];
```

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
};
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
- 前端构建产物由 Nginx 托管
- 建议前端端口: 由 Nginx 统一代理
