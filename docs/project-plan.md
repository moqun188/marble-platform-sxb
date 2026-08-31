# Marble 知识图谱平台 — 专家评审与任务排期

> 评审日期: 2026-08-31
> 参与专家: 产品专家、项目专家、技术专家
> 服务器: 124.222.188.198 (Ubuntu, 3.6GB RAM, 40GB Disk)

---

## 一、产品专家评审

### 产品定位
Marble 知识图谱是一个面向 K-12 教育的结构化知识网络，核心价值在于：
- **知识依赖可视化**：将 1,590 个微主题通过 3,221 条先修链连接成 DAG 图
- **学习路径诊断**：帮助教师/家长定位学生知识断层
- **AI 教育底座**：为智能教育产品提供标准化知识结构

### 目标用户
1. **教师**：诊断学生知识断层，定制教学方案
2. **家长**：追踪孩子学习卡点，避免无效练习
3. **开发者**：基于知识图谱构建 AI 教育工具
4. **教研机构**：优化课程设计，建立能力进阶体系

### 产品形态建议
- **Phase 1**：REST API 服务 — 提供知识查询、依赖链追溯、标准映射
- **Phase 2**：Web 可视化 — 交互式知识图谱浏览（参考 withmarble.com/curriculum）
- **Phase 3**：智能诊断 — 输入学生表现，输出知识断层分析

---

## 二、项目专家评审

### 项目规模
- 数据量：4 个 JSON 文件，总计约 4MB
- 复杂度：中等（数据已结构化，核心是 API 设计 + 前端可视化）
- 团队：2 名研发（zhaolei + xiangbo）
- 周期：建议 2 个月（8 周）

### 里程碑规划

| 阶段 | 周次 | 里程碑 | 负责人 |
|---|---|---|---|
| M1: 基础设施 | W1-W2 | 服务器部署 + 数据导入 + 基础 API | zhaolei |
| M2: 核心 API | W3-W4 | 完整 REST API + 文档 | zhaolei |
| M3: 前端框架 | W3-W4 | 前端项目搭建 + 基础组件 | xiangbo |
| M4: 可视化 | W5-W6 | 交互式知识图谱可视化 | xiangbo |
| M5: 集成测试 | W7 | 前后端联调 + 性能优化 | zhaolei + xiangbo |
| M6: 上线 | W8 | 部署上线 + 文档完善 | zhaolei + xiangbo |

### 风险评估
- **磁盘空间**：仅剩 6.1GB，需清理或扩容
- **内存**：3.6GB 偏低，Node.js 服务需控制内存占用
- **xswitch 停止影响**：已停止，需确认无业务依赖

---

## 三、技术专家评审

### 技术架构建议

```
┌─────────────────────────────────────────────┐
│                   Nginx (81/443)            │
│              反向代理 + 静态资源              │
├──────────────────┬──────────────────────────┤
│   Marble API     │    Marble Web UI         │
│   Node.js        │    React/Vue + D3.js     │
│   Port: 3200     │    构建产物由 Nginx 托管   │
├──────────────────┴──────────────────────────┤
│              Marble Data Layer              │
│         JSON 文件 + 内存缓存 (Map)           │
└─────────────────────────────────────────────┘
```

### 技术栈选型
- **后端**: Node.js 20 + Express/Koa（服务器已有 Node.js 20）
- **前端**: React + D3.js / Cytoscape.js（图可视化）
- **部署**: Docker（服务器已有 Docker）或 PM2
- **缓存**: 内存 Map（数据量小，无需 Redis）

### API 设计建议

| 端点 | 方法 | 说明 |
|---|---|---|
| `/api/topics` | GET | 列表/筛选（subject, age, type） |
| `/api/topics/:id` | GET | 单个主题详情 |
| `/api/topics/:id/prereqs` | GET | 前置依赖链 |
| `/api/topics/:id/unlocks` | GET | 解锁的后续主题 |
| `/api/topics/:id/path` | GET | 从入口到该主题的完整路径 |
| `/api/subjects` | GET | 学科列表 + 统计 |
| `/api/domains` | GET | 领域列表 |
| `/api/clusters` | GET | 领域摘要（parent-friendly） |
| `/api/standards` | GET | 课程标准查询 |
| `/api/graph` | GET | 完整图数据（前端可视化用） |

