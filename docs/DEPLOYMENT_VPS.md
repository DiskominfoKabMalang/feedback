# Deployment Guide - VPS with Docker (Recommended)

This guide covers deploying the Feedback SaaS platform on your VPS with support for widgets embedded on any framework (Next.js, Laravel, PHP, etc.).

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                        User's Website                                │
│  (Can be Next.js, Laravel CI, Native PHP, WordPress, etc.)          │
│                                                                     │
│  <script src="https://cdn.yourdomain.com/widget.js"></script>      │
│  FeedbackWidget.init({ projectId: "xxx" })                         │
└─────────────────────────────────────────────────────────────────────┘
                                 │
                                 │ HTTPS API Calls
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                           Your VPS                                  │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    Nginx (Reverse Proxy)                    │   │
│  │  • SSL/Termination                                          │   │
│  │  • Static file serving (widget.js)                          │   │
│  │  • Route: / → dashboard:3000                                │   │
│  │  • Route: /api/* → dashboard:3000                           │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                    │                                │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │              Docker Compose Services                        │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │   │
│  │  │  Dashboard   │  │ PostgreSQL   │  │   Redis      │     │   │
│  │  │   Next.js    │  │   :5432      │  │   :6379      │     │   │
│  │  │    :3000     │  │              │  │ (optional)   │     │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘     │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

## Why This Architecture?

| Component            | Purpose          | Why                                         |
| -------------------- | ---------------- | ------------------------------------------- |
| **Nginx**            | Reverse Proxy    | SSL, static files, load balancing           |
| **Docker**           | Containerization | Easy deployment, isolation, reproducibility |
| **PostgreSQL**       | Database         | Reliable, ACID compliant, good for SaaS     |
| **Redis** (optional) | Cache/Queue      | Rate limiting, sessions, background jobs    |

---

## Step 1: Prepare Your VPS

### System Requirements

- **OS**: Ubuntu 22.04 LTS or 24.04 LTS (recommended)
- **RAM**: Minimum 2GB (4GB recommended for production)
- **Storage**: 20GB SSD minimum

### Initial Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install required packages
sudo apt install -y curl git ufw fail2ban

# Setup firewall
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw --force enable

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo apt install -y docker-compose-plugin

# Install Nginx
sudo apt install -y nginx certbot python3-certbot-nginx
```

---

## Step 2: Deploy Application with Docker

### Create Project Structure

```bash
# Create directory
sudo mkdir -p /var/www/feedbackapp
sudo chown $USER:$USER /var/www/feedbackapp
cd /var/www/feedbackapp
```

### Create Docker Compose File

Create `/var/www/feedbackapp/docker-compose.yml`:

```yaml
version: '3.8'

services:
  # PostgreSQL Database
  postgres:
    image: postgres:16-alpine
    container_name: feedbackapp-db
    restart: unless-stopped
    environment:
      POSTGRES_USER: feedbackapp
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: feedbackapp
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - feedbackapp-network
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U feedbackapp']
      interval: 10s
      timeout: 5s
      retries: 5

  # Redis (optional - for caching, rate limiting, sessions)
  redis:
    image: redis:7-alpine
    container_name: feedbackapp-redis
    restart: unless-stopped
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data
    networks:
      - feedbackapp-network
    healthcheck:
      test: ['CMD', 'redis-cli', 'ping']
      interval: 10s
      timeout: 3s
      retries: 3

  # Dashboard App (Next.js)
  dashboard:
    build:
      context: ./dashboard
      dockerfile: Dockerfile
    container_name: feedbackapp-dashboard
    restart: unless-stopped
    ports:
      - '3000:3000'
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://feedbackapp:${DB_PASSWORD}@postgres:5432/feedbackapp
      - NEXTAUTH_URL=${APP_URL}
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - REDIS_URL=redis://redis:6379
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    networks:
      - feedbackapp-network
    volumes:
      - ./dashboard/uploads:/app/uploads

volumes:
  postgres_data:
    driver: local
  redis_data:
    driver: local

networks:
  feedbackapp-network:
    driver: bridge
```

### Create Dashboard Dockerfile

Create `/var/www/feedbackapp/dashboard/Dockerfile`:

```dockerfile
# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY pnpm-lock.yaml ./

# Install pnpm and dependencies
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build application
RUN pnpm build

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Install pnpm
RUN npm install -g pnpm

# Copy built application
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/package.json ./package.json

# Install only production dependencies
RUN pnpm install --prod

# Create uploads directory
RUN mkdir -p /app/uploads

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### Configure Next.js for Standalone Output

Add/update `next.config.ts`:

```typescript
import type { NextConfig } from 'next'

const config: NextConfig = {
  output: 'standalone', // Required for Docker
  experimental: {
    serverComponentsExternalPackages: ['@neondatabase/serverless'],
  },
}

export default config
```

### Create Environment File

Create `/var/www/feedbackapp/.env`:

```bash
# Database
DB_PASSWORD=your_secure_random_password_here

# App URL
APP_URL=https://app.yourdomain.com

# NextAuth
NEXTAUTH_SECRET=$(openssl rand -base64 32)
NEXTAUTH_URL=https://app.yourdomain.com

# Admin (default credentials)
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=your_secure_admin_password
```

---

## Step 3: Setup Nginx Configuration

### Main Nginx Config

Create `/etc/nginx/sites-available/feedbackapp`:

```nginx
# Rate limiting zones
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=feedback_limit:10m rate=5r/s;

# Upstream for dashboard
upstream dashboard {
    server localhost:3000;
}

# Main app domain (dashboard)
server {
    listen 80;
    server_name app.yourdomain.com;

    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name app.yourdomain.com;

    # SSL configuration
    ssl_certificate /etc/letsencrypt/live/app.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/app.yourdomain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # Logging
    access_log /var/log/nginx/feedbackapp-access.log;
    error_log /var/log/nginx/feedbackapp-error.log;

    # Client max body size
    client_max_body_size 10M;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json application/javascript;

    # Proxy to dashboard
    location / {
        limit_req zone=api_limit burst=20 nodelay;

        proxy_pass http://dashboard;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # API routes with special CORS handling
    location /api/v1/widget/ {
        limit_req zone=feedback_limit burst=10 nodelay;

        # CORS headers for widget
        add_header 'Access-Control-Allow-Origin' '*' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'Content-Type, Authorization' always;

        if ($request_method = 'OPTIONS') {
            return 204;
        }

        proxy_pass http://dashboard;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Enable Site and SSL

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/feedbackapp /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Get SSL certificate
sudo certbot --nginx -d app.yourdomain.com

# Test nginx config
sudo nginx -t

# Restart nginx
sudo systemctl restart nginx
```

---

## Step 4: Deploy Widget Files

### Option A: Serve Widget from Same Domain (Simplest)

```bash
# Create widget directory
sudo mkdir -p /var/www/widget
sudo chown $USER:$USER /var/www/widget

# Copy built widget files
cp -r packages/widget/dist/* /var/www/widget/
```

Add to Nginx config (for `cdn.yourdomain.com`):

```nginx
# Widget CDN domain
server {
    listen 80;
    server_name cdn.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name cdn.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/cdn.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/cdn.yourdomain.com/privkey.pem;

    root /var/www/widget;

    # Cache widget files for 1 year
    location ~* \.(js|css)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header Access-Control-Allow-Origin "*";
    }

    # Gzip for widget files
    gzip on;
    gzip_types application/javascript text/css;
}
```

### Option B: Use Cloudflare CDN (Recommended for Global)

```bash
# 1. Build widget locally
cd packages/widget
pnpm build

# 2. Upload to your server
scp -r dist/* user@yourvps:/var/www/widget/

# 3. Add cdn.yourdomain.com to Cloudflare
# 4. Enable caching and Bypass Cache on Cookie for HTML
```

---

## Step 5: Deploy Everything

```bash
cd /var/www/feedbackapp

# Build and start containers
docker compose up -d --build

# View logs
docker compose logs -f

# Run database migrations
docker compose exec dashboard npx db:migrate

# Create admin user (if not exists)
docker compose exec dashboard npx tsx db/create-test-user.ts
```

---

## Step 6: Setup PM2 for Process Management (Optional)

If you prefer not to use Docker for the dashboard:

```bash
# Install PM2 globally
npm install -g pm2

# Create ecosystem file
cat > /var/www/feedbackapp/ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'feedbackapp-dashboard',
    script: 'node_modules/.bin/next',
    args: 'start',
    cwd: '/var/www/feedbackapp/dashboard',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    instances: 'max',
    exec_mode: 'cluster',
    error_file: '/var/log/pm2/feedbackapp-error.log',
    out_file: '/var/log/pm2/feedbackapp-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    max_restarts: 10,
    min_uptime: '10s'
  }]
}
EOF

# Start with PM2
pm2 start /var/www/feedbackapp/ecosystem.config.js
pm2 save
pm2 startup
```

---

## Step 7: Widget Integration for Users

### For Next.js Users

```tsx
// app/layout.tsx
import Script from 'next/script'

export default function RootLayout() {
  return (
    <html>
      <head>
        <Script
          src="https://cdn.yourdomain.com/widget.js"
          strategy="afterInteractive"
        />
        <Script id="widget-init" strategy="afterInteractive">
          {`FeedbackWidget.init({
            projectId: 'YOUR_PROJECT_ID',
            apiEndpoint: 'https://app.yourdomain.com'
          })`}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  )
}
```

### For Laravel CI Users

```blade
<!-- resources/views/layouts/app.blade.php -->
<!DOCTYPE html>
<html>
<head>
    <script src="https://cdn.yourdomain.com/widget.js"></script>
    <script>
        FeedbackWidget.init({
            projectId: '{{ config('feedbackapp.project_id') }}',
            apiEndpoint: 'https://app.yourdomain.com'
        });
    </script>
</head>
<body>
    @yield('content')
</body>
</html>
```

Add to `.env`:

```bash
FEEDBACKAPP_PROJECT_ID=your_project_id
```

### For Native PHP Users

```php
<!-- header.php -->
<!DOCTYPE html>
<html>
<head>
    <script src="https://cdn.yourdomain.com/widget.js"></script>
    <script>
        FeedbackWidget.init({
            projectId: '<?php echo getenv('FEEDBACKAPP_PROJECT_ID'); ?>',
            apiEndpoint: 'https://app.yourdomain.com'
        });
    </script>
</head>
<body>
```

### For WordPress Users

Create plugin `feedbackapp-widget.php`:

```php
<?php
/*
Plugin Name: FeedbackApp Widget
*/

