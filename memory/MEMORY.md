# MEMORY.md — 长期记忆

## Marble 知识图谱平台项目

### 项目概况
- **仓库**: https://github.com/moqun188/marble-platform-sxb
- **服务器**: 124.222.188.198 (Ubuntu, 40GB, 3.6GB RAM)
- **数据源**: Marble Skill Taxonomy v1 (withmarbleapp/os-taxonomy)
- **团队**: zhaolei（后端）, xiangbo（前端）

### 技术栈
- **后端**: Node.js 20 + Express + Docker
- **前端**: React 19 + TypeScript + Vite 8 + Tailwind CSS 4 + Cytoscape.js
- **部署**: Docker (API:3200) + PM2 (Frontend:5174)
- **数据**: 1,590 微主题 + 3,221 先修链 + 7 课程标准

### 关键决策
- 选择 Cytoscape.js 而非 D3.js（1590 节点规模，Cytoscape 更合适）
- Docker 直接暴露端口，跳过 Nginx（服务器无主机 Nginx）
- 中英文双语版本（/cn 前缀路由）
- GitHub Token 需定期更新（已换过一次）

### SSH 连接注意事项
- 密码含 Unicode 字符（…），paramiko 直接传参会失败
- 使用 `ssh_helper.py` 封装，避免密码泄露
- git push 大仓库时容易超时，用 nohup 后台执行

### 已知问题
- PM2 前端重启次数多（15次），需排查
- 磁盘空间紧张（83%），需定期清理
- git push 到 GitHub 较慢（大 JSON 文件）

### 教训
- heredoc (`<< 'EOF'`) 写入远程文件会把 EOF 标记写进内容，用 SFTP 更可靠
- TypeScript 严格模式下，组件导入路径大小写敏感（Layout vs layout）
- API 函数命名要与现有代码一致（fetchTopics vs getTopics）
