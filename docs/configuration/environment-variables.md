# Environment Variables

This page documents every environment variable used by the BioRemPP Database Explorer — covering the Express server, Vite frontend build, NGINX proxy, and Docker Compose profiles.

---

## Quick Reference

Copy and adjust `.env.example` as your starting point:

```bash
cp .env.example .env
```

Minimal example `.env`:

```env
PORT=3000
SQLITE_DB_PATH=./data/biorempp.sqlite
BIOREMPP_URL_BASE_PATH=/bioremppdbx/
BIOREMPP_URL_BASE_PATH_NO_TRAILING=/bioremppdbx
VITE_BIOREMPP_URL_BASE_PATH=/bioremppdbx/
VITE_DEV_API_ORIGIN=http://127.0.0.1:3101
HTTP_PORT=83
DOMAIN=localhost
BASIC_AUTH_HTPASSWD_PATH=./.docker/auth/bioremppdbx.htpasswd
BASIC_AUTH_REALM=BioRemPPDBX Restricted Access
NGINX_API_RATE_LIMIT=20r/s
NGINX_API_RATE_LIMIT_BURST=40
NGINX_GUIDED_EXECUTE_RATE_LIMIT=30r/s
NGINX_GUIDED_EXECUTE_RATE_LIMIT_BURST=10
RATE_LIMIT_TRUST_PROXY=1
RATE_LIMIT_GLOBAL_MAX=1200
RATE_LIMIT_GLOBAL_WINDOW_MS=60000
RATE_LIMIT_KEGG_MAX=20
RATE_LIMIT_KEGG_WINDOW_MS=60000
RATE_LIMIT_GUIDED_MAX=60
RATE_LIMIT_GUIDED_WINDOW_MS=60000
KEGG_IMAGE_CACHE_ENABLED=true
KEGG_IMAGE_CACHE_DIR=./data/kegg-images
```

---

## Application Server Variables

### `PORT`

| Property | Value |
|----------|-------|
| **Consumer** | `server/index.mjs` |
| **Default** | `3000` (production), `3101` (dev) |
| **Type** | Integer |

Internal TCP port on which the Express server listens. In the `prod` Docker Compose profile, this port is not exposed to the host — NGINX proxies to it internally via the `bioremppdbx-app:3000` upstream.

```env
PORT=3000
```

---

### `SQLITE_DB_PATH`

| Property | Value |
|----------|-------|
| **Consumer** | `server/index.mjs` |
| **Default** | `./data/biorempp.sqlite` |
| **Type** | File path (string) |

Absolute or relative path to the SQLite runtime database. The server opens this file in **read-only mode** (`readonly: true, fileMustExist: true`). If the file does not exist at startup, the process throws immediately.

Inside Docker containers the path is `/app/data/biorempp.sqlite`.

```env
SQLITE_DB_PATH=./data/biorempp.sqlite
```

Generating the database from CSV source files:

```bash
npm run ingest:sqlite
```

---

### `BIOREMPP_URL_BASE_PATH`

| Property | Value |
|----------|-------|
| **Consumer** | `server/index.mjs`, NGINX template |
| **Default** | `/bioremppdbx/` |
| **Type** | String (must start and end with `/`) |
| **Canonical value** | `/bioremppdbx/` |

The URL base path under which the application is served. The Express server mounts the entire app router under this path via `rootApp.use(BASE_PATH, app)`.

**Must be consistent** with `VITE_BIOREMPP_URL_BASE_PATH` and `BIOREMPP_URL_BASE_PATH_NO_TRAILING`. A mismatch causes route duplication (`/bioremppdbx/bioremppdbx/...`) or broken internal navigation.

```env
BIOREMPP_URL_BASE_PATH=/bioremppdbx/
```

---

### `BIOREMPP_URL_BASE_PATH_NO_TRAILING`

| Property | Value |
|----------|-------|
| **Consumer** | NGINX template |
| **Default** | `/bioremppdbx` |
| **Type** | String (no trailing slash) |

The same base path without a trailing slash. Used in NGINX `location` directives and redirect rules. Must always equal `BIOREMPP_URL_BASE_PATH` with the trailing slash removed.

```env
BIOREMPP_URL_BASE_PATH_NO_TRAILING=/bioremppdbx
```

---

## Express Rate Limiting { #express-rate-limiting }

These variables control the `express-rate-limit` middleware applied directly by the Express server, providing rate limiting independently of NGINX. All limiters use a sliding window and return `RateLimit-*` response headers (`standardHeaders: 'draft-8'`).

When these variables are present in `.env`, they override the code-level fallbacks. Guided execute is therefore controlled by explicit environment values in both Express and NGINX, not by inferred defaults.

### `RATE_LIMIT_TRUST_PROXY`

| Property | Value |
|----------|-------|
| **Consumer** | `server/index.mjs` (`app.set('trust proxy', ...)`) |
| **Default** | `1` |
| **Type** | Integer |

