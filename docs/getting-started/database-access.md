# Database Access

This page describes how to access the BioRemPP Database Explorer, supported environments, and deployment options for institutional use.

---

## Public Access

The BioRemPP Database Explorer is available as an open-access web resource. No registration, account creation, or file submission is required.

Access the Database Explorer at the institutional deployment endpoint provided by your organization or institution hosting the resource.

---

## Access Requirements

### Browser Compatibility

The Database Explorer is a modern web application built with React and TypeScript. The following browsers are supported:

| Browser | Minimum version |
|---------|----------------|
| Google Chrome | 90+ |
| Mozilla Firefox | 88+ |
| Microsoft Edge | 90+ |
| Safari | 14+ |

!!! info "Recommended browser"
    Google Chrome or Mozilla Firefox with JavaScript enabled provides the best experience. Browser extensions that block JavaScript or third-party requests may affect explorer functionality.

### Network Requirements

- Standard HTTPS access (port 443)
- No VPN or special network configuration required for public deployments
- Institutional firewall rules may apply for self-hosted deployments

---

## No Registration Required

The Database Explorer does not require:

- User accounts or authentication
- Email registration
- File submission or data upload
- Cookie consent beyond functional session cookies

All explorers, guided analysis queries, and downloads are accessible without identification.

---

## Data Download

The BioRemPP Integrated Database is also available for independent download as static CSV files archived on Zenodo:

**Database DOI:** [https://doi.org/10.5281/zenodo.18905195](https://doi.org/10.5281/zenodo.18905195)

Downloaded files include:

- `biorempp_db.csv` — curated enzyme–compound associations
- `hadeg_db.csv` — HADEG gene–pathway data
- `kegg_degradation_db.csv` — KEGG degradation gene–pathway–compound data
- `toxcsm_db.csv` — ToxCSM toxicity predictions
- `checksums.sha256` — SHA-256 integrity hashes

See [Data and Software Availability](../about/data-software-availability.md) for full details.

---

## Institutional and Self-Hosted Deployment

The BioRemPP Database Explorer supports self-hosted institutional deployments via Docker and NGINX. This enables:

- Internal network deployments with restricted external access
- Custom base path configuration for subpath routing (e.g., `/biorempp/explorer`)
- Integration with institutional authentication proxies (NGINX-level)
- Custom YAML content configuration for guided analysis parameters

### Deployment Prerequisites

- Docker and Docker Compose
- NGINX (recommended as reverse proxy)
- Supported environment: Linux server (Ubuntu 22.04+ recommended)

For complete deployment instructions, see:

- [Configuration — Docker Integration](../configuration/docker-integration.md)
- [Configuration — NGINX Integration](../configuration/nginx-integration.md)
- [Configuration — Base Path and Subpath Deployment](../configuration/base-path-subpath-deployment.md)

---

## Availability and Uptime

The BioRemPP Database Explorer is provided as a **best-effort service** without guaranteed uptime or service level agreements.

For institutional deployments requiring guaranteed availability, self-hosting is recommended. Contact the BioRemPP team for guidance.

!!! info "Service interruptions"
    Planned maintenance and database refresh windows are communicated through the [Changelog](../about/changelog.md).

---

## Related Pages

- [Quickstart](quickstart.md) — First exploration walkthrough
- [Data and Software Availability](../about/data-software-availability.md) — DOI, downloads, and FAIR principles
- [Configuration — Docker Integration](../configuration/docker-integration.md) — Self-hosted deployment
- [Contact](../about/contact.md) — Support and institutional inquiries
