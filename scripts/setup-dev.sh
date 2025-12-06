#!/bin/bash

# Development Setup Script for Mirror Page

set -e

echo "🚀 Setting up Mirror Page development environment..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}⚠️  Node.js is not installed. Please install Node.js 20 or later.${NC}"
    exit 1
fi

echo -e "${BLUE}📦 Installing dependencies...${NC}"
npm install

# Create test mirrors directory if it doesn't exist
if [ ! -d "/tmp/mirrors-test" ]; then
    echo -e "${BLUE}📁 Creating test mirrors directory...${NC}"
    mkdir -p /tmp/mirrors-test/{debian,ubuntu,proxmox,tailscale,truenas,docker}
    
    # Create a sample README
    cat > /tmp/mirrors-test/README.md << 'EOF'
# Mirror Repository

欢迎使用我们的镜像源服务！

## 可用镜像

本站提供以下软件包镜像服务：

- **Debian**: Debian Linux 官方软件源
- **Ubuntu**: Ubuntu Linux 官方软件源  
- **Proxmox**: Proxmox VE 虚拟化平台
- **Tailscale**: Tailscale VPN 服务
- **TrueNAS**: TrueNAS 存储系统
- **Docker**: Docker 容器镜像

## 使用方法

请根据你的操作系统选择相应的镜像源进行配置。

### Debian/Ubuntu

```bash
# 备份原有配置
sudo cp /etc/apt/sources.list /etc/apt/sources.list.backup

# 修改配置文件
sudo nano /etc/apt/sources.list
```

### Docker

```bash
# 配置 Docker daemon
sudo nano /etc/docker/daemon.json
```

## 更新频率

镜像每日同步更新，确保软件包的及时性和安全性。

## 技术支持

如有问题，请联系管理员。
EOF
    
    echo -e "${GREEN}✅ Test data created at /tmp/mirrors-test${NC}"
fi

# Create .env.local if it doesn't exist
if [ ! -f ".env.local" ]; then
    echo -e "${BLUE}⚙️  Creating .env.local...${NC}"
    cat > .env.local << 'EOF'
# Site Configuration
NEXT_PUBLIC_SITE_TITLE="Package Mirror Repository"
NEXT_PUBLIC_SITE_SUBTITLE="High-speed software package mirrors"

# Mirror data path (absolute path on the server)
MIRRORS_PATH="/tmp/mirrors-test"

# README update interval in milliseconds
NEXT_PUBLIC_README_UPDATE_INTERVAL="30000"
EOF
    echo -e "${GREEN}✅ .env.local created${NC}"
else
    echo -e "${YELLOW}⚠️  .env.local already exists, skipping...${NC}"
fi

echo ""
echo -e "${GREEN}✨ Setup complete!${NC}"
echo ""
echo -e "${BLUE}To start the development server, run:${NC}"
echo -e "  ${GREEN}npm run dev${NC}"
echo ""
echo -e "${BLUE}Then open your browser at:${NC}"
echo -e "  ${GREEN}http://localhost:3000${NC}"
echo ""

