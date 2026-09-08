#!/bin/bash
# Marble 平台部署脚本 — 在服务器上运行
# 用法: bash scripts/deploy.sh

set -e

echo "=== Marble 平台部署 ==="

# 1. 安装后端依赖
echo "[1/5] 安装后端依赖..."
cd /opt/marble/backend
npm ci --production

# 2. 构建前端
echo "[2/5] 构建前端..."
cd /opt/marble/frontend
npm ci
npm run build

# 3. 部署前端静态文件
echo "[3/5] 部署前端静态文件..."
rm -rf /opt/marble/frontend-dist
cp -r dist /opt/marble/frontend-dist

# 4. 重启后端 (PM2)
echo "[4/5] 重启后端服务..."
cd /opt/marble/backend
pm2 start ecosystem.config.cjs --update-env || pm2 restart marble-api --update-env
pm2 save

# 5. 重载 Nginx
echo "[5/5] 重载 Nginx..."
sudo nginx -t && sudo systemctl reload nginx

echo ""
echo "=== 部署完成 ==="
echo "  前端: http://$(hostname -I | awk '{print $1}')"
echo "  API:  http://$(hostname -I | awk '{print $1}'):3200/api/health"
echo ""
