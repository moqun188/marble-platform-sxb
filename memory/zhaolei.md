# zhaolei 任务记忆

> 研发 1 — 后端 + 基础设施
> 创建日期: 2026-08-31

## 个人信息
- 姓名: zhaolei
- 角色: 后端研发
- 负责模块: 服务器部署、Node.js API、数据层、Docker 部署

## 任务清单

### Phase 1: 基础设施 (Week 1-2)

#### Z1 - 服务器环境准备 ⏳ 未开始
- 清理磁空间（当前仅剩 6.1GB）
- 安装项目依赖
- 创建项目目录 `/home/ubuntu/marble-platform/`
- 预估: 2h

#### Z2 - 数据导入 ⏳ 未开始
- Clone Marble 仓库: `https://github.com/withmarbleapp/os-taxonomy`
- 验证数据完整性（1,590 topics, 3,221 deps）
- 运行 `node scripts/validate.mjs` 验证
- 预估: 1h

#### Z3 - 项目初始化 ⏳ 未开始
- Node.js + Express 框架
- 项目结构搭建
- 环境配置（.env）
- 预估: 3h

#### Z4 - 数据加载层 ⏳ 未开始
- JSON 文件解析
- 内存索引构建（Map<id, topic>）
- 依赖关系索引（prereqMap, unlockMap）
- 预估: 4h

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
- [ ] 任务分配完成，等待开始

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
