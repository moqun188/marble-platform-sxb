# MEMORY.md — 长期记忆

## Marble 知识图谱平台项目

### 项目概况
- **仓库**: https://github.com/moqun188/marble-platform-sxb
- **服务器**: 124.222.188.198 (Ubuntu, 40GB, 3.6GB RAM)
- **数据源**: Marble Skill Taxonomy v1 (withmarbleapp/os-taxonomy)
- **团队**: zhaolei（后端）, xiangbo（前端）
- **最新 commit**: `99277a4` (2026-09-03)

### 技术栈
- **后端**: Node.js 20 + Express + Docker + express-rate-limit
- **前端**: React 19 + TypeScript + Vite 8 + Tailwind CSS 4 + Cytoscape.js
- **部署**: Docker (API:3200) + PM2 (Frontend:5174)
- **数据**: 1,590 微主题 + 3,221 先修链 + 7 课程标准

### 功能完成度
- **zhaolei 后端**: Z1-Z14 + Rate Limiting + 参数校验 → **全部完成**
- **xiangbo 前端**: X1-X11 + X9 → **仅剩 X12 测试**
- **中英文双语**: /cn 前缀路由，全中文翻译
- **响应式**: 桌端表格 + 移动端卡片 + 汉堡菜单

### 关键决策
- 选择 Cytoscape.js 而非 D3.js（1590 节点规模，Cytoscape 更合适）
- Docker 直接暴露端口，跳过 Nginx（服务器无主机 Nginx）
- 中英文双语版本（/cn 前缀路由）
- React.lazy 代码分割，主包 712KB → 229KB
- VirtualList 虚拟滚动（48px 行高，600px 容器）

### 限流策略
- 通用 API: 100 req/min/IP
- 搜索: 30 req/min
- Graph: 10 req/min

### SSH 连接注意事项
- 密码含 Unicode 字符（…），paramiko 直接传参会失败
- 使用 `ssh_helper.py` 封装，避免密码泄露
- git push 大仓库时容易超时，用 nohup 后台执行

### 已知问题
- git push 到 GitHub 较慢（~6.9MB 松散对象），需等待
- GitHub Token 需定期更新（已换过两次）

### 教训
- heredoc (`<< 'EOF'`) 写入远程文件会把 EOF 标记写进内容，用 SFTP 更可靠
- TypeScript 严格模式下，组件导入路径大小写敏感（Layout vs layout）
- API 函数命名要与现有代码一致（fetchTopics vs getTopics）
- `sed -i` 替换含特殊字符的字符串容易出错，用 SFTP 直接写文件更可靠
