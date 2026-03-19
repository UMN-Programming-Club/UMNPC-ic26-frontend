# DOMjudge Frontend (Vite + React + TypeScript)

This frontend reads live data from DOMjudge API v4 and is ready for static hosting (including GitHub Pages).

Important: in a browser app, network requests are always visible in DevTools. You cannot fully hide that requests happen. The secure approach is to hide your real DOMjudge host/IP behind a reverse proxy and expose only the proxy endpoint.

## Requirements

- Node.js 22 (recommended, see `.nvmrc`)
- npm

## Run locally

```bash
npm ci
npm run dev
```

## Runtime config (for VPS/domain migration)

Edit `public/app-config.json` to change backend target without touching source code:

```json
{
  "apiBaseUrl": "/api/v4",
  "contestId": "demo",
  "withCredentials": true,
  "autoRefreshMs": 15000,
  "requestTimeoutMs": 10000
}
```

Fields:

- `apiBaseUrl`: API base URL (relative or absolute). Use `/api/v4` with a reverse proxy for best security.
- `contestId`: optional specific contest id. If empty, the first contest is used.
- `withCredentials`: send cookies for authenticated endpoints.
- `autoRefreshMs`: dashboard refresh interval.
- `requestTimeoutMs`: timeout per request.

## Security notes

- Do not store API secrets or tokens in frontend files.
- Use HTTPS for production API endpoints.
- Cookie-based auth depends on backend CORS and cookie settings.
- For GitHub Pages, put DOMjudge behind a reverse proxy and only expose proxy URL to frontend.

## Hiding backend host/IP (recommended)

Use a reverse proxy in front of DOMjudge:

1. Frontend calls `/api/v4` (or `https://api.yourdomain.tld/api/v4`).
2. Proxy forwards requests to your private DOMjudge endpoint.
3. Browser sees only the proxy address, not your internal DOMjudge host/IP.

Example proxy config is available in `proxy/nginx.domjudge-proxy.conf.example`.

## Optional build-time env

Copy `.env.example` to `.env` if you want build-time defaults:

```bash
cp .env.example .env
```

`public/app-config.json` still overrides those defaults at runtime.

## Build

```bash
npm run build
```

For GitHub Pages static hosting:

```bash
npm run build:pages
```

## GitHub Pages deployment

A workflow is included at `.github/workflows/deploy-pages.yml`.

1. Push this repo to GitHub.
2. In GitHub repository settings, enable Pages with source: GitHub Actions.
3. Push to `main` branch to trigger deployment.

Before deploying, set `public/app-config.json` to your VPS/domain API URL.

For the safest setup, keep `apiBaseUrl` as `/api/v4` and route it through your reverse proxy domain.
