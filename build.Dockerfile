# ==========================================
# Dockerfile for Static Site Generation (Builder)
# usage: docker build -f staticbuilder.Dockerfile -t mirror-builder .
#        docker run --rm -v $(pwd)/out:/app/dist_static mirror-builder
# ==========================================

FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci

# Copy source code
COPY . .

# Create output mount point
RUN mkdir -p dist_static

# Disable Telemetry
ENV NEXT_TELEMETRY_DISABLED=1

# Command:
# 1. Build to internal 'out' directory
# 2. Copy contents to mounted 'dist_static' directory (avoids EBUSY error on host volume)
CMD ["sh", "-c", "npm run build && cp -a out/* dist_static/ && echo '✅ Static files generated successfully in volume'"]