function feedbackapp_enqueue_widget() {
    wp_enqueue_script('feedbackapp-widget',
        'https://cdn.yourdomain.com/widget.js',
        [],
        null,
        true
    );

    $project_id = get_option('feedbackapp_project_id', '');

    wp_add_inline_script('feedbackapp-widget',
        "FeedbackWidget.init({
            projectId: '$project_id',
            apiEndpoint: 'https://app.yourdomain.com'
        });"
    );
}
add_action('wp_enqueue_scripts', 'feedbackapp_enqueue_widget');

// Admin settings page
function feedbackapp_admin_menu() {
    add_options_page(
        'FeedbackApp Settings',
        'FeedbackApp',
        'manage_options',
        'feedbackapp-settings',
        'feedbackapp_settings_page'
    );
}
add_action('admin_menu', 'feedbackapp_admin_menu');

function feedbackapp_settings_page() {
    ?>
    <div class="wrap">
        <h1>FeedbackApp Widget Settings</h1>
        <form method="post" action="options.php">
            <?php
            settings_fields('feedbackapp_options');
            do_settings_sections('feedbackapp');
            ?>
            <table class="form-table">
                <tr>
                    <th>Project ID</th>
                    <td>
                        <input type="text"
                               name="feedbackapp_project_id"
                               value="<?php echo esc_attr(get_option('feedbackapp_project_id')); ?>"
                               class="regular-text"
                        />
                    </td>
                </tr>
            </table>
            <?php submit_button(); ?>
        </form>
    </div>
    <?php
}

