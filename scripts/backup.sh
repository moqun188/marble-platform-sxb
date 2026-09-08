#!/bin/bash
# 数据备份脚本 — 每日 JSON 快照
# crontab: 0 3 * * * /opt/marble/scripts/backup.sh

set -e

BACKUP_DIR="/opt/marble/backups"
DATA_DIR="/opt/marble/backend/marble-data"
DATE=$(date +%Y%m%d_%H%M%S)
KEEP_DAYS=30

mkdir -p "$BACKUP_DIR"

# 打包数据文件
tar -czf "$BACKUP_DIR/marble-data-$DATE.tar.gz" -C "$DATA_DIR" .

# 清理旧备份
find "$BACKUP_DIR" -name "marble-data-*.tar.gz" -mtime +$KEEP_DAYS -delete

echo "[$(date)] Backup completed: marble-data-$DATE.tar.gz"
