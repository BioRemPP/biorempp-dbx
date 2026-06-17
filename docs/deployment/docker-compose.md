# Docker Compose Deployment

## Overview

This project runs as a Node monolith (Express API + Vite-built SPA) with SQLite in read-only mode at runtime.

- Supported profiles:
  - `dev`: hot reload (Vite + API)
  - `prod`: app + Nginx reverse proxy on HTTP
  - `prod-ssl-local`: app + Nginx with local TLS cert mount (homologation only)
- Canonical institutional subpath:
  - `BIOREMPP_URL_BASE_PATH=/bioremppdbx/`

Production deployment is intended for controlled institutional access. The bundled Nginx layer protects the whole application, keeps `/health` unauthenticated for infrastructure probes, and rate-limits the internal read-only API surface.

## Environment

Copy `.env.example` and adjust values:

```bash
cp .env.example .env
```

Main variables:

- `BIOREMPP_URL_BASE_PATH` (backend + nginx), e.g. `/bioremppdbx/`
- `VITE_BIOREMPP_URL_BASE_PATH` (frontend build/dev), e.g. `/bioremppdbx/`
- `PORT` (runtime app port inside container, default `3000`)
- `SQLITE_DB_PATH` (runtime path inside app container, default `/app/data/biorempp.sqlite`)
- `BASIC_AUTH_HTPASSWD_PATH` (host path to the htpasswd file mounted into the production Nginx container)
- `BASIC_AUTH_REALM` (prompt label used by proxy auth)
- `NGINX_API_RATE_LIMIT` / `NGINX_API_RATE_LIMIT_BURST` (generic `/api/*` throttling at the proxy layer)
- `NGINX_GUIDED_EXECUTE_RATE_LIMIT` / `NGINX_GUIDED_EXECUTE_RATE_LIMIT_BURST` (guided execution throttling at the proxy layer)
- `RATE_LIMIT_GUIDED_MAX` / `RATE_LIMIT_GUIDED_WINDOW_MS` (guided execution throttling inside Express)

## Development Profile

```bash
docker compose --profile dev up --build
```

Expected:

- Web: `http://localhost:5173/bioremppdbx/`
- API: proxied under `/bioremppdbx/api/*`
- Internal API port exposed on host: `3101`
- No auth is applied in the dev profile by default

## Production Auth Secret

Create an htpasswd file before starting a production profile:

```bash
mkdir -p .docker/auth
htpasswd -c .docker/auth/bioremppdbx.htpasswd your-user
```

## Production Profile (HTTP)

```bash
docker compose --profile prod up -d --build
```

Expected:

- App via Nginx: `http://localhost/bioremppdbx/`
- Browser access prompts for HTTP Basic Auth before the SPA or `/api/*` is served
- Generic `/api/*` requests are rate-limited at the proxy
- `POST /api/guided/queries/:id/execute` is rate-limited at two independent layers: Express and Nginx
- Proxy health: `http://localhost/health`
- Internal app health: `http://localhost:3000/health` (inside network)

## Production Profile with Local TLS Mock (optional)

Generate a local cert/key and mount:

- `SSL_CERT_PATH=./.docker/certs/biorempp-local.crt`
- `SSL_KEY_PATH=./.docker/certs/biorempp-local.key`

Run:

```bash
docker compose --profile prod --profile prod-ssl-local up -d --build
```

Expected:

- HTTP redirect: `http://localhost:8081` -> HTTPS
- HTTPS app: `https://localhost:8443/bioremppdbx/`

## Institutional Ingress Checklist

- TLS termination should happen at institutional ingress/load balancer.
- The whole application should remain behind institutional authentication, VPN, or equivalent network controls even when the bundled Nginx profile is replaced.
- Forward headers:
  - `X-Forwarded-Proto`
  - `X-Forwarded-For`
  - `X-Forwarded-Host`
- Preserve the real client IP or apply equivalent rate limiting at the ingress layer.
- Keep external route prefix aligned with:
  - `BIOREMPP_URL_BASE_PATH=/bioremppdbx/`
- Health probe target:
  - `/health`
