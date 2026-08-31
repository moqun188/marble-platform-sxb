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

### Phase 2: 核心 API (Week 3-4)

#### Z5 - Topics API ⏳ 未开始
- `GET /api/topics` — 列表 + 筛选（subject, age, type）
- `GET /api/topics/:id` — 单个详情
- 预估: 4h

#### Z6 - Dependencies API ⏳ 未开始
- `GET /api/topics/:id/prereqs` — 前置依赖
- `GET /api/topics/:id/unlocks` — 解锁链
- `GET /api/topics/:id/path` — 完整学习路径
- 预估: 6h

#### Z7 - Clusters & Standards API ⏳ 未开始
- `GET /api/clusters` — 领域摘要
- `GET /api/standards` — 课程标准
- 预估: 4h

#### Z8 - Graph API ⏳ 未开始
- `GET /api/graph` — 完整图数据（前端可视化用）
- 预估: 3h

### Phase 3: 部署优化 (Week 5-6)

#### Z9 - API 文档 ⏳ 未开始
- Swagger / OpenAPI 规范
- 预估: 3h

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
- [ ] Z5 Topics API — 待开始

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
