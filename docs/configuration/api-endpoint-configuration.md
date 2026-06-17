# API Endpoint Configuration

This page documents the Express API routing structure of the BioRemPP Database Explorer, including all endpoints, base path mounting, pagination contract, health probes, and SQLite runtime requirements.

---

## Architecture

The backend is a **Node.js + Express server** with a modular domain-router layout. The entry point `server/index.mjs` handles bootstrap only (database setup, rate limiter configuration, guided-engine initialization) and mounts six domain routers under `/api`:

| Router module | Route prefix | Domain |
|--------------|-------------|--------|
| `server/routes/compounds.mjs` | `/api/compounds*`, `/api/compound-classes*` | Compounds and compound classes |
| `server/routes/genes.mjs` | `/api/genes*` | Genes and KEGG orthologs |
| `server/routes/pathways.mjs` | `/api/pathways*` | Pathways |
| `server/routes/toxicity.mjs` | `/api/toxicity` | Toxicity records |
| `server/routes/meta.mjs` | `/api/meta/*`, `/api/health` | Metadata lookups and health |
| `server/routes/guided.mjs` | `/api/guided/*` | Guided analysis |

Shared utilities live in `server/shared/`:

- `server/shared/query.mjs` — pagination helpers, JSON parsers, `readDistinctStrings`, `deriveRiskBucket`, and other pure query utilities
- `server/shared/kegg.mjs` — KEGG image fetch with two-tier cache (in-process `Map` + disk) and thundering-herd prevention

The Express application is mounted under the normalized base path at runtime:

```javascript
rootApp.use(BASE_PATH, app);
```

All API routes are therefore accessible at `{BASE_PATH}api/*`. With the canonical base path `/bioremppdbx/`, the full API prefix is `/bioremppdbx/api/`.

---

## Health Endpoints

Two health endpoints exist:

| Endpoint | Auth required | Purpose |
|----------|:---:|---------|
| `GET /health` | No | Root-level health probe for NGINX and infrastructure checks |
| `GET {BASE_PATH}api/health` | Yes (in prod) | Application-level health with base path confirmation |

The `/health` endpoint is intentionally at the **root level** (not under the base path) and is excluded from HTTP Basic Auth in the NGINX template, making it suitable for container health checks and institutional load balancer probes.

Response:

```json
{ "ok": true, "basePath": "/bioremppdbx/" }
```

---

## Pagination Contract

All list endpoints return a consistent paginated response:

```json
{
  "data": [...],
  "total": 1234,
  "page": 1,
  "pageSize": 50,
  "totalPages": 25
}
```

**Default page size:** 50 rows  
**Maximum page size:** 200 rows (capped server-side)  
**Query parameters:** `page` (integer, default 1), `pageSize` (integer, default 50)

---

## Compound Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/compounds` | Paginated compound list with filters |
| `GET` | `/api/compounds/:cpd` | Single compound summary |
| `GET` | `/api/compounds/:cpd/overview` | Overview visualizations data (KO bar, pathway bars, toxicity heatmap) |
| `GET` | `/api/compounds/:cpd/genes` | Paginated genes associated with compound |
| `GET` | `/api/compounds/:cpd/pathways` | Paginated pathways associated with compound |
| `GET` | `/api/compounds/:cpd/toxicity-profile` | All toxicity endpoint predictions for compound |
| `GET` | `/api/compounds/:cpd/metadata` | Full compound metadata (identifiers, provenance, cross-references) |
| `GET` | `/api/compounds/:cpd/kegg-image` | KEGG structure image — two-tier cache (in-process + disk), rate-limited, proxied from `rest.kegg.jp` with 15 s timeout |

### Compound list filters

| Query param | Type | Description |
|-------------|------|-------------|
| `search` | string | Substring match on `compoundname` or `cpd` (NOCASE) |
| `compoundclass` | string | Exact match on compound class |
| `reference_ag` | string | Filter compounds by regulatory agency reference |
| `pathway_source` | string | Filter by pathway source (`KEGG` or `HADEG`) |
| `pathway` | string | Filter by specific pathway name (combine with `pathway_source`) |
| `gene` | string | Filter by gene symbol |
| `ko_count_min` / `ko_count_max` | number | KO count range |
| `gene_count_min` / `gene_count_max` | number | Gene count range |

