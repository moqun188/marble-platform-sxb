# xiangbo 任务记忆

> 研发 2 — 前端 + 可视化
> 创建日期: 2026-08-31

## 个人信息
- 姓名: xiangbo
- 角色: 前端研发
- 负责模块: React 前端、知识图谱可视化、UI/UX

## 任务清单

### Phase 1: 前端框架 (Week 1-2)

#### X1 - 项目初始化 ✅ 已完成
- [x] React 19 + TypeScript + Vite 8
- [x] 项目结构搭建（components/pages/services/utils/types）
- [x] npm 包管理
- 完成时间: 2026-08-31 11:15

#### X2 - 基础 UI 框架 ✅ 已完成
- [x] Layout 组件（Header + Nav + Outlet）
- [x] React Router 路由配置（/, /topics, /graph, /subjects, /clusters）
- [x] Tailwind CSS v4 样式系统
- [x] API 服务层（axios + 完整类型定义）
- 完成时间: 2026-08-31 11:15

### Phase 2: 核心页面 (Week 3-4)

#### X3 - 主题列表页 ✅ 已完成
- [x] 筛选器：学科、类型、年龄范围、搜索
- [x] 表格展示：Name/Subject/Domain/Type/Age
- [x] 分页（Previous/Next）
- 完成时间: 2026-08-31 11:20

#### X4 - 主题详情页 ⏳ 待开始
- 需要从列表页跳转，暂未实现

### Phase 3: 可视化 (Week 5-6)

#### X5 - 知识图谱可视化 ✅ 已完成
- [x] Cytoscape.js 力导向图
- [x] 节点着色（按学科，8 色方案）
- [x] 节点大小（按 centrality）
- [x] 边样式（hard=实线, soft=虚线）
- [x] 学科筛选
- 完成时间: 2026-08-31 11:20

#### X6 - 交互功能 ✅ 已完成
- [x] 节点点击 → 路径高亮
- [x] 缩放、拖拽、平移
- [ ] 搜索定位 — 待补充
- 完成时间: 2026-08-31 11:20

### Phase 4: 补充页面 (Week 5-6)

#### X7 - 学科总览页 ✅ 已完成
- [x] 8 个学科卡片展示
- [x] 每个学科显示 topic 数量 + domains
- 完成时间: 2026-08-31 11:20

#### X8 - 领域摘要页 ✅ 已完成
- [x] parent-friendly 内容展示
- [x] 学科筛选
- [x] 卡片布局
- 完成时间: 2026-08-31 11:20

#### X9 - 课程标准对齐页 ⏳ 待开始

### Phase 5: 优化上线 (Week 7-8)

#### X10 - 响应式适配 ⏳ 部分完成
- [x] 基本响应式（Tailwind 响应式类）
- [ ] 移动端优化 — 待补充

#### X11 - 性能优化 ⏳ 待开始

#### X12 - 前端测试 ⏳ 待开始

## 进度记录

### 2026-08-31
- [x] X1 项目初始化完成（React 19 + TS + Vite 8）
- [x] X2 UI 框架完成（Layout + Router + Tailwind + API 服务）
- [x] X3 主题列表页完成（筛选 + 表格 + 分页）
- [x] X5 知识图谱可视化完成（Cytoscape.js + 着色 + 布局）
- [x] X6 交互功能完成（路径高亮 + 缩放拖拽）
- [x] X7 学科总览页完成
- [x] X8 领域摘要页完成
- [x] 前端构建 + 部署（PM2 托管，端口 5174）
- [x] Z14 联调测试通过（API 9 端点 + 前端页面）

## 技术栈
- React 19 + TypeScript 6
- Vite 8
- Tailwind CSS 4
- React Router 7
- Cytoscape.js 3.34
- Axios

## 服务端口
- 前端: http://124.222.188.198:5174
- 后端 API: http://124.222.188.198:3200
- Swagger 文档: http://124.222.188.198:3200/api/docs
