# Docker Integration

This page documents the Docker Compose profiles, Dockerfile stages, service definitions, health checks, and data pipeline for the BioRemPP Database Explorer.

---

## Compose Project

**Project name:** `bioremppdbx`  
**File:** `docker-compose.yml`

---

## Profiles

Three profiles cover the main deployment scenarios:

| Profile | Services started | Use case |
|---------|----------------|---------|
| `dev` | `bioremppdbx-dev` | Local development with hot reload |
| `prod` | `bioremppdbx-app` + `bioremppdbx-nginx` | Institutional production (HTTP) |
| `prod-ssl-local` | `bioremppdbx-app` + `bioremppdbx-nginx-ssl-local` | Local TLS homologation |

---

## Dockerfile Stages

The Dockerfile uses a **multi-stage build**:

### Stage: `base`

```dockerfile
FROM node:22-bookworm-slim AS base
WORKDIR /app
COPY package*.json ./
```

Installs Node 22 and copies package manifests. Shared by all other stages.

---

### Stage: `dev`

```dockerfile
FROM base AS dev
RUN npm install --legacy-peer-deps
COPY . .
ENV NODE_ENV=development
ENV PORT=3101
ENV SQLITE_DB_PATH=/app/data/biorempp.sqlite
ENV BIOREMPP_URL_BASE_PATH=/bioremppdbx/
ENV VITE_BIOREMPP_URL_BASE_PATH=/bioremppdbx/
ENV VITE_DEV_API_ORIGIN=http://127.0.0.1:3101
EXPOSE 5173 3101
CMD ["npm", "run", "dev"]
```

Full source mount with hot reload. Exposes Vite (5173) and API (3101).

---

### Stage: `build`

```dockerfile
FROM base AS build
RUN npm install --legacy-peer-deps
COPY . .
ARG VITE_BIOREMPP_URL_BASE_PATH=/
ENV VITE_BIOREMPP_URL_BASE_PATH=${VITE_BIOREMPP_URL_BASE_PATH}
RUN npm run ingest:sqlite
RUN npm run check:footprint
RUN npm run build
```

The build stage:

1. Accepts `VITE_BIOREMPP_URL_BASE_PATH` as a **Docker build ARG** — this is the only way to inject a build-time Vite variable in Docker
2. Runs `npm run ingest:sqlite` to generate `data/biorempp.sqlite` from CSV sources
3. Runs `npm run check:footprint` to validate the generated database size
4. Runs `npm run build` (which includes `compile:configs` + Vite build)

!!! warning "Base path ARG"
    The default value of `VITE_BIOREMPP_URL_BASE_PATH` in the Dockerfile `ARG` instruction is `/` (root). Always override it with the correct subpath when building for institutional deployment.

---

### Stage: `runtime`

```dockerfile
FROM node:22-bookworm-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV SQLITE_DB_PATH=/app/data/biorempp.sqlite
ENV BIOREMPP_URL_BASE_PATH=/
COPY package*.json ./
RUN npm install --omit=dev --legacy-peer-deps
COPY --from=build /app/server ./server
COPY --from=build /app/dist ./dist
COPY --from=build /app/data/biorempp.sqlite ./data/biorempp.sqlite
USER node
EXPOSE 3000
CMD ["node", "server/index.mjs"]
```

Minimal production image: production dependencies only, compiled `server/`, compiled `dist/`, and the SQLite database. Runs as the `node` user (non-root).

**Default `BIOREMPP_URL_BASE_PATH` in the runtime stage is `/`** — override it in `docker-compose.yml` or at `docker run` time.

---

## Service Definitions

### `bioremppdbx-dev` (profile: `dev`)

```yaml
build:
  context: .
  dockerfile: Dockerfile
  target: dev
  args:
    VITE_BIOREMPP_URL_BASE_PATH: ${VITE_BIOREMPP_URL_BASE_PATH:-/bioremppdbx/}
environment:
  PORT: ${DEV_API_PORT:-3101}
  SQLITE_DB_PATH: /app/data/biorempp.sqlite
  BIOREMPP_URL_BASE_PATH: ${BIOREMPP_URL_BASE_PATH:-/bioremppdbx/}
  VITE_BIOREMPP_URL_BASE_PATH: ${VITE_BIOREMPP_URL_BASE_PATH:-/bioremppdbx/}
  VITE_DEV_API_ORIGIN: http://127.0.0.1:${DEV_API_PORT:-3101}
ports:
  - "${DEV_WEB_PORT:-5173}:5173"
  - "${DEV_API_PORT:-3101}:3101"
volumes:
  - ./:/app
  - /app/node_modules
```

Source directory is volume-mounted for hot reload. `node_modules` is mounted as a named volume to avoid the host overwriting the container's packages.

**Start dev profile:**

```bash
docker compose --profile dev up -d --build
```

Expected URLs:
- Vite dev: `http://localhost:5173/bioremppdbx/`
- API: `http://localhost:3101`

---

### `bioremppdbx-app` (profile: `prod`, `prod-ssl-local`)

```yaml
build:
  context: .
  dockerfile: Dockerfile
  target: runtime
  args:
    VITE_BIOREMPP_URL_BASE_PATH: ${VITE_BIOREMPP_URL_BASE_PATH:-/bioremppdbx/}
environment:
  PORT: ${PORT:-3000}
  SQLITE_DB_PATH: /app/data/biorempp.sqlite
  BIOREMPP_URL_BASE_PATH: ${BIOREMPP_URL_BASE_PATH:-/bioremppdbx/}
expose:
  - "3000"
```

