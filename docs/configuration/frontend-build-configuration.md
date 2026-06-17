# Frontend Build Configuration

This page documents the Vite build configuration for the BioRemPP Database Explorer frontend, including base path normalization, the dev proxy, alias resolution, build output, and the full build pipeline.

---

## Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 18 | UI framework |
| TypeScript | 5.5+ | Type safety |
| Vite | 5.4+ | Build tool and dev server |
| Tailwind CSS | 3.4+ | Utility-first CSS |
| Radix UI | Various | Headless component primitives |

---

## Vite Configuration (`vite.config.ts`)

The Vite configuration reads the base path from environment variables and normalizes it:

```typescript
function normalizeBasePath(value: string) {
  const trimmed = String(value || '/').trim();
  if (!trimmed || trimmed === '/') return '/';
  const withLeadingSlash = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return `/${withLeadingSlash.replace(/^\/+|\/+$/g, '')}/`;
}
```

The normalization ensures the base path always:
- Starts with `/`
- Ends with `/`
- Has no double slashes

### Base path precedence

```typescript
const rawBasePath = env.VITE_BIOREMPP_URL_BASE_PATH
                 || env.BIOREMPP_URL_BASE_PATH
                 || '/';
const basePath = normalizeBasePath(rawBasePath);
```

`VITE_BIOREMPP_URL_BASE_PATH` takes precedence over `BIOREMPP_URL_BASE_PATH` if both are set. For production builds, only `VITE_BIOREMPP_URL_BASE_PATH` is reliable (it must be passed as a Docker build ARG).

---

## Dev Proxy

In development, API requests from the Vite dev server are proxied to the Express dev server:

```typescript
const devApiOrigin = env.VITE_DEV_API_ORIGIN || 'http://127.0.0.1:3101';
const apiProxyPrefix = basePath === '/' ? '/api' : `${basePath}api`;

server: {
  proxy: {
    [apiProxyPrefix]: {
      target: devApiOrigin,
      changeOrigin: true,
    },
  },
}
```

The proxy prefix adapts to the base path:
- Root deployment: proxies `/api/*` → `http://127.0.0.1:3101`
- Subpath deployment: proxies `/bioremppdbx/api/*` → `http://127.0.0.1:3101`

---

## Module Aliases

The following path aliases are configured in `vite.config.ts` and `tsconfig.app.json`:

| Alias | Resolves to |
|-------|-------------|
| `@` | `src/` |
| `@app` | `src/app/` |
| `@pages` | `src/pages/` |
| `@features` | `src/features/` |
| `@shared` | `src/shared/` |

---

## Build Output

Running `npm run build` produces:

```
dist/
  index.html          # SPA entry point
  assets/             # Bundled JS, CSS, and static assets
```

The Express server serves `dist/` as static files and falls back to `dist/index.html` for any non-API route (client-side routing support).

**Build command:**

```bash
npm run build
```

This command runs in sequence:

1. `npm run compile:configs` — compiles YAML to JSON
2. `vite build` — bundles the React SPA with the configured base path
3. `node --check server/index.mjs` — syntax-checks the server entry point

---

## Build-Time vs. Runtime Variables

!!! warning "Vite variables are baked in at build time"
    `VITE_*` environment variables are **bundled into static assets** at build time. They cannot be changed at runtime without rebuilding the frontend. Set them correctly before running `npm run build` or passing them as Docker build ARGs.

| Variable | When set | Effect |
|----------|---------|--------|
| `VITE_BIOREMPP_URL_BASE_PATH` | Build time | Sets SPA base path and asset URL prefix |
| `VITE_DEV_API_ORIGIN` | Dev only | Dev proxy target (not bundled into production build) |

---

## TypeScript Configuration

The project has multiple `tsconfig` files:

| File | Scope |
|------|-------|
| `tsconfig.json` | Project references root |
| `tsconfig.app.json` | React application code |
| `tsconfig.node.json` | Node tooling (Vite config, scripts) |
| `tsconfig.test.json` | Vitest test runner |

Type-check the application:

```bash
npm run typecheck
```

---

## TypeDoc Source Reference

TypeDoc generates a Markdown source reference from TypeScript source code:

**Configuration:** `typedoc.docs.json`

**Output:** `docs/reference/source/generated/`

**Command:**

```bash
npm run docs:reference
```

The generated pages are included in the MkDocs navigation under **API Reference**. Run `npm run docs:build` to regenerate and build the full documentation site, or `npm run docs:serve` to serve it locally with live reload.

---

## Optimized Dependencies

Lucide React is excluded from Vite's dependency pre-bundling:

```typescript
optimizeDeps: {
  exclude: ['lucide-react'],
}
```

This avoids a known bundling conflict with the icon library.

---

## Development Startup

Full development environment (Vite dev server + Express API concurrently):

```bash
npm run dev
```

This runs `compile:configs` and then launches both servers in parallel using `concurrently`:
- Express API on port `3101`
- Vite dev server on port `5173`

Expected local URL: `http://localhost:5173/bioremppdbx/`

---

## Related Pages

- [Environment Variables](environment-variables.md) — full variable reference
- [Base Path and Subpath Deployment](base-path-subpath-deployment.md) — base path mechanics and consistency rules
- [Docker Integration](docker-integration.md) — production build in Docker