function feedbackapp_register_settings() {
    register_setting('feedbackapp_options', 'feedbackapp_project_id');
}
add_action('admin_init', 'feedbackapp_register_settings');
```

---

## Step 8: Maintenance Commands

```bash
# View logs
docker compose logs -f dashboard

# Restart services
docker compose restart

# Update application
cd /var/www/feedbackapp
git pull
docker compose up -d --build

# Database backup
docker compose exec postgres pg_dump -U feedbackapp feedbackapp | gzip > backup_$(date +%Y%m%d).sql.gz

# Restore from backup
gunzip < backup_20241201.sql.gz | docker compose exec -T postgres psql -U feedbackapp feedbackapp

# Check disk space
df -h

# Check Docker stats
docker stats
```

---

## Step 9: Monitoring Setup

### Setup basic monitoring

```bash
# Install Node Exporter for Prometheus metrics
docker run -d \
  --name node-exporter \
  --restart=unless-stopped \
  -p 9100:9100 \
  -v /proc:/host/proc:ro \
  -v /sys:/host/sys:ro \
  -v /:/rootfs:ro \
  prom/node-exporter

# Or use Uptime Kuma (recommended for simple monitoring)
docker run -d \
  --name uptime-kuma \
  --restart=unless-stopped \
  -p 3001:3001 \
  -v uptime-kuma:/app/data \
  louislam/uptime-kuma:1
```

---

## Security Checklist

- [ ] Firewall configured (only 22, 80, 443 open)
- [ ] SSH key authentication only (disable password login)
- [ ] Fail2ban installed for SSH protection
- [ ] SSL/TLS certificates installed
- [ ] Database password is strong
- [ ] NEXTAUTH_SECRET is random and secure
- [ ] Rate limiting configured on API endpoints
- [ ] CORS properly configured for widget API
- [ ] Regular database backups configured
- [ ] Log rotation configured
- [ ] Container security scanning (docker scan)

---

## Troubleshooting

### Container won't start

```bash
# Check logs
docker compose logs dashboard

# Check if port 3000 is already in use
sudo lsof -i :3000

# Rebuild without cache
docker compose build --no-cache
docker compose up -d
```

### Database connection issues

```bash
# Check if PostgreSQL is running
docker compose ps postgres

# Check database logs
docker compose logs postgres

# Connect to database
docker compose exec postgres psql -U feedbackapp -d feedbackapp
```

### Nginx 502 errors

```bash
# Check if dashboard is running
curl http://localhost:3000

# Check nginx error logs
sudo tail -f /var/log/nginx/feedbackapp-error.log

# Restart nginx
sudo systemctl restart nginx
```

### Widget not loading

1. Check `cdn.yourdomain.com/widget.js` is accessible
2. Check browser console for errors
3. Verify API endpoint is reachable
4. Check CORS headers: `curl -I https://app.yourdomain.com/api/v1/widget/config?project_id=test`
