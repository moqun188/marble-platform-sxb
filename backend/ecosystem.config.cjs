// PM2 配置文件 — 后端进程管理
// 使用: pm2 start ecosystem.config.cjs
// 保存: pm2 save && pm2 startup

module.exports = {
  apps: [
    {
      name: 'marble-api',
      script: 'src/app.js',
      cwd: '/opt/marble/backend',
      instances: 1,              // 单实例 (数据量小, 无需 cluster)
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '300M',
      env: {
        NODE_ENV: 'production',
        PORT: 3200,
      },
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      error_file: '/var/log/marble/api-error.log',
      out_file: '/var/log/marble/api-out.log',
      merge_logs: true,
    },
  ],
};
