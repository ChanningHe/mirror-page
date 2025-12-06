# Multi-stage build for Next.js application
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Accept build arguments for NEXT_PUBLIC_ variables
ARG NEXT_PUBLIC_SITE_TITLE
ARG NEXT_PUBLIC_SITE_SUBTITLE
ARG NEXT_PUBLIC_README_UPDATE_INTERVAL

# Set environment variables for build
ENV NEXT_PUBLIC_SITE_TITLE=$NEXT_PUBLIC_SITE_TITLE
ENV NEXT_PUBLIC_SITE_SUBTITLE=$NEXT_PUBLIC_SITE_SUBTITLE
ENV NEXT_PUBLIC_README_UPDATE_INTERVAL=$NEXT_PUBLIC_README_UPDATE_INTERVAL
ENV NEXT_TELEMETRY_DISABLED=1

# Build the application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create a non-root user
RUN addgroup --system --gid 5000 nodejs
RUN adduser --system --uid 5000 nextjs

# Copy necessary files
# Copy public directory if it exists
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Start the application
CMD ["node", "server.js"]
