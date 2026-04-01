# Deployment Guide - Feedback SaaS Platform

This guide covers deploying both the main Dashboard application and the Widget package.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     User's Website                           │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  <script src="https://cdn.yourdomain.com/widget.js"> │    │
│  │  FeedbackWidget.init({ projectId: "xxx" })          │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  Dashboard App (Next.js)                     │
│  • https://app.yourdomain.com                               │
│  • User authentication, project management, analytics       │
│  • API endpoints:                                           │
│    - /api/v1/widget/config (public, CORS)                   │
│    - /api/v1/widget/feedback (public, CORS)                 │
│    - /api/dashboard/* (private, auth required)              │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    PostgreSQL Database                       │
│  • Projects, Feedbacks, Users, Roles, Permissions          │
└─────────────────────────────────────────────────────────────┘
```

---

## Part 1: Deploy Dashboard App (Vercel)

### Prerequisites

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login
```

### Step 1: Environment Variables

Create `.env.production`:

```bash
# Database
DATABASE_URL="postgresql://user:password@host:5432/feedbackapp"

# NextAuth
NEXTAUTH_URL="https://app.yourdomain.com"
NEXTAUTH_SECRET="your-random-secret-key"

# OAuth (optional for production)
GITHUB_CLIENT_ID="xxx"
GITHUB_CLIENT_SECRET="xxx"
GOOGLE_CLIENT_ID="xxx"
GOOGLE_CLIENT_SECRET="xxx"
```

### Step 2: Deploy to Vercel

```bash
# From the project root
cd /home/ascodenote/Documents/Code/feedbackapp

# Deploy
vercel --prod

# Or link to existing project
vercel link
vercel env pull .env.production
vercel --prod
```

### Step 3: Configure Database

```bash
# Run migrations on production database
DATABASE_URL="your-production-db-url" pnpm db:migrate

# Or use Vercel Postgres (if using)
vercel postgres
```

### Step 4: Update CORS Settings

Make sure widget API endpoints allow your widget CDN:

```typescript
// app/api/v1/widget/config/route.ts
const allowedOrigins = [
  'https://cdn.yourdomain.com',
  'https://yourdomain.com',
  // Add any domains that will embed the widget
]
```

---

## Part 2: Deploy Widget Package (CDN)

### Option A: Deploy as Separate Vercel Project

```bash
# Navigate to widget package
cd packages/widget

# Deploy to Vercel
vercel --prod

# The widget will be available at:
# https://widget.yourdomain.com
```

Update the embed script:

```html
<script src="https://widget.yourdomain.com/widget.js"></script>
<script>
  FeedbackWidget.init({
    projectId: 'YOUR_PROJECT_ID',
    apiEndpoint: 'https://app.yourdomain.com',
  })
</script>
```

### Option B: Deploy to CDN (Cloudflare, AWS CloudFront)

#### Step 1: Build Widget

```bash
cd packages/widget
pnpm build
```

#### Step 2: Upload to CDN

```bash
# Using AWS S3 + CloudFront
aws s3 sync dist/ s3://your-cdn-bucket/widget/ --cache-control "public, max-age=31536000"

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/widget/*"
```

#### Step 3: Configure CDN CORS

For CloudFront, add the following to your origin response headers:

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

### Option C: NPM Package (for self-hosting)

```bash
# Build and publish to npm
cd packages/widget
pnpm build
npm publish

# Users can then install via npm
npm install @feedbackapp/widget
```

---

## Part 3: DNS Configuration

### Recommended Domain Structure

```
# Dashboard (main app)
app.yourdomain.com  →  Vercel

# Widget CDN (if using separate deployment)
cdn.yourdomain.com  →  Vercel (widget project)
widget.yourdomain.com →  Vercel (widget project)

# Landing page (optional)
yourdomain.com      →  Vercel (landing page)
```

### Vercel DNS Settings

```bash
# Add domains via Vercel CLI
vercel domains add app.yourdomain.com
vercel domains add widget.yourdomain.com
```

---

## Part 4: Post-Deployment Checklist

### 1. Verify API Endpoints

```bash
# Public widget config (should work without auth)
curl https://app.yourdomain.com/api/v1/widget/config?project_id=xxx

# Public feedback submission (should work without auth)
curl -X POST https://app.yourdomain.com/api/v1/widget/feedback \
  -H "Content-Type: application/json" \
  -d '{"project_id":"xxx","rating":5}'
```

### 2. Verify Widget Embed

Create a test HTML file:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Widget Test</title>
  </head>
  <body>
    <h1>Test Page</h1>
    <p>Widget should appear in bottom-right corner.</p>

    <script src="https://widget.yourdomain.com/widget.js"></script>
    <script>
      FeedbackWidget.init({
        projectId: 'YOUR_PROJECT_ID',
        apiEndpoint: 'https://app.yourdomain.com',
        debug: true,
      })
    </script>
  </body>
</html>
```

### 3. Check CORS Headers

```bash
curl -I -H "Origin: https://example.com" \
  https://app.yourdomain.com/api/v1/widget/config?project_id=xxx

# Should include:
# Access-Control-Allow-Origin: *
```

### 4. Test Authentication Flow

1. Visit `https://app.yourdomain.com`
2. Register/login with email: `admin@yourdomain.com` / password: `admin`
3. Create a new project
4. Copy widget embed code
5. Test on external website

---

## Part 5: Production Considerations

### Rate Limiting

```typescript
// middleware.ts
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'),
})

export async function middleware(request: NextRequest) {
  // Apply rate limiting to public API endpoints
  if (request.nextUrl.pathname.startsWith('/api/v1/widget')) {
    const ip = request.ip ?? '127.0.0.1'
    const { success } = await ratelimit.limit(ip)
    if (!success) {
      return new Response('Too Many Requests', { status: 429 })
    }
  }
}
```

### Monitoring

```bash
# Add monitoring services
pnpm add @sentry/nextjs

# Initialize Sentry
npx @sentry/wizard@latest -i nextjs
```

### Database Indexes (Already Implemented)

```sql
-- These indexes are already in the schema
CREATE INDEX idx_feedbacks_project_id ON feedbacks(project_id);
CREATE INDEX idx_feedbacks_created_at ON feedbacks(created_at DESC);
CREATE INDEX idx_feedbacks_rating ON feedbacks(rating);
CREATE INDEX idx_feedbacks_status ON feedbacks(status);
CREATE INDEX idx_feedbacks_tags ON feedbacks USING GIN (answers->'tags');
```

### Backup Strategy

```bash
# Daily database backups (example script)
#!/bin/bash
# backup.sh

pg_dump $DATABASE_URL | gzip > backup_$(date +%Y%m%d).sql.gz

# Upload to S3
aws s3 cp backup_$(date +%Y%m%d).sql.gz s3://backups/feedbackapp/

# Keep last 30 days
find /backups -name "backup_*.sql.gz" -mtime +30 -delete
```

---

## Part 6: Troubleshooting

### Widget Not Loading

1. Check browser console for errors
2. Verify `apiEndpoint` matches your dashboard URL
3. Check CORS headers on API endpoints
4. Verify `projectId` exists in database

### Feedback Not Submitting

1. Check `/api/v1/widget/feedback` endpoint is accessible
2. Verify request payload format matches schema
3. Check database connection
4. Review server logs

### Authentication Issues

1. Verify `NEXTAUTH_URL` matches your domain
2. Check `NEXTAUTH_SECRET` is set
3. Clear browser cookies and retry

---

## Quick Reference: Environment Variables

| Variable              | Description                  | Example                      |
| --------------------- | ---------------------------- | ---------------------------- |
| `DATABASE_URL`        | PostgreSQL connection string | `postgresql://...`           |
| `NEXTAUTH_URL`        | Dashboard URL                | `https://app.yourdomain.com` |
| `NEXTAUTH_SECRET`     | Auth secret                  | Random 32-char string        |
| `NEXT_PUBLIC_API_URL` | API URL (optional)           | `https://app.yourdomain.com` |

---

## Quick Reference: Ports & URLs

| Service   | Local                  | Production                      |
| --------- | ---------------------- | ------------------------------- |
| Dashboard | `localhost:3000`       | `https://app.yourdomain.com`    |
| Widget    | `localhost:5500` (dev) | `https://widget.yourdomain.com` |
| Database  | `localhost:5432`       | Your provider                   |
