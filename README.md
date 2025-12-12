# Mirror Page

A modern, static mirror station frontend built with Next.js 14, Tailwind CSS, and Shadcn UI.

## Demo

![Demo](https://raw.githubusercontent.com/ChanningHe/mirror-page/refs/heads/main/demo.png)
[Demo Site on Vercel](https://mirror-page.vercel.app/)

## Features

- ⚡ **Pure Static Generation (SSG)**: Fast, secure, and easy to deploy.
- 🎨 **Modern UI**: Built with Shadcn UI, Framer Motion, and Tailwind CSS.
- ⚙️ **Configurable**: Fully controlled via `mirrors.toml`.
- 🔄 **Auto-Build**: Generates static site at container startup based on config.

## Deployment

The container is designed to **build the static site at startup** based on your configuration files.

1. **Configure**: Edit `mirrors.toml` and `README.md`.
2. **Run**:
   ```bash
   docker-compose up -d
   ```

The container will:
1. Read your `mirrors.toml`.
2. Run `npm run build` to generate static HTML.
3. Start Caddy to serve the site and your `/data/mirrors`.

## Configuration (`mirrors.toml`)

```toml
[site]
title = "My Mirror Station"
# ...
```

## Output static files only

```bash
docker run --rm \
  -v ./mirrors.toml:/app/mirrors.toml \
  -v ./README.md:/app/README.md \
  -v ./output:/app/dist_static \
  channinghe/mirror-page:static-build
```

## Development

```bash
npm install
npm run dev
```

## License

MIT