Number of proxy hops to trust when determining the client IP. Set to `1` when the app runs behind a single NGINX reverse proxy. Controls how `express-rate-limit` extracts the real client IP from `X-Forwarded-For`.

```env
RATE_LIMIT_TRUST_PROXY=1
```

---

### `RATE_LIMIT_GLOBAL_MAX` / `RATE_LIMIT_GLOBAL_WINDOW_MS`

| Property | Default |
|----------|---------|
| `RATE_LIMIT_GLOBAL_MAX` | `1200` |
| `RATE_LIMIT_GLOBAL_WINDOW_MS` | `60000` (60 s) |

Global rate limit applied to **all** `/api/*` routes. Requests exceeding the limit receive `429 Too Many Requests`.

```env
RATE_LIMIT_GLOBAL_MAX=1200
RATE_LIMIT_GLOBAL_WINDOW_MS=60000
```

---

### `RATE_LIMIT_KEGG_MAX` / `RATE_LIMIT_KEGG_WINDOW_MS`

| Property | Default |
|----------|---------|
| `RATE_LIMIT_KEGG_MAX` | `20` |
| `RATE_LIMIT_KEGG_WINDOW_MS` | `60000` (60 s) |

Per-route limit applied only to `GET /api/compounds/:cpd/kegg-image`. Protects the upstream KEGG API from excessive proxy requests.

```env
RATE_LIMIT_KEGG_MAX=20
RATE_LIMIT_KEGG_WINDOW_MS=60000
```

---

### `RATE_LIMIT_GUIDED_MAX` / `RATE_LIMIT_GUIDED_WINDOW_MS`

| Property | Default |
|----------|---------|
| `RATE_LIMIT_GUIDED_MAX` | `60` |
| `RATE_LIMIT_GUIDED_WINDOW_MS` | `60000` (60 s) |

Per-route limit applied only to `POST /api/guided/queries/:id/execute`. This is the Express-side limit used in local development and in any deployment path that reaches the app directly.

```env
RATE_LIMIT_GUIDED_MAX=60
RATE_LIMIT_GUIDED_WINDOW_MS=60000
```

---

## KEGG Image Cache { #kegg-image-cache }

These variables control the two-tier server-side cache (in-process `Map` + disk) for KEGG structure images.

### `KEGG_IMAGE_CACHE_ENABLED`

| Property | Value |
|----------|-------|
| **Consumer** | `server/shared/kegg.mjs` |
| **Default** | `true` |
| **Type** | Boolean (`true` / `false`) |

Enables or disables the disk cache for KEGG structure images. When `true`, fetched images are persisted to `KEGG_IMAGE_CACHE_DIR` and served from disk on subsequent requests. Set to `false` to disable disk persistence (in-process cache still applies within the process lifetime).

```env
KEGG_IMAGE_CACHE_ENABLED=true
```

---

### `KEGG_IMAGE_CACHE_DIR`

| Property | Value |
|----------|-------|
| **Consumer** | `server/shared/kegg.mjs` |
| **Default** | `./data/kegg-images` |
| **Type** | Directory path (string) |

Directory where KEGG structure images are cached. The directory is created automatically at server startup if it does not exist and `KEGG_IMAGE_CACHE_ENABLED=true`. Images are stored as `{cpd}.gif`, `{cpd}.png`, or `{cpd}.jpg` depending on the content type returned by KEGG. Not-found responses are stored as `{cpd}.404` sentinels to avoid repeated upstream requests.

Inside Docker containers the path resolves relative to `/app`:

```env
KEGG_IMAGE_CACHE_DIR=./data/kegg-images
```

---

## Frontend Build Variables (VITE_*)

Vite variables are injected at **build time** and bundled into the static frontend assets. They cannot be changed at runtime without rebuilding.

### `VITE_BIOREMPP_URL_BASE_PATH`

| Property | Value |
|----------|-------|
| **Consumer** | `vite.config.ts` (Vite `base` option) |
| **Default** | `/bioremppdbx/` |
| **Type** | String (must start and end with `/`) |
| **When set** | Before `npm run build` or as a Docker build ARG |

Sets the Vite `base` configuration, which prefixes all asset URLs and the React Router base path in the compiled SPA.

**Must equal `BIOREMPP_URL_BASE_PATH`** to prevent base path duplication at runtime.

Passed as a Docker build argument:

```yaml
args:
  VITE_BIOREMPP_URL_BASE_PATH: ${VITE_BIOREMPP_URL_BASE_PATH:-/bioremppdbx/}
```

---

### `VITE_DEV_API_ORIGIN`

| Property | Value |
|----------|-------|
| **Consumer** | `vite.config.ts` (dev proxy) |
| **Default** | `http://127.0.0.1:3101` |
| **Type** | URL string |
| **When set** | Development only |

Vite dev server proxy target for API requests. In development mode, requests to `/{base}/api/*` are proxied to this origin. Not used in production builds.

```env
VITE_DEV_API_ORIGIN=http://127.0.0.1:3101
```

---

## NGINX Variables

NGINX template variables are consumed via Docker Compose `environment:` blocks and expanded in the NGINX configuration template at container startup (`envsubst`).

