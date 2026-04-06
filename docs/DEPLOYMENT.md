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
# Start database only
docker-compose up -d postgres

# Run database migrations
docker-compose --profile migrate up migrate

# Start application
docker-compose up -d dashboard
```

### 3. Verify Deployment

```bash
# Check running containers
docker-compose ps

# Check application logs
docker-compose logs -f dashboard

# Check health endpoint
curl http://localhost:3000/api/health
```

## Database Migrations

### Using Migrate Container

The `migrate` service runs database migrations using Drizzle Kit.

**Run migrations:**

```bash
docker-compose --profile migrate up migrate
```

The migrate container will:

1. Wait for postgres to be healthy
2. Install dependencies (pnpm, drizzle-kit)
3. Run `pnpm db:push`
4. Exit automatically when complete

**Re-run migrations (after schema changes):**

```bash
docker-compose --profile migrate up migrate --force-recreate
```

### Manual Migration (Alternative)

If you prefer to run migrations from your local machine:

```bash
# Set database URL to remote server
export DATABASE_URL="postgresql://user:pass@your-server:5432/feedbackapp"

# Run migrations
pnpm db:push
```

## Common Commands

```bash
# Stop all services
docker-compose down

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Restart specific service
docker-compose restart dashboard

# Update application
git pull
docker-compose up -d --build dashboard

# Backup database
docker-compose exec postgres pg_dump -U feedbackapp feedbackapp > backup.sql

# Restore database
docker-compose exec -T postgres psql -U feedbackapp feedbackapp < backup.sql
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

### Migration fails

```bash
# Check postgres is running
docker-compose ps postgres

# Check postgres logs
docker-compose logs postgres

# Re-run migrate with verbose output
docker-compose --profile migrate up migrate --no-deps
```

### Application won't start

```bash
# Check logs
docker-compose logs dashboard

# Verify environment variables
docker-compose exec dashboard env | grep DATABASE_URL

# Rebuild image
docker-compose up -d --build dashboard
```

### Database connection issues

```bash
# Test connection from app container
docker-compose exec dashboard sh -c "nc -zv postgres 5432"

# Check database is accepting connections
docker-compose exec postgres psql -U feedbackapp -c "SELECT 1"
```
