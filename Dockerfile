FROM node:20-alpine

WORKDIR /app

# 后端
COPY backend/package*.json ./backend/
RUN cd backend && npm ci --production

COPY backend/ ./backend/

# 前端构建
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm ci

COPY frontend/ ./frontend/
RUN cd frontend && npm run build

# 前端静态文件移到后端可托管的位置
RUN mkdir -p /app/backend/public && cp -r /app/frontend/dist/* /app/backend/public/

EXPOSE 3200

CMD ["node", "backend/src/app.js"]