Default sort: `gene_count DESC, cpd ASC`

### Overview limits

| Query param | Default | Max |
|-------------|---------|-----|
| `top_ko` | 10 | 50 |
| `top_pathways` | 10 | 50 |

---

## Gene / KO Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/genes` | Paginated gene/KO list with filters |
| `GET` | `/api/genes/:ko` | Single KO summary |
| `GET` | `/api/genes/:ko/overview` | Toxicity heatmap matrix for linked compounds |
| `GET` | `/api/genes/:ko/compounds` | Paginated compounds linked to this KO |
| `GET` | `/api/genes/:ko/metadata` | Full KO metadata (identifiers, pathways by source, quantitative overview) |

### Gene list filters

| Query param | Type | Description |
|-------------|------|-------------|
| `search` | string | Substring match on `genesymbol`, `genename`, or `ko` |
| `compound_count_min` / `compound_count_max` | number | Compound count range |
| `genesymbol` | string | Exact match on gene symbol |

Default sort: `compound_count DESC, ko ASC`

---

## Pathway Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/pathways` | Paginated pathway list |
| `GET` | `/api/pathways/detail/overview` | Pathway detail visualizations |

### Pathway list filters

| Query param | Type | Description |
|-------------|------|-------------|
| `source` | string | Filter by source (`KEGG` or `HADEG`) |
| `search` | string | Substring match on pathway name |

### Pathway detail parameters

| Query param | Type | Description |
|-------------|------|-------------|
| `pathway` | string | Required — pathway name |
| `source` | string | Optional — scope to specific source (`KEGG`, `HADEG`, or omit for ALL) |

---

## Toxicity Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/toxicity` | Paginated toxicity records |

### Toxicity list filters

| Query param | Type | Description |
|-------------|------|-------------|
| `endpoint` | string | Filter by toxicity endpoint identifier |
| `label` | string | Filter by endpoint label (use with `endpoint` for deterministic results) |
| `compoundclass` | string | Filter by compound class |
| `value_min` / `value_max` | number | Predicted value range (0–1) |
| `search` | string | Substring match on `compoundname` or `cpd` |

Default sort: `value DESC` (nulls last), then `compoundname ASC, cpd ASC`

---

## Compound Class Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/compound-classes` | Paginated compound class list |
| `GET` | `/api/compound-classes/detail/overview` | Compound class detail visualizations |

### Compound class detail parameters

| Query param | Type | Description |
|-------------|------|-------------|
| `compoundclass` | string | Required — compound class name |

---

## Metadata Endpoints

Metadata endpoints return lookup values for filter dropdowns:

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/meta/compound-classes` | Array of distinct compound class names |
| `GET` | `/api/meta/reference-ags` | Array of distinct regulatory agency identifiers |
| `GET` | `/api/meta/genes` | Array of distinct gene symbols |
| `GET` | `/api/meta/pathways` | Array of distinct pathway names |
| `GET` | `/api/meta/pathways/grouped` | Array of `{pathway, source}` objects |
| `GET` | `/api/meta/toxicity/endpoints` | Array of distinct toxicity endpoint identifiers |
| `GET` | `/api/meta/toxicity/labels` | Array of labels (optionally scoped by `?endpoint=`) |

---

## Guided Analysis Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/guided/catalog` | Full guided analysis catalog (categories + query definitions) |
| `GET` | `/api/guided/queries/:id/options` | Dependent filter options for a query (query params forwarded as filter state) |
| `POST` | `/api/guided/queries/:id/execute` | Execute a guided query with body `{ page?, pageSize?, filters? }` |

### Execute request body

```json
{
  "page": 1,
  "pageSize": 10,
  "filters": {
    "compoundclass": "Aromatic Hydrocarbon",
    "ko_count": { "min": 5 }
  }
}
```

### Execute response shape

```json
{
  "meta": { "execution_stats": {...} },
  "summary_cards": [...],
  "visualizations": [...],
  "table": { "columns": [...], "rows": [...], "total": 42, "page": 1, "pageSize": 10 }
}
```

