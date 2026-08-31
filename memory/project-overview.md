# Marble Knowledge Graph Platform — 项目总览

> 整合人: 马斯克（PM）× 乔布斯（CTO）
> 整合日期: 2026-08-31 11:30
> 最后更新: 2026-08-31 11:30

---

## 项目概况

- **项目名称**: Marble Knowledge Graph Platform
- **描述**: 基于 Marble Skill Taxonomy 的知识图谱服务平台
- **仓库**: `moqun188/marble-platform-sxb`
- **技术栈**: Node.js 20 + Express (后端) / React 19 + TypeScript + Vite 8 (前端)
- **部署**: Docker (后端) / PM2 (前端)
- **服务器**: 124.222.188.198
- **后端端口**: 3200 | **前端端口**: 5174

---

## 团队

| 角色 | 姓名 | 负责模块 | 进度 |
|---|---|---|---|
| 后端研发 | zhaolei | 服务器部署、Node.js API、数据层、Docker | ✅ 14/14 完成 |
| 前端研发 | xiangbo | React 前端、知识图谱可视化、UI/UX | 🔶 9/12 完成 |

---

## 数据规模

- 1,590 微主题 (topics)
- 3,221 先修链 (dependencies)
- 3,261 课程标准 (standards)
- 183 领域摘要 (clusters)
- 8 学科 / 7 课程标准体系

---

## zhaolei 任务进度 (后端) — ✅ 全部完成

### Phase 1: 基础设施
| 任务 | 描述 | 状态 | 完成时间 |
|---|---|---|---|
| Z1 | 服务器环境准备（磁盘清理 5GB） | ✅ | 08-31 10:15 |
| Z2 | 数据导入 + 验证 | ✅ | 08-31 10:15 |
| Z3 | 项目初始化（Express + ESM） | ✅ | 08-31 10:30 |
| Z4 | 数据加载层（JSON + 内存索引 + 缓存） | ✅ | 08-31 10:30 |

### Phase 2: 核心 API
| 任务 | 描述 | 状态 | 完成时间 |
|---|---|---|---|
| Z5 | Topics API（5 个端点） | ✅ | 08-31 10:30 |
| Z6 | Dependencies API（合并到 Z5） | ✅ | 08-31 10:30 |
| Z7 | Clusters & Standards API（4 个端点） | ✅ | 08-31 10:30 |
| Z8 | Graph API（nodes+edges，适配 Cytoscape.js） | ✅ | 08-31 10:30 |

### Phase 3: 部署优化
| 任务 | 描述 | 状态 | 完成时间 |
|---|---|---|---|
| Z9 | API 文档（Swagger UI + OpenAPI） | ✅ | 08-31 10:40 |
| Z10 | Docker 部署 | ✅ | 08-31 10:45 |
| Z11 | Nginx 配置 | ⏭️ 跳过 | — |
| Z12 | 性能优化（gzip + Cache-Control） | ✅ | 08-31 10:50 |
| Z13 | 监控日志（logrotate + healthcheck） | ✅ | 08-31 10:50 |
| Z14 | 联调支持 | ✅ | 08-31 11:25 |

---

## xiangbo 任务进度 (前端) — 🔶 9/12 完成

### Phase 1: 前端框架
| 任务 | 描述 | 状态 | 完成时间 |
|---|---|---|---|
| X1 | 项目初始化（React 19 + TS + Vite 8 + Tailwind v4） | ✅ | 08-31 |
| X2 | 基础 UI 框架（布局/路由/暗色主题/面包屑） | ✅ | 08-31 |

### Phase 2: 核心页面
| 任务 | 描述 | 状态 | 完成时间 |
|---|---|---|---|
| X3 | 主题列表页（筛选/表格/分页/Mock 降级） | 🔶 基础完成 | 08-31 |
| X4 | 主题详情页（描述/依赖/路径三栏） | ✅ | 08-31 |

### Phase 3: 可视化
| 任务 | 描述 | 状态 | 完成时间 |
|---|---|---|---|
| X5 | 知识图谱可视化（Cytoscape.js 力导向布局） | ✅ | 08-31 |
| X6 | 交互功能（高亮/路径 BFS/缩放/搜索） | ✅ | 08-31 |

### Phase 4: 补充页面
| 任务 | 描述 | 状态 | 完成时间 |
|---|---|---|---|
| X7 | 学科总览页（统计卡片 + 进度条） | ✅ | 08-31 |
| X8 | 领域摘要页（parent-friendly 卡片） | ✅ | 08-31 |
| X9 | 课程标准对齐页（7 套标准 + 折叠卡片） | ✅ | 08-31 |

### Phase 5: 优化上线 — ⏳ 待开始
| 任务 | 描述 | 状态 | 预估 |
|---|---|---|---|
| X10 | 响应式适配（移动端布局） | ⏳ 未开始 | 4h |
| X11 | 性能优化（懒加载 + 虚拟滚动） | ⏳ 未开始 | 3h |
| X12 | 前端测试（Vitest + Playwright） | ⏳ 未开始 | 4h |

---

## API 端点总览

