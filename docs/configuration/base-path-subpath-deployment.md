# Base Path and Subpath Deployment

The BioRemPP Database Explorer is designed for **canonical institutional subpath deployment** under a configurable URL prefix. This page explains the base path mechanics, how the three layers (frontend, backend, NGINX) must stay consistent, and how to troubleshoot common misconfigurations.

---

## Canonical Base Path

The canonical institutional base path is:

```
/bioremppdbx/
```

Under this configuration, the application is accessible at:

```
https://institution.edu/bioremppdbx/
```

All routes, API calls, and static asset URLs are prefixed with this path.

---

## How Base Path Flows Through the Stack

The base path must be configured consistently across three layers:

| Layer | Variable | Normalization |
|-------|---------|--------------|
| **Frontend** (Vite build) | `VITE_BIOREMPP_URL_BASE_PATH` | Must start and end with `/` |
| **Backend** (Express server) | `BIOREMPP_URL_BASE_PATH` | Must start and end with `/` |
| **NGINX proxy** | `BIOREMPP_URL_BASE_PATH` + `BIOREMPP_URL_BASE_PATH_NO_TRAILING` | Both forms required |

All three must use the **same path value**. A mismatch causes broken routes, duplicated path segments, or failed API proxying.

---

## Normalization Function

Both `vite.config.ts` and `server/index.mjs` apply the same normalization:

```javascript
function normalizeBasePath(value) {
  const trimmed = String(value || '/').trim();
  if (!trimmed || trimmed === '/') return '/';
  const withLeadingSlash = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return `/${withLeadingSlash.replace(/^\/+|\/+$/g, '')}/`;
}
```

Regardless of how `BIOREMPP_URL_BASE_PATH` is written, the result is always:
- Starts with `/`
- Ends with `/`
- No double slashes
- No leading or trailing whitespace

Examples:

| Input | Normalized |
|-------|-----------|
| `bioremppdbx` | `/bioremppdbx/` |
| `/bioremppdbx` | `/bioremppdbx/` |
| `/bioremppdbx/` | `/bioremppdbx/` |
| (empty) | `/` |

---

## Backend Mounting

The Express server mounts the entire application router under the normalized base path:

```javascript
const BASE_PATH = normalizeBasePath(process.env.BIOREMPP_URL_BASE_PATH || '/');
rootApp.use(BASE_PATH, app);
rootApp.listen(PORT, ...);
```

This means:
- All API routes are served at `{BASE_PATH}api/*` (e.g., `/bioremppdbx/api/compounds`)
- The health endpoint `/health` is served at the **root level** (not under the base path) for infrastructure probes
- A root redirect to `BASE_PATH` is applied in production when `BASE_PATH !== '/'`

---

## Frontend Base Path

Vite uses the base path as:
- The prefix for all bundled asset URLs (`/bioremppdbx/assets/...`)
- The React Router base, so all client-side routes are scoped under the prefix

Because this is baked in at build time, changing the base path in production requires a rebuild with the correct `VITE_BIOREMPP_URL_BASE_PATH`.

---

## NGINX Routing

NGINX uses both forms of the base path for routing:

```nginx
# Redirect root to base path
location = / {
    return 302 ${BIOREMPP_URL_BASE_PATH};
}

# Redirect path without trailing slash
location = ${BIOREMPP_URL_BASE_PATH_NO_TRAILING} {
    return 301 ${BIOREMPP_URL_BASE_PATH};
}

# Rate-limited guided execute endpoint
location ~ ^${BIOREMPP_URL_BASE_PATH_NO_TRAILING}/api/guided/queries/[^/]+/execute$ {
    ...
}

# General API
location ${BIOREMPP_URL_BASE_PATH}api/ {
    ...
}

# SPA and all other requests
location ${BIOREMPP_URL_BASE_PATH} {
    proxy_pass http://bioremppdbx_app${BIOREMPP_URL_BASE_PATH};
}
```

---

## Consistency Requirements

| Required | Variable | Value |
|---------|---------|-------|
| Backend base path | `BIOREMPP_URL_BASE_PATH` | `/bioremppdbx/` |
| Frontend build base path | `VITE_BIOREMPP_URL_BASE_PATH` | `/bioremppdbx/` |
| NGINX no-trailing form | `BIOREMPP_URL_BASE_PATH_NO_TRAILING` | `/bioremppdbx` |

**All three must agree on the same path.**

---

## Deployment at Root

To deploy at the server root instead of a subpath, set:

```env
BIOREMPP_URL_BASE_PATH=/
BIOREMPP_URL_BASE_PATH_NO_TRAILING=
VITE_BIOREMPP_URL_BASE_PATH=/
```

A rebuild of the frontend is required when switching from a subpath to root or vice versa.

---

## Troubleshooting

### Routes duplicated: `/bioremppdbx/bioremppdbx/...`

**Cause:** `BIOREMPP_URL_BASE_PATH` and `VITE_BIOREMPP_URL_BASE_PATH` are set to different values, or the frontend was built with one base path and the backend is configured with another.

**Fix:**
1. Confirm both variables match in your `.env`
2. Rebuild the frontend: `npm run build` (or rebuild the Docker image with the correct build ARG)

---

### App opens but internal navigation fails (blank page after route change)

**Cause:** Stale frontend cache serving an old base path build, or a mismatch between the React Router base and the Express mounting path.

**Fix:**
1. Hard-refresh the browser: `Ctrl+Shift+R`
2. Confirm `/health` returns `200` at the expected path
3. Verify the base path is consistent across all three layers

---

### Connection refused on localhost

**Cause:** In the `prod` Compose profile, the app is only accessible on the NGINX-mapped port (default `83`), not on port `80` or `3000`.

**Fix:** Use `http://localhost:83/bioremppdbx/` (or the value of `HTTP_PORT`).

---

### Assets not loading (logo, CSS, JS returning 404)

**Cause:** The Vite build was done with a different `VITE_BIOREMPP_URL_BASE_PATH` than the runtime base path.

**Fix:** Rebuild the frontend with the correct `VITE_BIOREMPP_URL_BASE_PATH` matching the runtime deployment path.

---

## Related Pages

- [Environment Variables](environment-variables.md) — full variable reference
- [Frontend Build Configuration](frontend-build-configuration.md) — Vite config and build-time variable injection
- [NGINX Integration](nginx-integration.md) — NGINX template location blocks
- [Docker Integration](docker-integration.md) — Docker build ARG for base path
