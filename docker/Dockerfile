# =============================================================================
# Pisky Design System - Dockerfile for Feedback SaaS
# =============================================================================
# Multi-stage build for optimized image size with migration support
# =============================================================================

# -----------------------------------------------------------------------------
# Stage 1: Builder
# -----------------------------------------------------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Install build dependencies for native modules
RUN apk add --no-cache python3 make g++

# Set Node.js memory limit
ENV NODE_OPTIONS="--max-old-space-size=4096"

# Copy package files
COPY package*.json ./
COPY pnpm-lock.yaml ./

# Install pnpm and dependencies
RUN npm install -g pnpm@9.15.0
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build application
RUN pnpm build

# -----------------------------------------------------------------------------
# Stage 2: Migration Tools (extract for production)
# -----------------------------------------------------------------------------
FROM node:20-alpine AS migration

WORKDIR /app

# Copy package files and install drizzle-kit only
COPY package*.json ./
COPY pnpm-lock.yaml ./
RUN npm install -g pnpm@9.15.0
RUN pnpm install --frozen-lockfile
RUN pnpm add -D drizzle-kit

# Copy migration files
COPY drizzle.config.json ./
COPY drizzle ./drizzle
COPY db ./db

# -----------------------------------------------------------------------------
# Stage 3: Production Runner
# -----------------------------------------------------------------------------
FROM node:20-alpine AS runner

WORKDIR /app

# Environment variables
ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME="0.0.0.0" \
    NODE_OPTIONS="--max-old-space-size=2048"

# Install dependencies for node-gyp if needed
RUN apk add --no-cache libc6-compat

# Copy drizzle-kit from migration stage
COPY --from=migration /app/node_modules/drizzle-kit ./node_modules/drizzle-kit
COPY --from=migration /app/node_modules/.bin/drizzle-kit ./node_modules/.bin/drizzle-kit
COPY --from=migration /app/drizzle.config.json ./drizzle.config.json
COPY --from=migration /app/drizzle ./drizzle
COPY --from=migration /app/db ./db
COPY --from=migration /app/package.json ./package.json

# Copy application files from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Create uploads directory
RUN mkdir -p /app/uploads

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs && \
    chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"
