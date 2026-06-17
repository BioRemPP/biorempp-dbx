# Institutional Ingress Handoff

This page documents the requirements and checklist for handing the BioRemPP Database Explorer off to an institutional ingress layer — a load balancer, reverse proxy, or API gateway that sits in front of the bundled NGINX container.

---

## Overview

The production deployment model places the application behind two proxy layers:

```
[Browser]
    ↓ HTTPS (TLS terminated here)
[Institutional ingress: load balancer / reverse proxy / VPN gateway]
    ↓ HTTP (internal network)
[NGINX container: auth + rate limiting + subpath routing]
    ↓ HTTP (Docker internal network)
[Express app container: API + SPA serving]
```

The bundled NGINX handles HTTP Basic Auth, rate limiting, and subpath routing. The institutional ingress is responsible for TLS termination and institutional-level authentication or network access controls.

---

## TLS Termination

TLS must be terminated at the institutional ingress layer for production deployments. The bundled NGINX template (`nginx.prod.conf.template`) handles **HTTP only** on port 80.

!!! info "TLS local profile"
    The `prod-ssl-local` Compose profile provides a local TLS mock for homologation using self-signed certificates. It is not intended for institutional production use.

**Institutional ingress responsibility:**
- Obtain and renew TLS certificates (e.g., Let's Encrypt, institutional CA)
- Configure HTTPS listener (port 443)
- Terminate TLS and forward requests as HTTP to NGINX

---

## Required Forwarded Headers

The institutional ingress **must** forward the following headers to NGINX:

| Header | Purpose |
|--------|---------|
| `X-Forwarded-Proto` | Indicates the original protocol (`https`) so the app can generate correct redirect URLs |
| `X-Forwarded-For` | Preserves the real client IP for rate limiting and logging |
| `X-Forwarded-Host` | Preserves the original host header |
| `X-Forwarded-Port` | Preserves the original port (typically `443`) |

NGINX propagates these headers to the Express backend unchanged.

**Example NGINX ingress config (institutional proxy):**

```nginx
proxy_set_header X-Forwarded-Proto https;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
proxy_set_header X-Forwarded-Host $host;
proxy_set_header X-Forwarded-Port 443;
```

---

## Rate Limiting at Ingress

The bundled NGINX applies rate limiting per real client IP using `$binary_remote_addr`. For this to work correctly when behind an institutional proxy:

- The institutional ingress must forward the **real client IP** via `X-Forwarded-For`
- If the ingress itself performs rate limiting, the NGINX limits act as a secondary defense layer

If the ingress does not forward real client IPs, all requests will appear to come from the ingress IP and share the same rate limit bucket — effectively multiplying the rate limit across all users.

---

## Base Path Alignment

The institutional ingress route prefix **must match** `BIOREMPP_URL_BASE_PATH`:

```
BIOREMPP_URL_BASE_PATH=/bioremppdbx/
```

The institutional ingress must route all requests under `/bioremppdbx/` to the NGINX container. Do not strip the base path prefix at the ingress — NGINX expects it intact.

**Example: institutional ingress forwards `/bioremppdbx/*` to NGINX:**

```nginx
# Institutional ingress (example)
location /bioremppdbx/ {
    proxy_pass http://internal-nginx-host:80/bioremppdbx/;
    proxy_set_header X-Forwarded-Proto https;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Host $host;
}
```

---

## Health Probe Target

The institutional load balancer health probe must target:

```
/health
```

This endpoint is at the **root level** (not under the base path) and does not require HTTP Basic Auth. It returns HTTP `200` with body `{"ok":true,"basePath":"/bioremppdbx/"}` when the application is healthy.

**Example health probe:**

```
GET http://internal-nginx-host:80/health
Expected: 200 OK
```

---

## Authentication Layering

The bundled NGINX applies HTTP Basic Auth to the entire application surface. In institutional deployments, this provides a baseline access control layer.

Depending on institutional policy, the ingress may additionally enforce:

- **SSO / SAML / OAuth2** via the institutional identity provider
- **VPN-only access** (network-level access control)
- **IP allowlisting** for specific subnets

These controls are applied at the ingress and are transparent to NGINX and the Express application.

---

## Institutional Ingress Checklist

- [ ] TLS certificate obtained and configured at ingress
- [ ] HTTPS listener on port 443 active
- [ ] HTTP → HTTPS redirect configured at ingress
- [ ] `X-Forwarded-Proto: https` forwarded to NGINX
- [ ] `X-Forwarded-For` forwarded with real client IP
- [ ] `X-Forwarded-Host` and `X-Forwarded-Port` forwarded
- [ ] Ingress routes `/bioremppdbx/` (or configured base path) to NGINX container
- [ ] Base path prefix is **not stripped** at the ingress
- [ ] Health probe targets `/health` (no auth, root level)
- [ ] `DOMAIN` environment variable in NGINX container set to the public hostname
- [ ] htpasswd file created and mounted into NGINX container
- [ ] Rate limiting at ingress (optional) accounts for `X-Forwarded-For` real IP

---

## Related Pages

- [NGINX Integration](nginx-integration.md) — bundled NGINX templates, auth, rate limiting
- [Docker Integration](docker-integration.md) — production Compose profiles and service ports
- [Environment Variables](environment-variables.md) — `DOMAIN`, `HTTP_PORT`, `BASIC_AUTH_*`
- [Base Path and Subpath Deployment](base-path-subpath-deployment.md) — base path consistency requirements
