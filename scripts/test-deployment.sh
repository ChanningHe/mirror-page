#!/bin/bash

# Deployment Test Script for Mirror Page

set -e

echo "🧪 Testing Mirror Page Deployment..."
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
HOST="${1:-localhost}"
PORT="${2:-80}"
BASE_URL="http://${HOST}:${PORT}"

echo -e "${BLUE}Testing URL: ${BASE_URL}${NC}"
echo ""

# Test 1: Homepage
echo -e "${BLUE}[1/5] Testing homepage...${NC}"
if curl -f -s -o /dev/null "${BASE_URL}/"; then
    echo -e "${GREEN}✓ Homepage accessible${NC}"
else
    echo -e "${RED}✗ Homepage failed${NC}"
    exit 1
fi

# Test 2: API - Mirrors list
echo -e "${BLUE}[2/5] Testing mirrors API...${NC}"
MIRRORS_JSON=$(curl -s "${BASE_URL}/api/mirrors")
if echo "$MIRRORS_JSON" | grep -q '"success":true'; then
    MIRROR_COUNT=$(echo "$MIRRORS_JSON" | grep -o '"count":[0-9]*' | grep -o '[0-9]*')
    echo -e "${GREEN}✓ Mirrors API working (${MIRROR_COUNT} mirrors found)${NC}"
else
    echo -e "${RED}✗ Mirrors API failed${NC}"
    exit 1
fi

# Test 3: API - README
echo -e "${BLUE}[3/5] Testing README API...${NC}"
README_JSON=$(curl -s "${BASE_URL}/api/readme")
if echo "$README_JSON" | grep -q '"success":true'; then
    echo -e "${GREEN}✓ README API working${NC}"
else
    echo -e "${RED}✗ README API failed${NC}"
    exit 1
fi

# Test 4: Health check
echo -e "${BLUE}[4/5] Testing health endpoint...${NC}"
if curl -f -s "${BASE_URL}/health" | grep -q "healthy"; then
    echo -e "${GREEN}✓ Health check passed${NC}"
else
    echo -e "${RED}✗ Health check failed${NC}"
    exit 1
fi

# Test 5: Static mirror access (if mirrors exist)
echo -e "${BLUE}[5/5] Testing static mirror access...${NC}"
if [ "$MIRROR_COUNT" -gt 0 ]; then
    FIRST_MIRROR=$(echo "$MIRRORS_JSON" | grep -o '"path":"[^"]*"' | head -1 | cut -d'"' -f4)
    if [ -n "$FIRST_MIRROR" ]; then
        if curl -f -s -o /dev/null "${BASE_URL}${FIRST_MIRROR}/"; then
            echo -e "${GREEN}✓ Mirror access working (${FIRST_MIRROR})${NC}"
        else
            echo -e "${YELLOW}⚠ Mirror directory not accessible${NC}"
        fi
    fi
else
    echo -e "${YELLOW}⚠ No mirrors to test${NC}"
fi

echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✓ All tests passed!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${BLUE}Service is running at: ${BASE_URL}${NC}"
echo ""


