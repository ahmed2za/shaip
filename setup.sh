#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}Starting project setup...${NC}"

# 1. Install dependencies
echo -e "${YELLOW}Installing dependencies...${NC}"
npm install

# 2. Set up environment variables
echo -e "${YELLOW}Setting up environment variables...${NC}"
if [ ! -f .env.local ]; then
  cp .env.example .env.local
  echo -e "${GREEN}Created .env.local file. Please update it with your values.${NC}"
fi

# 3. Set up database
echo -e "${YELLOW}Setting up database...${NC}"
npx prisma generate
npx prisma migrate dev

# 4. Build the application
echo -e "${YELLOW}Building the application...${NC}"
npm run build

echo -e "${GREEN}Setup complete! You can now run 'npm run dev' to start the development server.${NC}"
echo -e "${YELLOW}Don't forget to:${NC}"
echo "1. Update your .env.local file with your credentials"
echo "2. Set up your database connection"
echo "3. Configure your authentication providers"
