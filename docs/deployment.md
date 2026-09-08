# Marble 知识图谱平台 — 部署指南

> 服务器: 124.222.188.198 (Ubuntu, 3.6GB RAM, 40GB Disk)

## 方案一: PM2 + Nginx（推荐）

### 1. 安装 Nginx

```bash
sudo apt update && sudo apt install -y nginx
sudo systemctl enable nginx
```

### 2. 部署 Nginx 配置

```bash
sudo cp nginx/marble.conf /etc/nginx/sites-available/marble
sudo ln -sf /etc/nginx/sites-available/marble /etc/nginx/sites-enabled/marble
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
```

### 3. 安装 PM2

```bash
npm install -g pm2
```

### 4. 部署后端

```bash
cd /opt/marble/backend
npm ci --production
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup  # 开机自启
```

### 5. 构建并部署前端

```bash
cd /opt/marble/frontend
npm ci
npm run build
sudo rm -rf /opt/marble/frontend-dist
sudo cp -r dist /opt/marble/frontend-dist
```

### 6. 验证

```bash
curl http://localhost/api/health
# 应返回: {"status":"ok","topics":1590,"dependencies":3221}
```

### 7. 设置数据备份

```bash
chmod +x scripts/backup.sh
# 添加定时任务: 每天凌晨 3 点备份
crontab -e
# 添加: 0 3 * * * /opt/marble/scripts/backup.sh
```

---

## 方案二: Docker（备选）

```bash
docker-compose up -d --build
# 访问: http://服务器IP:3200
```

---

## HTTPS 配置 (Let's Encrypt)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d marble.example.com  # 替换为实际域名
sudo certbot renew --dry-run
```

---

## 日志查看

```bash
# PM2 日志
pm2 logs marble-api

# Nginx 日志
tail -f /var/log/nginx/marble_access.log
tail -f /var/log/nginx/marble_error.log
```

---

## 一键部署

```bash
bash scripts/deploy.sh
```
