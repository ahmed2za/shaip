#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Get current date for backup file name
DATE=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="./backups"

# Create backups directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Backup database
echo -e "${YELLOW}Creating database backup...${NC}"
pg_dump $DATABASE_URL > "$BACKUP_DIR/backup_$DATE.sql"

# Keep only last 5 backups
echo -e "${YELLOW}Cleaning old backups...${NC}"
ls -t $BACKUP_DIR/backup_*.sql | tail -n +6 | xargs -r rm

echo -e "${GREEN}Backup completed successfully!${NC}"
echo "Backup file: $BACKUP_DIR/backup_$DATE.sql"
