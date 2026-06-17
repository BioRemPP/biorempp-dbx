# Configuration Overview

This section documents the complete configuration surface of the BioRemPP Database Explorer — from environment variables and frontend build parameters to YAML content configuration, NGINX templates, Docker Compose profiles, and institutional ingress handoff.

---

## Architecture

BioRemPP Database Explorer is a **Node.js monolith** combining a React/Vite SPA and an Express API server in a single deployable unit:

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React + Vite + TypeScript | SPA served as static files from `dist/` |
| **Backend** | Node.js + Express | API server — entry point `server/index.mjs`, domain routers in `server/routes/`, shared utilities in `server/shared/` |
| **Database** | SQLite (better-sqlite3) | Read-only at runtime (`data/biorempp.sqlite`) |
| **Reverse proxy** | NGINX 1.27 | HTTP Basic Auth, rate limiting, subpath routing |
| **Content config** | YAML (compiled) | Guided analysis, FAQ, contact, home page |

The application is designed for **institutional subpath deployment** under a canonical base path:

```
BIOREMPP_URL_BASE_PATH=/bioremppdbx/
```

---

## Quick Navigation

| Page | Coverage |
|------|---------|
| **[Environment Variables](environment-variables.md)** | All runtime and build-time variables, defaults, and effects |
| **[YAML Content Configuration](yaml-content-configuration.md)** | Guided analysis YAML, editorial YAML, compile pipeline |
| **[Frontend Build Configuration](frontend-build-configuration.md)** | Vite config, base path normalization, dev proxy, build output |
| **[Base Path and Subpath Deployment](base-path-subpath-deployment.md)** | Base path mechanics, consistency rules, troubleshooting |
| **[API Endpoint Configuration](api-endpoint-configuration.md)** | Express routes, base path mounting, health endpoint |
| **[NGINX Integration](nginx-integration.md)** | Nginx templates, rate limiting, auth, TLS local profile |
| **[Docker Integration](docker-integration.md)** | Compose profiles (dev/prod/prod-ssl-local), Dockerfile stages, health checks |
| **[Institutional Ingress Handoff](institutional-ingress-handoff.md)** | TLS termination, forwarded headers, external routing |

---

## Deployment Profiles

Three Docker Compose profiles cover the main deployment scenarios:

| Profile | Use case | Nginx | Auth |
|---------|---------|-------|------|
| `dev` | Local hot-reload development | No | None |
| `prod` | Institutional production (HTTP) | Yes | HTTP Basic Auth |
| `prod-ssl-local` | Local TLS homologation | Yes (TLS) | HTTP Basic Auth |

---

## Configuration Precedence

At runtime, the Express server reads environment variables directly. For Vite build-time variables (`VITE_*`), values must be present at **build time** (passed as Docker build args or set in `.env` before running `npm run build`).

| Variable type | When it must be set | How it is consumed |
|--------------|--------------------|--------------------|
| `VITE_*` | At `vite build` time | Bundled into the frontend static assets |
| Non-`VITE_*` | At container startup | Read by `server/index.mjs` at runtime |
| NGINX template vars | At `nginx` container startup | Expanded by `envsubst` via Docker Entrypoint |

---

## Data Pipeline

The SQLite database must be generated before the build or startup:

```bash
npm run ingest:sqlite
```

This script ingests the CSV source files from `data/` into `data/biorempp.sqlite`. The runtime server opens this file in **read-only mode** (`readonly: true`). The database is validated against a list of required tables on startup.

See [Environment Variables — SQLITE_DB_PATH](environment-variables.md#sqlite_db_path) for path configuration.

---

## YAML Compilation

YAML configuration files (guided analysis, FAQ, contact, home page) are compiled to JSON before build or startup:

```bash
npm run compile:configs
```

This command runs four sub-compilers:

- `compile:app-metadata` — application release metadata from `src/app/config/app-metadata.json`
- `compile:guided` — guided analysis YAML → `server/generated/guided/catalog.json`
- `compile:user-guide` — user guide editorial YAML
- `compile:faq` — FAQ YAML
- `compile:contact` — contact page YAML

The `npm run build` command includes `compile:configs` automatically.

See [YAML Content Configuration](yaml-content-configuration.md) for full details.
