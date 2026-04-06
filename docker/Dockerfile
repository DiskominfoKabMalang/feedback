# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY pnpm-lock.yaml ./

# Install pnpm and dependencies
RUN npm install -g pnpm@latest
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build application
RUN pnpm build

# Migration stage - extract drizzle-kit
FROM node:20-alpine AS migration

WORKDIR /app

# Copy package files and install drizzle-kit only
COPY package*.json ./
COPY pnpm-lock.yaml ./
RUN npm install -g pnpm@latest
RUN pnpm install --frozen-lockfile
RUN pnpm add -D drizzle-kit

# Copy migration files
COPY drizzle.config.ts ./
COPY drizzle ./drizzle
COPY db ./db

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Copy migration files from migration stage
COPY --from=migration /app/node_modules/.bin/drizzle-kit /usr/local/bin/drizzle-kit
COPY --from=migration /app/node_modules/drizzle-kit /node_modules/drizzle-kit
COPY --from=migration /app/drizzle.config.ts ./drizzle.config.ts
COPY --from=migration /app/drizzle ./drizzle
COPY --from=migration /app/db ./db
COPY --from=migration /app/package.json ./package.json

# Copy application files from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Create uploads directory
RUN mkdir -p /app/uploads

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
RUN chown -R nextjs:nodejs /app
USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
