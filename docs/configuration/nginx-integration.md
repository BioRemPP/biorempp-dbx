# NGINX Integration

The BioRemPP Database Explorer includes NGINX as a reverse proxy layer in the `prod` and `prod-ssl-local` Docker Compose profiles. This page documents the NGINX configuration templates, security headers, HTTP Basic Auth, rate limiting, location routing, and TLS local profile.

---

## NGINX Version

**Image:** `nginx:1.27-alpine`

NGINX is used exclusively for the production and TLS homologation profiles. The `dev` profile does not use NGINX.

---

## Template System

NGINX configuration is delivered via **template files** that are expanded by Docker at container startup using `envsubst`. Templates are located at:

| File | Used by profile |
|------|----------------|
| `.docker/nginx/nginx.prod.conf.template` | `prod` |
| `.docker/nginx/nginx.prod.tls-local.conf.template` | `prod-ssl-local` |

Template variables (e.g., `${BIOREMPP_URL_BASE_PATH}`) are replaced with actual environment variable values when the container starts.

---

## Upstream Definition

```nginx
upstream bioremppdbx_app {
    server ${APP_UPSTREAM};
}
```

`APP_UPSTREAM` resolves to `bioremppdbx-app:3000` in Docker Compose. This is the internal Docker network address of the Express application container.

---

## Security Headers

Both production templates apply the following security response headers on every response:

| Header | Value |
|--------|-------|
| `X-Frame-Options` | `SAMEORIGIN` |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |

---

## HTTP Basic Authentication

The entire application (SPA and API) is protected by HTTP Basic Auth in both production templates:

```nginx
auth_basic "${BASIC_AUTH_REALM}";
auth_basic_user_file /etc/nginx/auth/.htpasswd;
```

- The htpasswd file is mounted from the host path defined by `BASIC_AUTH_HTPASSWD_PATH`
- The auth realm prompt label is set by `BASIC_AUTH_REALM`
- The `/health` endpoint bypasses auth (`auth_basic off`)

**Create the htpasswd file before starting a production profile:**

```bash
mkdir -p .docker/auth
htpasswd -c .docker/auth/bioremppdbx.htpasswd your-user
```

---

## Rate Limiting

Two rate limit zones are defined:

### General API rate limit

Applied to all `{BASE_PATH}api/*` requests:

```nginx
limit_req_zone $binary_remote_addr zone=bioremppdbx_api:10m rate=${NGINX_API_RATE_LIMIT};
```

| Variable | Default | Purpose |
|----------|---------|---------|
| `NGINX_API_RATE_LIMIT` | `20r/s` | Requests per second per IP |
| `NGINX_API_RATE_LIMIT_BURST` | `40` | Burst allowance |

### Guided execution rate limit

Applied specifically to `POST /api/guided/queries/:id/execute` — the computational query execution endpoint:

```nginx
limit_req_zone $binary_remote_addr zone=bioremppdbx_guided_execute:10m rate=${NGINX_GUIDED_EXECUTE_RATE_LIMIT};
```

| Variable | Default | Purpose |
|----------|---------|---------|
| `NGINX_GUIDED_EXECUTE_RATE_LIMIT` | `30r/s` | Requests per second per IP |
| `NGINX_GUIDED_EXECUTE_RATE_LIMIT_BURST` | `10` | Burst allowance |

Exceeding the rate limit returns HTTP `429 Too Many Requests`.

This NGINX layer is independent from the Express guided limiter. In deployments that use the bundled proxy, both controls apply.

---

## Location Blocks

### Root redirect

```nginx
location = / {
    return 302 ${BIOREMPP_URL_BASE_PATH};
}
```

Redirects bare `/` to the base path.

### Trailing-slash canonicalization

```nginx
location = ${BIOREMPP_URL_BASE_PATH_NO_TRAILING} {
    return 301 ${BIOREMPP_URL_BASE_PATH};
}
```

Permanently redirects the path without trailing slash to the canonical form with trailing slash.

### Health endpoint (no auth)

```nginx
location = /health {
    auth_basic off;
    proxy_pass http://bioremppdbx_app/health;
    ...
}
```

Health probes bypass HTTP Basic Auth and are proxied to the Express `/health` endpoint.

### Guided execute endpoint (strict rate limit)

```nginx
location ~ ^${BIOREMPP_URL_BASE_PATH_NO_TRAILING}/api/guided/queries/[^/]+/execute$ {
    limit_req zone=bioremppdbx_guided_execute burst=${NGINX_GUIDED_EXECUTE_RATE_LIMIT_BURST} nodelay;
    limit_req_status 429;
    proxy_pass http://bioremppdbx_app;
    ...
}
```

Regex-matched to apply the stricter guided execution rate limit before the general API location block.

### General API

```nginx
location ${BIOREMPP_URL_BASE_PATH}api/ {
    limit_req zone=bioremppdbx_api burst=${NGINX_API_RATE_LIMIT_BURST} nodelay;
    limit_req_status 429;
    proxy_pass http://bioremppdbx_app;
    ...
}
```

### SPA and all other requests

```nginx
location ${BIOREMPP_URL_BASE_PATH} {
    proxy_pass http://bioremppdbx_app${BIOREMPP_URL_BASE_PATH};
    ...
}
```

Proxies the base path and all sub-routes to the Express server, which serves the SPA from `dist/`.

---

## Proxy Headers

All proxy locations set the following forwarded headers:

```nginx
proxy_set_header Host $host;
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header X-Forwarded-Proto $scheme;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
proxy_set_header X-Forwarded-Host $host;
proxy_set_header X-Forwarded-Port $server_port;
```

Proxy read and send timeouts are set to `300s` for all locations to accommodate guided analysis query execution.

---

## TLS Local Profile (`prod-ssl-local`)

The TLS local template adds HTTPS support for local homologation testing:

- HTTP (port 80) redirects to HTTPS with HTTP `308`
- HTTPS on port 443 with TLS 1.2/1.3 and `HIGH:!aNULL:!MD5` cipher suite
- Certificate and key are mounted from host paths (`SSL_CERT_PATH`, `SSL_KEY_PATH`)

TLS termination in this profile is handled **by NGINX inside Docker**. For institutional production deployments, TLS termination is expected to happen at the institutional ingress/load balancer level. See [Institutional Ingress Handoff](institutional-ingress-handoff.md).

---

## NGINX Health Check

The `bioremppdbx-nginx` service includes a health check:

```yaml
healthcheck:
  test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://127.0.0.1/health"]
  interval: 30s
  timeout: 10s
  retries: 5
  start_period: 10s
```

This probes the `/health` endpoint (bypasses auth) to verify NGINX is up and able to proxy to the application.

---

## Related Pages

- [Environment Variables](environment-variables.md) — NGINX-related variables
- [Docker Integration](docker-integration.md) — Compose service definitions and profile selection
- [Base Path and Subpath Deployment](base-path-subpath-deployment.md) — base path consistency
- [Institutional Ingress Handoff](institutional-ingress-handoff.md) — external TLS termination
