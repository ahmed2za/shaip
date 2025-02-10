#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}Starting deployment process...${NC}"

# 1. Install dependencies
echo -e "${YELLOW}Installing dependencies...${NC}"
npm install

# 2. Run type checking
echo -e "${YELLOW}Running type checking...${NC}"
npm run type-check

# 3. Run linting
echo -e "${YELLOW}Running linting...${NC}"
npm run lint

# 4. Build the application
echo -e "${YELLOW}Building the application...${NC}"
npm run build

# 5. Run database migrations
echo -e "${YELLOW}Running database migrations...${NC}"
npx prisma migrate deploy

# 6. Start the application
echo -e "${GREEN}Starting the application...${NC}"
npm start
