# zhaolei 任务记忆

> 研发 1 — 后端 + 基础设施
> 创建日期: 2026-08-31

## 个人信息
- 姓名: zhaolei
- 角色: 后端研发
- 负责模块: 服务器部署、Node.js API、数据层、Docker 部署

## 任务清单

### Phase 1: 基础设施 (Week 1-2)

#### Z1 - 服务器环境准备 ✅ 已完成
- [x] 磁盘清理：释放 5GB（6.1GB→11GB 可用），journal logs + Docker build cache + old syslog
- [x] Node.js v20.20.2 确认可用
- [x] Docker / PM2 确认可用
- [x] 创建项目目录 `/home/ubuntu/marble-platform/`
- 完成时间: 2026-08-31 10:15

#### Z2 - 数据导入 ✅ 已完成
- [x] Clone Marble 仓库: `https://github.com/withmarbleapp/os-taxonomy`
- [x] 数据文件就位（topics/deps/clusters/standards 4 个 JSON）
- [x] `node scripts/validate.mjs` 验证通过：✓ 1590 topics, 3221 deps, 3261 standards, 183 clusters
- [x] Referential integrity + checksums OK
- 完成时间: 2026-08-31 10:15

#### Z3 - 项目初始化 ✅ 已完成
- [x] Express 框架 + ESM 模块
- [x] `.env` 配置（PORT, NODE_ENV, LOG_LEVEL, CORS_ORIGIN）
- [x] 项目结构拆分：routes/ services/ middleware/ utils/
- [x] 错误处理中间件 + 请求日志中间件
- [x] dotenv 依赖安装
- [x] PM2 托管运行正常
- 完成时间: 2026-08-31 10:30

#### Z4 - 数据加载层 ✅ 已完成
- [x] JSON 文件解析（topics/deps/clusters/standards）
- [x] 内存索引 Map<id, topic>
- [x] 依赖关系索引 prereqMap + unlockMap
- [x] 数据服务层 services/data.js（按需加载 + 缓存）
- [x] 加载耗时日志输出
- 完成时间: 2026-08-31 10:30

### Phase 2: 核心 API (Week 3-4) — 已在 Z3/Z4 阶段完成

#### Z5 - Topics API ✅ 已完成
- [x] `GET /api/topics` — 列表 + 筛选（subject, domain, type, ageMin, ageMax, q, limit, offset）
- [x] `GET /api/topics/:id` — 单个详情
- [x] `GET /api/topics/:id/prereqs` — 前置依赖链
- [x] `GET /api/topics/:id/unlocks` — 解锁的后续主题
- [x] `GET /api/topics/:id/path` — BFS 学习路径
- 路由文件: `backend/src/routes/topics.js`
- 完成时间: 2026-08-31 10:30

#### Z6 - Dependencies API ✅ 已完成
- 合并到 Z5 Topics API 中（prereqs/unlocks/path）
- 完成时间: 2026-08-31 10:30

#### Z7 - Clusters & Standards API ✅ 已完成
- [x] `GET /api/clusters` — 领域摘要（支持 subject/domain 筛选）
- [x] `GET /api/standards` — 课程标准（支持 curriculum 筛选）
- [x] `GET /api/subjects` — 学科统计
- [x] `GET /api/domains` — 领域列表
- 路由文件: `backend/src/routes/meta.js`
- 完成时间: 2026-08-31 10:30

#### Z8 - Graph API ✅ 已完成
- [x] `GET /api/graph` — 完整图数据（支持 subject 筛选，前端可视化用）
- 返回 nodes[] + edges[] 格式，适配 Cytoscape.js
- 完成时间: 2026-08-31 10:30

### Phase 3: 部署优化 (Week 5-6)

#### Z9 - API 文档 ✅ 已完成
- [x] OpenAPI 3.0 规范 (`openapi.yaml`) — 完整 11 个端点定义
- [x] Swagger UI 集成 — `GET /api/docs` 交互式文档
- [x] 静态文档 `docs/api.md` — 端点速查 + 数据模型 + 示例
- [x] swagger-ui-express + yamljs 依赖
- 完成时间: 2026-08-31 10:40

#### Z10 - Docker 部署 ⏳ 未开始
- Dockerfile
- docker-compose.yml
- 预估: 3h

#### Z11 - Nginx 配置 ⏳ 未开始
- 反向代理
- 静态资源托管
- 预估: 2h

#### Z12 - 性能优化 ⏳ 未开始
- 缓存策略
- gzip 压缩
- 预估: 2h

#### Z13 - 监控日志 ⏳ 未开始
- 预估: 2h

#### Z14 - 联调支持 ⏳ 未开始
- 与 xiangbo 前端联调
- 预估: 4h

## 进度记录

### 2026-08-31
- [x] Z1 服务器环境准备完成（磁盘清理 5GB）
- [x] Z2 数据导入完成 + 验证通过
- [x] Z3 项目初始化完成（Express + 结构拆分 + .env）
- [x] Z4 数据加载层完成（JSON解析 + 内存索引 + 缓存）
- [x] Z5 Topics API 完成（5 个端点：list/detail/prereqs/unlocks/path）
- [x] Z6 Dependencies API 完成（合并到 Z5）
- [x] Z7 Clusters & Standards API 完成（4 个端点：clusters/standards/subjects/domains）
- [x] Z8 Graph API 完成（nodes+edges 格式，适配 Cytoscape.js）
- [x] Z9 API 文档完成（Swagger UI + OpenAPI 规范 + 静态文档）
- [ ] Z10 Docker 部署 — 待开始

## 技术笔记

### Marble 数据结构速查
- topics.json: `topics.topics[]` — 每个 topic 有 id, type, subject, domain, name, description, ageRangeStart/End, centrality, evidence[], assessmentPrompt, standards[]
- dependencies.json: `dependencies[]` — 每个 dep 有 topicId, prerequisiteId, strength (hard/soft), reason
- clusters.json: `clusters[]` — subject, domain, ageRangeStart, summary
- curriculum-standards.json: 结构化课程标准

### 关键 API 查询逻辑
```js
// 获取某主题的前置依赖
const prereqs = deps.filter(d => d.topicId === targetId).map(d => byId.get(d.prerequisiteId));

// 获取某主题解锁的后续
const unlocks = deps.filter(d => d.prerequisiteId === targetId).map(d => byId.get(d.topicId));

// 获取完整学习路径（BFS）
function getPath(topicId) { /* BFS from entry nodes */ }
```

## 服务器信息
- IP: 124.222.188.198
- 用户: ubuntu
- Node.js: v20.20.2
- Docker: 已安装
- PM2: 已安装
- 端口占用: 80, 81, 443, 3000, 3100, 3900, 5173, 6379, 8088, 8089, 8200, 8765-8769, 9000-9003
- 建议 Marble API 端口: 3200
