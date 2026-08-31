FROM node:20-alpine

WORKDIR /app

# Copy package files and install
COPY package.json package-lock.json ./
RUN npm ci --production

# Copy source and data
COPY src/ ./src/
COPY openapi.yaml ./
COPY marble-data/ ./marble-data/
COPY .env ./

# Create non-root user
RUN addgroup -g 1001 -S marble && \
    adduser -S marble -u 1001 -G marble
USER marble

EXPOSE 3200

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:3200/api/health || exit 1

CMD ["node", "src/app.js"]
