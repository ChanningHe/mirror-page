# Mirror Page

A modern mirror site homepage built with Next.js + React + Tailwind CSS + shadcn/ui.

## Features

- 🎨 **Modern UI** - Elegant animations and interactions based on shadcn/ui
- 📦 **Auto Discovery** - Dynamically list mirror directories without hardcoding
- 📄 **Real-time README** - Automatically load and update README.md content
- 🔧 **Flexible Configuration** - Configure site information via environment variables
- 🐳 **Docker Compose** - Caddy + Next.js dual container orchestration, minimal configuration
- ⚡ **High Performance** - Caddy serves mirror files directly, Next.js handles the homepage
- 🔒 **Secure** - Fixed CVE-2025-55182 vulnerability (React 19.2.1)
- 📊 **Health Checks** - Built-in container health monitoring

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 19.2.1 + shadcn/ui (CVE-2025-55182 Fixed)
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **Markdown**: react-markdown + remark-gfm

> ⚠️ **Security Note**: This project uses React 19.2.1, which fixes the CVE-2025-55182 security vulnerability. Please ensure you do not use version 19.0.0.

## Quick Start

### 1. Clone the repository

```bash
git clone <repository-url>
cd mirror-page
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the example configuration file:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` to set your configuration:

```env
# Site Title
NEXT_PUBLIC_SITE_TITLE="Your Mirror Site"
# Site Subtitle
NEXT_PUBLIC_SITE_SUBTITLE="High-speed package mirrors"
# Mirror Data Path (Absolute path on server)
MIRRORS_PATH="/data/mirrors"
# README Update Interval (ms)
NEXT_PUBLIC_README_UPDATE_INTERVAL="30000"
```

### 4. Prepare test data (Development)

```bash
# Create test directories
mkdir -p /tmp/mirrors-test/{debian,ubuntu,proxmox}

# Create test README
echo "# Mirror Site\nWelcome to our mirror repository." > /tmp/mirrors-test/README.md
```

### 5. Start development server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Production Deployment

### Docker Compose Deployment (Recommended) ⭐

1. **Modify docker-compose.yml**

Edit `docker-compose.yml` and change both instances of `/path/to/your/mirrors` to your actual mirror path:

```yaml
volumes:
  - /path/to/your/mirrors:/data/mirrors:ro  # nextjs service
  # and
  - /path/to/your/mirrors:/data/mirrors:ro  # caddy service
```

**Note**: `NEXT_PUBLIC_` environment variables are injected at build time. If you modify them in `docker-compose.yml`, you must rebuild the image using `docker-compose up -d --build`.

2. **Start services**

```bash
# Build and start
docker-compose up -d --build

# View logs
docker-compose logs -f
```

The site will be available at port `80`.

### Directory Structure Requirement

Your mirror directory structure should look like this:

```
/path/to/your/mirrors/
├── debian/          # Mirror directory
├── ubuntu/          # Mirror directory
├── centos/          # Mirror directory
└── README.md        # Documentation file (Displayed on homepage)
```

## Configuration Reference

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_SITE_TITLE` | Site main title | Package Mirror Repository |
| `NEXT_PUBLIC_SITE_SUBTITLE` | Site subtitle | High-speed software package mirrors |
| `MIRRORS_PATH` | Path to mirrors directory (Container internal path) | /data/mirrors |
| `NEXT_PUBLIC_README_UPDATE_INTERVAL` | README update polling interval (ms) | 30000 |

### Build Arguments (Docker)

To change the site title or subtitle when using Docker, you need to pass build arguments:

```yaml
# docker-compose.yml
services:
  nextjs:
    build:
      args:
        NEXT_PUBLIC_SITE_TITLE: "My Custom Mirror"
```

## Security Updates

### React CVE-2025-55182
This project has been updated to React 19.2.1 to address the CVE-2025-55182 vulnerability.
- `react`: ^19.2.1
- `react-dom`: ^19.2.1

## License

MIT
