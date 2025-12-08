# ==========================================
# Dockerfile for Path B: Build-at-Startup SSG
# Image: channinghe/mirror-page:latest
# ==========================================

FROM node:20-alpine

WORKDIR /app

# 1. Install System Dependencies (Caddy + Build tools)
RUN apk add --no-cache libc6-compat caddy

# 2. Install Node Dependencies
COPY package.json package-lock.json* ./
RUN npm ci

# 3. Copy Source Code
COPY . .

# 4. Environment Setup
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# 5. Runtime Configuration
# We copy the Caddyfile as a template
COPY Caddyfile /etc/caddy/Caddyfile

# Expose HTTP port
EXPOSE 80

# 6. Startup Command
# - Mount mirrors.toml at runtime via Docker volume
# - Run 'npm run build' to generate static files based on the config
# - Start Caddy to serve the 'out' directory
CMD ["sh", "-c", "echo '🚀 Generating static site from config...' && npm run build && echo '✅ Build complete! Starting Caddy...' && caddy run --config /etc/caddy/Caddyfile --adapter caddyfile"]
