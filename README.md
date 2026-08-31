# Marble Knowledge Graph Platform

基于 [Marble Skill Taxonomy](https://github.com/withmarbleapp/os-taxonomy) 的知识图谱服务平台。

## 项目结构

```
marble-platform/
├── backend/           # Node.js REST API
│   ├── src/app.js     # Express 服务入口
│   ├── marble-data/   # Marble 原始数据
│   └── package.json
├── frontend/          # React 前端（待开发）
├── docs/              # 文档
│   └── project-plan.md
├── memory/            # 研发记忆
│   ├── zhaolei.md     # 研发1 后端任务
│   └── xiangbo.md     # 研发2 前端任务
└── nginx/             # Nginx 配置
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
cd backend
npm install
npm start
# API runs on http://localhost:3200
```

## 团队

- **zhaolei** — 后端研发
- **xiangbo** — 前端研发

## 数据来源

Marble Skill Taxonomy v1
- 1,590 微主题
- 3,221 先修链
- 8 学科 / 7 课程标准
- 许可: ODbL 1.0 (数据库) + CC BY-SA 4.0 (内容)