### 数据安全
- 数据为 ODbL 开源许可，可公开访问
- 无需认证（公开数据），但建议加 rate limit
- 备份策略：每日 JSON 文件快照

---

## 四、任务分解与分配

### 研发 1 — zhaolei（后端 + 基础设施）

| # | 任务 | 优先级 | 预估工时 | 依赖 |
|---|---|---|---|---|
| Z1 | 服务器环境准备：安装依赖、清理磁盘、创建项目目录 | P0 | 2h | 无 |
| Z2 | Clone Marble 仓库到服务器 + 数据验证 | P0 | 1h | Z1 |
| Z3 | Node.js 项目初始化：Express 框架、项目结构、配置 | P0 | 3h | Z2 |
| Z4 | 数据加载层：JSON 解析、内存索引构建、Map 缓存 | P0 | 4h | Z3 |
| Z5 | Topics API：CRUD + 筛选（subject/age/type） | P0 | 4h | Z4 |
| Z6 | Dependencies API：前置依赖、解锁链、路径查询 | P0 | 6h | Z4 |
| Z7 | Clusters & Standards API | P1 | 4h | Z4 |
| Z8 | Graph API：完整图数据输出（前端用） | P1 | 3h | Z4 |
| Z9 | API 文档（Swagger/OpenAPI） | P1 | 3h | Z5-Z8 |
| Z10 | Docker 部署配置（Dockerfile + docker-compose） | P1 | 3h | Z3 |
| Z11 | Nginx 反向代理配置 | P1 | 2h | Z10 |
| Z12 | 性能优化：缓存策略、gzip 压缩 | P2 | 2h | Z11 |
| Z13 | 监控与日志 | P2 | 2h | Z11 |
| Z14 | 前后端联调支持 | P0 | 4h | Z5-Z8 |
| **合计** | | | **43h** | |

### 研发 2 — xiangbo（前端 + 可视化）

| # | 任务 | 优先级 | 预估工时 | 依赖 |
|---|---|---|---|---|
| X1 | 前端项目初始化：React + TypeScript + Vite | P0 | 3h | Z3 |
| X2 | 基础 UI 框架：布局、路由、主题 | P0 | 4h | X1 |
| X3 | 主题列表页：筛选器（学科/年龄/类型）+ 表格 | P0 | 6h | X2, Z5 |
| X4 | 主题详情页：信息展示 + 依赖关系 | P0 | 6h | X2, Z5 |
| X5 | 知识图谱可视化：D3/Cytoscape 力导向图 | P0 | 12h | X2, Z8 |
| X6 | 交互功能：节点点击、路径高亮、缩放拖拽 | P1 | 8h | X5 |
| X7 | 学科总览页：按学科展示统计 + 领域分布 | P1 | 4h | X2, Z5 |
| X8 | 领域摘要页：parent-friendly 内容展示 | P1 | 3h | X2, Z7 |
| X9 | 课程标准对齐页 | P2 | 4h | X2, Z7 |
| X10 | 响应式适配（移动端） | P2 | 4h | X2-X8 |
| X11 | 前端性能优化（懒加载、虚拟滚动） | P2 | 3h | X5 |
| X12 | 前端测试（单元 + E2E） | P2 | 4h | X2-X8 |
| **合计** | | | **61h** | |

---

## 五、总时间线

```
Week 1-2:  zhaolei (Z1-Z4) | xiangbo (X1-X2)
Week 3-4:  zhaolei (Z5-Z8) | xiangbo (X3-X4)
Week 5-6:  zhaolei (Z9-Z11) | xiangbo (X5-X6)
Week 7:    zhaolei + xiangbo 联调 (Z14 + X10-X12)
Week 8:    上线部署 + 文档
```

---

## 六、GitHub 仓库结构建议

```
marble-platform/
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── models/
│   │   └── app.js
│   ├── data/           # Marble JSON 数据
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.tsx
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
├── nginx/
│   └── default.conf
├── docs/
│   └── api.md
├── memory/
│   ├── zhaolei.md      # zhaolei 任务记忆
│   ├── xiangbo.md      # xiangbo 任务记忆
│   └── project.md      # 项目整体记忆
└── README.md
```