### `APP_UPSTREAM`

| Property | Value |
|----------|-------|
| **Consumer** | NGINX template (`upstream bioremppdbx_app`) |
| **Default** | `bioremppdbx-app:3000` (hardcoded in `docker-compose.yml`) |
| **Type** | Host:port string |

Address of the upstream Express application server. In Docker Compose, this is the service name and internal port.

---

### `DOMAIN`

| Property | Value |
|----------|-------|
| **Consumer** | NGINX template (`server_name`) |
| **Default** | `localhost` |
| **Type** | Hostname string |

NGINX `server_name` directive. Set to the public hostname or IP for institutional deployments.

```env
DOMAIN=biorempp.institution.edu
```

---

### `HTTP_PORT`

| Property | Value |
|----------|-------|
| **Consumer** | Docker Compose port mapping for `bioremppdbx-nginx` |
| **Default** | `83` |
| **Type** | Integer |

Host port mapped to NGINX container port 80. Access the application at `http://localhost:{HTTP_PORT}/{base_path}/`.

```env
HTTP_PORT=83
```

---

### `BASIC_AUTH_HTPASSWD_PATH`

| Property | Value |
|----------|-------|
| **Consumer** | Docker Compose volume mount for NGINX |
| **Default** | `./.docker/auth/bioremppdbx.htpasswd` |
| **Type** | Host file path |

Path on the **host machine** to the htpasswd file mounted into the NGINX container as `/etc/nginx/auth/.htpasswd`. Must be created before starting the `prod` profile.

Create the htpasswd file:

```bash
mkdir -p .docker/auth
htpasswd -c .docker/auth/bioremppdbx.htpasswd your-user
```

---

### `BASIC_AUTH_REALM`

| Property | Value |
|----------|-------|
| **Consumer** | NGINX template (`auth_basic`) |
| **Default** | `BioRemPPDBX Restricted Access` |
| **Type** | String |

Prompt label shown by the browser HTTP Basic Auth dialog.

```env
BASIC_AUTH_REALM=BioRemPPDBX Restricted Access
```

---

### Rate Limiting Variables

#### `NGINX_API_RATE_LIMIT` / `NGINX_API_RATE_LIMIT_BURST`

| Property | Default |
|----------|---------|
| `NGINX_API_RATE_LIMIT` | `20r/s` |
| `NGINX_API_RATE_LIMIT_BURST` | `40` |

Applied to all `{base_path}/api/*` requests (read-only API surface). Controls the `limit_req_zone` rate and burst size.

```env
NGINX_API_RATE_LIMIT=20r/s
NGINX_API_RATE_LIMIT_BURST=40
```

#### `NGINX_GUIDED_EXECUTE_RATE_LIMIT` / `NGINX_GUIDED_EXECUTE_RATE_LIMIT_BURST`

| Property | Default |
|----------|---------|
| `NGINX_GUIDED_EXECUTE_RATE_LIMIT` | `30r/s` |
| `NGINX_GUIDED_EXECUTE_RATE_LIMIT_BURST` | `10` |

Rate limit applied specifically to `POST /api/guided/queries/:id/execute` at the NGINX edge. This configuration is independent from the Express limiter and uses NGINX rate syntax (`30r/s`) plus burst capacity.

```env
NGINX_GUIDED_EXECUTE_RATE_LIMIT=30r/s
NGINX_GUIDED_EXECUTE_RATE_LIMIT_BURST=10
```

---

## TLS Profile Variables (prod-ssl-local only)

Used only with the `prod-ssl-local` Compose profile for local TLS homologation.

| Variable | Default | Purpose |
|----------|---------|---------|
| `HTTP_MOCK_PORT` | `8081` | Host port for HTTP → HTTPS redirect |
| `HTTPS_MOCK_PORT` | `8443` | Host port for HTTPS |
| `SSL_CERT_PATH` | `./.docker/certs/biorempp-local.crt` | Host path to TLS certificate |
| `SSL_KEY_PATH` | `./.docker/certs/biorempp-local.key` | Host path to TLS private key |

---

## Dev Profile Variables

| Variable | Default | Purpose |
|----------|---------|---------|
| `DEV_WEB_PORT` | `5173` | Host port for Vite dev server |
| `DEV_API_PORT` | `3101` | Host port for dev API server |

---

## Variable Consistency Rules

Certain variables must be set consistently to avoid runtime errors:

| Rule | Variables |
|------|----------|
| Trailing slash parity | `BIOREMPP_URL_BASE_PATH` must end with `/`; `BIOREMPP_URL_BASE_PATH_NO_TRAILING` must not |
| Frontend/backend agreement | `VITE_BIOREMPP_URL_BASE_PATH` must equal `BIOREMPP_URL_BASE_PATH` |
| Build-time commitment | `VITE_*` variables cannot be changed without rebuilding the frontend |

See [Base Path and Subpath Deployment](base-path-subpath-deployment.md) for full consistency guidance and troubleshooting.
