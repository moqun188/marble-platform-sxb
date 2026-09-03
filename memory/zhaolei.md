# zhaolei 任务记忆

> 研发 1 — 后端 + 基础设施
> 创建日期: 2026-08-31

## 任务清单

### Phase 1-3: 核心功能 ✅ Z1-Z14 全部完成

### 后续优化

#### Rate Limiting ✅ 已完成
- [x] 通用 API 限流：100 请求/分钟/IP
- [x] 搜索限流：30 请求/分钟
- [x] Graph 限流：10 请求/分钟（大 payload）
- [x] 标准 RateLimit-* 响应头
- [x] trust proxy 支持（Docker/Nginx 后）
- [x] X-Forwarded-For IP 提取
- 完成时间: 2026-09-03

## 服务端口
- API: http://124.222.188.198:3200
- Swagger: http://124.222.188.198:3200/api/docs
