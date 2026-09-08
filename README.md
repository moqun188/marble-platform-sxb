# Marble Knowledge Graph Platform

基于 [Marble Skill Taxonomy](https://github.com/withmarbleapp/os-taxonomy) 的 K-12 知识图谱服务平台。

## 项目概览

- **1,590** 微主题 / **3,221** 先修链 / **8** 学科 / **7** 课程标准
- 后端: Node.js + Express (Port 3200)
- 前端: React + TypeScript + Cytoscape.js (Port 5174)
- 测试: 147 单元测试 (Vitest) + E2E 测试 (Playwright)

## 项目结构

```
marble-platform/
├── backend/              # Node.js REST API
│   ├── src/app.js        # Express 服务入口
│   ├── marble-data/      # Marble 原始数据
│   ├── ecosystem.config.cjs  # PM2 配置
│   └── package.json
├── frontend/             # React 前端
│   ├── src/              # 源码
│   ├── e2e/              # Playwright E2E 测试
│   └── package.json
├── docs/                 # 文档
│   ├── project-plan.md   # 项目计划
│   └── deployment.md     # 部署指南
├── memory/               # 研发记忆
│   ├── zhaolei.md        # 后端任务
│   └── xiangbo.md        # 前端任务
├── nginx/marble.conf     # Nginx 配置
├── scripts/              # 部署/备份脚本
├── Dockerfile            # Docker 构建
└── docker-compose.yml    # Docker Compose
```

## API 端点

| 端点 | 方法 | 说明 |
|---|---|---|
| `/api/health` | GET | 健康检查 |
| `/api/topics` | GET | 主题列表（支持筛选） |
| `/api/topics/:id` | GET | 主题详情 |
| `/api/topics/:id/prereqs` | GET | 前置依赖 |
| `/api/topics/:id/unlocks` | GET | 解锁链 |
| `/api/topics/:id/path` | GET | 学习路径 |
| `/api/subjects` | GET | 学科统计 |
| `/api/domains` | GET | 领域列表 |
| `/api/clusters` | GET | 领域摘要 |
| `/api/standards` | GET | 课程标准 |
| `/api/graph` | GET | 完整图数据 |

## 快速开始

```bash
# 后端
cd backend && npm install && npm start
# API: http://localhost:3200

# 前端
cd frontend && npm install && npm run dev
# Web: http://localhost:5173
```

## 测试

```bash
cd frontend
npm test            # 运行单元测试 (147 tests)
npm run test:e2e    # 运行 E2E 测试 (需先 npx playwright install)
```

## 部署

详见 [docs/deployment.md](docs/deployment.md)

```bash
# 一键部署
bash scripts/deploy.sh

# 或 Docker
docker-compose up -d --build
```

## 团队

- **zhaolei** — 后端研发
- **xiangbo** — 前端研发

## 数据来源

Marble Skill Taxonomy v1
- 1,590 微主题 / 3,221 先修链 / 8 学科 / 7 课程标准
- 许可: ODbL 1.0 (数据库) + CC BY-SA 4.0 (内容)