!!! note "Rate limited"
    The execute endpoint is rate-limited at two independent layers. Express uses `RATE_LIMIT_GUIDED_MAX` / `RATE_LIMIT_GUIDED_WINDOW_MS` and NGINX uses `NGINX_GUIDED_EXECUTE_RATE_LIMIT` / `NGINX_GUIDED_EXECUTE_RATE_LIMIT_BURST`. When these variables are defined in `.env`, they override the application fallbacks. See [Environment Variables — Express Rate Limiting](environment-variables.md#express-rate-limiting) and [NGINX Integration — Rate Limiting](nginx-integration.md#rate-limiting).

---

## SQLite Runtime Requirements

At startup, the server validates the SQLite database against a list of required tables:

```
compound_summary, gene_summary, pathway_summary, toxicity_endpoint,
compound_gene_map, compound_pathway_map, compound_reference_map,
compound_metadata, compound_gene_card, compound_pathway_card,
compound_ko_pathway_rel, compound_ko_overview
```

If any required table is missing, the process exits immediately with an error:

```
SQLite runtime profile is invalid. Missing required tables: ...
Run "npm run ingest:sqlite".
```

Regenerate the database:

```bash
npm run ingest:sqlite
```

---

## SPA Fallback

After serving static files from `dist/`, the server includes a catch-all for client-side routing:

```javascript
app.get(/^(?!\/api\/).*/, (_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});
```

All non-API routes return `index.html`, allowing React Router to handle client-side navigation.

---

## Express-Level Rate Limiting

The Express server applies rate limiting independently of NGINX, providing defense-in-depth for deployments that bypass the proxy layer (local dev, internal network access):

| Limiter | Scope | Default | Env vars |
|---------|-------|---------|----------|
| Global | All `/api/*` routes | 1200 req / 60 s | `RATE_LIMIT_GLOBAL_MAX`, `RATE_LIMIT_GLOBAL_WINDOW_MS` |
| KEGG image | `GET /api/compounds/:cpd/kegg-image` | 20 req / 60 s | `RATE_LIMIT_KEGG_MAX`, `RATE_LIMIT_KEGG_WINDOW_MS` |
| Guided execute | `POST /api/guided/queries/:id/execute` | 60 req / 60 s (Express) | `RATE_LIMIT_GUIDED_MAX`, `RATE_LIMIT_GUIDED_WINDOW_MS` |

All limiters use `express-rate-limit` with `standardHeaders: 'draft-8'` (returns `RateLimit-*` headers) and trust the proxy hops configured via `RATE_LIMIT_TRUST_PROXY`.

See [Environment Variables — Express Rate Limiting](environment-variables.md#express-rate-limiting) for full variable reference.

---

## KEGG Image Cache

The `/api/compounds/:cpd/kegg-image` route uses a two-tier cache before hitting `rest.kegg.jp`:

1. **In-process `Map`** — fastest; survives the lifetime of the server process. Holds the raw image buffer and content type.
2. **Disk cache** — survives restarts. Images are stored as `{cpd}.gif` / `{cpd}.png` / `{cpd}.jpg` under `KEGG_IMAGE_CACHE_DIR`. Not-found responses are persisted as `{cpd}.404` sentinel files to avoid re-fetching.

On a cache miss both tiers are populated in a single network request. Concurrent requests for the same `cpd` are coalesced (only one upstream fetch is made).

The cache directory is created automatically at server startup when `KEGG_IMAGE_CACHE_ENABLED=true`.

See [Environment Variables — KEGG Image Cache](environment-variables.md#kegg-image-cache) for configuration details.

---

## Related Pages

- [Environment Variables](environment-variables.md) — `PORT`, `SQLITE_DB_PATH`, `BIOREMPP_URL_BASE_PATH`, `RATE_LIMIT_*`, `KEGG_IMAGE_CACHE_*`
- [Base Path and Subpath Deployment](base-path-subpath-deployment.md) — how the base path affects API routing
- [NGINX Integration](nginx-integration.md) — rate limiting and proxy configuration