| 端点 | 方法 | 说明 | 后端 | 前端联调 |
|---|---|---|---|---|
| `/api/health` | GET | 健康检查 | ✅ | ✅ |
| `/api/topics` | GET | 主题列表（筛选/分页） | ✅ | ✅ |
| `/api/topics/:id` | GET | 主题详情 | ✅ | ✅ |
| `/api/topics/:id/prereqs` | GET | 前置依赖 | ✅ | ✅ |
| `/api/topics/:id/unlocks` | GET | 解锁链 | ✅ | ✅ |
| `/api/topics/:id/path` | GET | 学习路径 (BFS) | ✅ | ✅ |
| `/api/subjects` | GET | 学科统计 | ✅ | ✅ |
| `/api/domains` | GET | 领域列表 | ✅ | ✅ |
| `/api/clusters` | GET | 领域摘要 | ✅ | ✅ |
| `/api/standards` | GET | 课程标准 | ✅ | ✅ |
| `/api/graph` | GET | 完整图数据 | ✅ | ✅ |
| `/api/docs` | GET | Swagger UI | ✅ | ✅ |

---

## 架构总览

```
                    ┌──────────────────────────────────┐
                    │        marble-platform-sxb        │
                    └──────────────────────────────────┘
                                   │
                    ┌──────────────┴──────────────┐
                    │                             │
              ┌─────┴─────┐                ┌──────┴──────┐
              │  Backend   │                │  Frontend   │
              │  Port 3200 │                │  Port 5174  │
              └─────┬─────┘                └──────┬──────┘
                    │                             │
        ┌───────────┼───────────┐          ┌──────┼──────┐
        │           │           │          │      │      │
   ┌────┴───┐ ┌────┴───┐ ┌────┴───┐  ┌───┴──┐ ┌─┴──┐ ┌┴────┐
   │ Routes │ │Services│ │Middleware│ │Pages │ │Graph│ │ API │
   │topics  │ │ data   │ │logger   │ │  8   │ │Cytos│ │fetch│
   │ meta   │ │        │ │ error   │ │pages │ │cape │ │     │
   └────────┘ └────────┘ └────────┘  └──────┘ └────┘ └─────┘
                    │
              ┌─────┴─────┐
              │ marble-data│
              │ JSON files │
              └───────────┘
```

---

## 风险与待办

### 🔴 高优先级
1. **前端 Phase 5 未完成** — 响应式/性能/测试 (X10-X12)
2. **前端 Mock 数据降级** — X3 等页面仍使用 mock，需确认 API 联调是否真正生效

### 🟡 中优先级
3. **无单元测试** — 前后端均无测试覆盖
4. **无 rate limiting** — 公开 API 缺少限流保护
5. **Dockerfile 中 COPY .env** — 应改用环境变量注入
6. **仅 main 分支** — 无 feature branch / PR 流程

### 🟢 低优先级
7. **Cache-Control 硬编码** — 建议抽到中间件配置层
8. **无认证/鉴权** — API 完全公开
9. **数据更新机制缺失** — 上游 Taxonomy 数据无同步方案

---

## 服务器信息

- **IP**: 124.222.188.198
- **用户**: ubuntu
- **Node.js**: v20.20.2
- **Docker**: 已安装
- **PM2**: 已安装
- **端口占用**: 80, 81, 443, 3000, 3100, 3900, 5173, 6379, 8088, 8089, 8200, 8765-8769, 9000-9003
- **Marble 后端**: 3200
- **Marble 前端**: 5174

---

## 技术笔记

### Marble 数据结构
- `topics.json`: topics.topics[] — id, type, subject, domain, name, description, ageRangeStart/End, centrality, evidence[], assessmentPrompt, standards[]
- `dependencies.json`: dependencies[] — topicId, prerequisiteId, strength (hard/soft), reason
- `clusters.json`: clusters[] — subject, domain, ageRangeStart, summary
- `curriculum-standards.json`: 结构化课程标准

### 可视化方案
- **Cytoscape.js** — cose 力导向布局，支持 circle/concentric 切换
- 节点着色: 8 学科 8 色
- 边样式: hard=实线+箭头, soft=虚线
- BFS 最短路径高亮（优先 hard 边）
- 代码分割: 主包 270KB + Graph chunk 444KB

### 前端技术栈
- React 19 + TypeScript + Vite 8
- Tailwind CSS v4（暗色主题）
- React Router v7
- Cytoscape.js（可视化）


---

## 🔧 2026-08-31 Bug 修复记录

### 问题
- 前端 `http://124.222.188.198:5174/` 报错: `Uncaught TypeError: Cannot read properties of undefined (reading 'map')`

### 根因
- `static-server.js` 没有配置 API 代理
- 前端请求 `/api/subjects` 等端点时，静态服务器返回 `index.html` 而非 JSON
- 组件对 HTML 字符串调用 `.map()` 导致崩溃

### 修复
1. 使用原生 `http` 模块在 `static-server.js` 中添加 `/api` → `http://127.0.0.1:3200` 代理
2. PM2 重启 `marble-frontend`

### 验证
- `/api/health` → `{"status":"ok","topics":1590}` ✅
- `/api/subjects` → 8 subjects ✅
- `/api/graph` → 1590 nodes, 3221 edges ✅
- 前端页面正常加载 ✅
