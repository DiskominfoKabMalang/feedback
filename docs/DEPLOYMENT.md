# Deployment Guide

## Prerequisites

- Docker & Docker Compose installed
- Server with SSH access
- Domain configured (optional)

## Quick Start

### 1. Setup Environment Variables

```bash
# Copy example env file
cp .env.production.example .env

# Edit with your values
nano .env
```

**Required variables:**

```bash
POSTGRES_PASSWORD=your_secure_password_here
NEXTAUTH_SECRET=your_nextauth_secret_here
APP_URL=https://your-domain.com
```

Generate secrets:

```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32
```

### 2. Start Services

```bash
# Start all services
docker compose up -d

# Verify
docker compose ps
curl http://localhost:3000/api/health
```

## Widget Deployment

The feedback widget must be built locally before deploying. The widget files are then included in the Docker image during CI/CD build.

### Build Widget Locally

```bash
# Navigate to widget package
cd packages/widget

# Install dependencies (if not already installed)
pnpm install

# Build widget (generates UMD and ES formats)
pnpm build

# Copy built files to public directory
cp dist/widget.umd.cjs ../public/widget.js
cp dist/style.css ../public/widget.css

# Return to project root
cd ../..
```

### Verify Widget Files

```bash
# Check that files exist in public/widget/
ls -la public/widget/

# Should show:
# - widget.js (UMD format for <script> tags)
# - widget.umd.cjs (UMD format source)
# - style.css (Widget styles)
```

### Access Widget in Production

After deployment, the widget is accessible at:

```bash
https://your-domain.com/widget/widget.js
https://your-domain.com/widget/widget.css
```

### Embed Widget in Your Website

```html
<!-- Add to your site's <head> or before </body> -->
<link rel="stylesheet" href="https://your-domain.com/widget/widget.css" />
<script src="https://your-domain.com/widget/widget.js"></script>

<!-- Initialize widget -->
<script>
  window.PiskyWidget.init({
    projectId: 'your-project-id',
    position: 'bottom-right',
  })
</script>
```

## Database Setup

### Option 1: Generate SQL Schema (Manual Import)

Generate SQL file from your local machine:

```bash
# Set DATABASE_URL to your database
export DATABASE_URL="postgresql://user:pass@host:5432/dbname"

# Generate SQL schema
npx drizzle-kit generate

# The SQL files will be in ./drizzle folder
```

Then import manually to your database:

```bash
# Via psql
psql -h your-host -U your-user -d your-db -f drizzle/0001_xxx.sql

# Or via docker exec
docker exec -i postgres-container psql -U user -d db < drizzle/0001_xxx.sql
```

### Option 2: Push Schema Directly

From your local machine:

```bash
# Set DATABASE_URL to target database
export DATABASE_URL="postgresql://user:pass@your-server:5432/feedbackapp"

# Push schema
npx drizzle-kit push
```

### Option 3: Import from Existing Database

If you have an existing database with data:

**1. Export from old database:**

```bash
# Via pg_dump
pg_dump -h old-host -U user -d olddb > feedbackapp_backup.sql

# Or via docker
docker exec old-postgres pg_dump -U user olddb > feedbackapp_backup.sql
```

**2. Import to new database:**

```bash
# Via psql
psql -h new-host -U user -d feedbackapp < feedbackapp_backup.sql

# Or via docker compose
docker compose exec -T postgres psql -U feedbackapp < feedbackapp_backup.sql
```

## Database Backup & Restore

### Backup

```bash
# Backup to file
docker compose exec postgres pg_dump -U feedbackapp feedbackapp > backup_$(date +%Y%m%d).sql

# Backup with schema only
docker compose exec postgres pg_dump -U feedbackapp --schema-only feedbackapp > schema.sql

# Backup with data only
docker compose exec postgres pg_dump -U feedbackapp --data-only feedbackapp > data.sql
```

### Restore

```bash
# Restore from file
docker compose exec -T postgres psql -U feedbackapp < backup_20250101.sql

# Or via psql directly
psql -h localhost -U feedbackapp -d feedbackapp < backup.sql
```

## Common Commands

```bash
# Stop all services
docker compose down

# Start all services
docker compose up -d

# View logs
docker compose logs -f

# Restart specific service
docker compose restart dashboard

# Update application
git pull
# Rebuild widget if needed (see Widget Deployment section)
cd packages/widget && pnpm build && cp dist/widget.umd.cjs ../public/widget.js && cp dist/style.css ../public/widget.css && cd ../..
docker compose up -d --build

# Check database tables
docker compose exec postgres psql -U feedbackapp -d feedbackapp -c "\dt"

# Check database connections
docker compose exec postgres psql -U feedbackapp -c "SELECT count(*) FROM pg_stat_activity;"
```

## Production Setup

### Nginx Reverse Proxy

```nginx
server {
    listen 80;
    server_name feedback.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### SSL with Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d feedback.yourdomain.com
```

## Troubleshooting

### Application won't start

```bash
# Check logs
docker compose logs dashboard

# Verify environment variables
docker compose exec dashboard env | grep DATABASE_URL

# Rebuild image
docker compose up -d --build
```

### Database connection issues

```bash
# Test connection from app container
docker compose exec dashboard sh -c "nc -zv postgres 5432"

# Check database is accepting connections
docker compose exec postgres psql -U feedbackapp -c "SELECT 1"

# Check postgres logs
docker compose logs postgres
```

### Reset database

```bash
# Stop services
docker compose down

# Remove volume
docker volume rm feedbackapp_postgres_data

# Start fresh
docker compose up -d
```