Exposes port 3000 to the Docker internal network only (not published to the host). NGINX connects to it via the `bioremppdbx-app:3000` upstream.

**Health check:**

```yaml
healthcheck:
  test:
    - "CMD"
    - "node"
    - "-e"
    - "fetch('http://127.0.0.1:3000/health').then((r)=>{if(!r.ok)process.exit(1)}).catch(()=>process.exit(1))"
  interval: 30s
  timeout: 10s
  retries: 5
  start_period: 20s
```

The NGINX service depends on `bioremppdbx-app` with condition `service_healthy` — NGINX will not start until the app passes its health check.

---

### `bioremppdbx-nginx` (profile: `prod`)

```yaml
image: nginx:1.27-alpine
environment:
  APP_UPSTREAM: bioremppdbx-app:3000
  BIOREMPP_URL_BASE_PATH: ${BIOREMPP_URL_BASE_PATH:-/bioremppdbx/}
  BIOREMPP_URL_BASE_PATH_NO_TRAILING: ${BIOREMPP_URL_BASE_PATH_NO_TRAILING:-/bioremppdbx}
  DOMAIN: ${DOMAIN:-localhost}
  BASIC_AUTH_REALM: ${BASIC_AUTH_REALM:-BioRemPPDBX Restricted Access}
  NGINX_API_RATE_LIMIT: ${NGINX_API_RATE_LIMIT:-20r/s}
  NGINX_API_RATE_LIMIT_BURST: ${NGINX_API_RATE_LIMIT_BURST:-40}
  NGINX_GUIDED_EXECUTE_RATE_LIMIT: ${NGINX_GUIDED_EXECUTE_RATE_LIMIT:-30r/s}
  NGINX_GUIDED_EXECUTE_RATE_LIMIT_BURST: ${NGINX_GUIDED_EXECUTE_RATE_LIMIT_BURST:-10}
ports:
  - "${HTTP_PORT:-83}:80"
volumes:
  - ./.docker/nginx/nginx.prod.conf.template:/etc/nginx/templates/default.conf.template:ro
  - ${BASIC_AUTH_HTPASSWD_PATH:-./.docker/auth/bioremppdbx.htpasswd}:/etc/nginx/auth/.htpasswd:ro
depends_on:
  bioremppdbx-app:
    condition: service_healthy
```

---

### `bioremppdbx-nginx-ssl-local` (profile: `prod-ssl-local`)

Identical to `bioremppdbx-nginx` with additional TLS mounts:

```yaml
ports:
  - "${HTTP_MOCK_PORT:-8081}:80"
  - "${HTTPS_MOCK_PORT:-8443}:443"
volumes:
  - ./.docker/nginx/nginx.prod.tls-local.conf.template:...
  - ${BASIC_AUTH_HTPASSWD_PATH:-./.docker/auth/bioremppdbx.htpasswd}:...
  - ${SSL_CERT_PATH:-./.docker/certs/biorempp-local.crt}:/etc/nginx/certs/server.crt:ro
  - ${SSL_KEY_PATH:-./.docker/certs/biorempp-local.key}:/etc/nginx/certs/server.key:ro
```

HTTP on port 8081 redirects (308) to HTTPS on port 8443.

---

## Production Startup Sequence

```bash
# 1. Create htpasswd file
mkdir -p .docker/auth
htpasswd -c .docker/auth/bioremppdbx.htpasswd your-user

# 2. Copy and configure environment
cp .env.example .env
# edit .env as needed

# 3. Start production profile
docker compose --profile prod up -d --build
```

Expected production URL: `http://localhost:83/bioremppdbx/`

The guided execute endpoint is protected by two explicit environment-variable families:

- Express: `RATE_LIMIT_GUIDED_MAX` + `RATE_LIMIT_GUIDED_WINDOW_MS`
- NGINX: `NGINX_GUIDED_EXECUTE_RATE_LIMIT` + `NGINX_GUIDED_EXECUTE_RATE_LIMIT_BURST`

If those variables are present in `.env`, they override the code-level fallbacks.

---

## Production Health Probes

| Probe target | URL | Auth |
|-------------|-----|------|
| NGINX (external) | `http://localhost:83/health` | None |
| App (internal) | `http://localhost:3000/health` | None (inside Docker network) |

---

## Volume Summary

| Volume | Purpose |
|--------|---------|
| `./:/app` (dev only) | Source code hot reload |
| `/app/node_modules` (dev only) | Isolate container packages from host |
| `.docker/nginx/*.conf.template` | NGINX config template (read-only) |
| `BASIC_AUTH_HTPASSWD_PATH` | htpasswd credentials (read-only) |
| `SSL_CERT_PATH` / `SSL_KEY_PATH` | TLS cert/key (prod-ssl-local only) |

The SQLite database is **baked into the runtime image** at build time — it is not a volume mount in production. This ensures the database is immutable and consistent with the built application.

---

## Related Pages

- [Environment Variables](environment-variables.md) — all variables used by Compose services
- [NGINX Integration](nginx-integration.md) — NGINX template and rate limiting
- [Base Path and Subpath Deployment](base-path-subpath-deployment.md) — base path ARG and runtime consistency
- [Institutional Ingress Handoff](institutional-ingress-handoff.md) — external proxy requirements
