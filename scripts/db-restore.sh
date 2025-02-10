#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Check if backup file is provided
if [ -z "$1" ]; then
    echo -e "${RED}Error: Please provide the backup file path${NC}"
    echo "Usage: ./db-restore.sh <backup_file>"
    exit 1
fi

# Check if backup file exists
if [ ! -f "$1" ]; then
    echo -e "${RED}Error: Backup file not found: $1${NC}"
    exit 1
fi

# Confirm restore
echo -e "${YELLOW}Warning: This will overwrite the current database. Are you sure? (y/N)${NC}"
read -r response
if [[ ! "$response" =~ ^([yY][eE][sS]|[yY])+$ ]]; then
    echo "Restore cancelled."
    exit 0
fi

# Restore database
echo -e "${YELLOW}Restoring database from backup...${NC}"
psql $DATABASE_URL < "$1"

echo -e "${GREEN}Database restore completed successfully!${NC}"
