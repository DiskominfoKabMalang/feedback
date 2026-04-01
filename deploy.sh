#!/bin/bash

# ============================================================================
# Feedback SaaS - Deployment Script for VPS
# ============================================================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="feedbackapp"
DEPLOY_PATH="/var/www/$PROJECT_NAME"
BACKUP_PATH="/var/backups/$PROJECT_NAME"
LOG_FILE="/var/log/$PROJECT_NAME/deploy.log"

# Functions
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR:${NC} $1" | tee -a "$LOG_FILE"
    exit 1
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING:${NC} $1" | tee -a "$LOG_FILE"
}

# Check if running as root
check_root() {
    if [ "$EUID" -ne 0 ]; then
        error "Please run as root or with sudo"
    fi
}

# Create backup
backup_database() {
    log "Creating database backup..."
    mkdir -p "$BACKUP_PATH"
    
    docker compose exec -T postgres pg_dump -U feedbackapp feedbackapp | \
        gzip > "$BACKUP_PATH/backup_$(date +%Y%m%d_%H%M%S).sql.gz"
    
    log "Backup created: $BACKUP_PATH/backup_$(date +%Y%m%d_%H%M%S).sql.gz"
    
    # Keep only last 7 days of backups
    find "$BACKUP_PATH" -name "backup_*.sql.gz" -mtime +7 -delete
}

# Pull latest code
pull_code() {
    log "Pulling latest code..."
    cd "$DEPLOY_PATH"
    git fetch origin
    git pull origin main
}

# Build and restart containers
restart_services() {
    log "Building and restarting services..."
    cd "$DEPLOY_PATH"
    
    # Build new images
    docker compose build --no-cache
    
    # Restart containers
    docker compose down
    docker compose up -d
    
    log "Services restarted"
}

# Run migrations
run_migrations() {
    log "Running database migrations..."
    cd "$DEPLOY_PATH"
    
    docker compose exec -T dashboard npx db:migrate || \
        warn "Migration failed or already applied"
}

# Health check
health_check() {
    log "Running health check..."
    
    # Wait for services to start
    sleep 10
    
    # Check dashboard
    if curl -f -s http://localhost:3000/api/health > /dev/null; then
        log "Dashboard is healthy"
    else
        warn "Dashboard health check failed"
    fi
    
    # Check database
    if docker compose exec -T postgres pg_isready -U feedbackapp > /dev/null; then
        log "Database is healthy"
    else
        error "Database health check failed"
    fi
}

# Main deployment
main() {
    log "=========================================="
    log "Starting deployment..."
    log "=========================================="
    
    check_root
    backup_database
    pull_code
    restart_services
    run_migrations
    health_check
    
    log "=========================================="
    log "Deployment completed successfully!"
    log "=========================================="
    
    # Show container status
    docker compose ps
}

# Run main function
main "$@"
