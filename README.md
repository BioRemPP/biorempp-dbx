# BioRemPP Database Explorer

**Compound-Centric Bioremediation Analysis — Local Web Application**

[![Documentation](https://img.shields.io/badge/docs-Read%20the%20Docs-blue)](https://biorempp-dbx.readthedocs.io/en/stable/guided-analysis/)
[![Docker](https://img.shields.io/badge/docker-ready-brightgreen)](https://github.com/BioRemPP/biorempp-dbx)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![Database: CC BY 4.0](https://img.shields.io/badge/Database-CC%20BY%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by/4.0/)

---

## Overview

BioRemPP Database Explorer is a web application for interactive exploration of the BioRemPP compound-centric database. It is a companion tool to the [BioRemPP Web Service](https://bioinfo.imd.ufrn.br/biorempp/) and does not require KO annotation files as input — it offers direct browser-based access to compounds, genes, pathways, and toxicity data across all integrated sources.

Built with React + TypeScript (frontend), Express + SQLite (backend), and packaged with Docker + Nginx for deployment.

---

## Quick Start

### Docker (Recommended)

```bash
# 1. Configure environment
cp .env.example .env

# 2. Start production stack (app + Nginx)
docker compose --profile prod up -d --build
```

Open: **http://localhost:83/bioremppdbx/**

> For deployment configuration (Nginx, Basic Auth, environment variables), see [docs/deployment/docker-compose.md](docs/deployment/docker-compose.md).

### Local Development

```bash
npm install
npm run ingest:sqlite
npm run dev:full
```

Open: **http://localhost:5173/bioremppdbx/**

---

## Application Modules

### Explorer Views

| Module | Entities | Description |
|--------|----------|-------------|
| **Compounds** | Chemical compounds | Search, filter, and inspect per-compound detail |
| **Compound Classes** | Compound class groups | Aggregate class-level exploration and drill-down |
| **Genes / KO** | Genes and KO identifiers | Gene–compound connectivity and KO context |
| **Pathways** | Metabolic pathways | Functional coverage and compound associations per pathway |
| **Toxicity** | ToxCSM endpoints | 31 toxicity prediction endpoints per compound |
| **Databases** | Integrated sources | Source schema documentation and field definitions |

### Guided Analysis

Eight curated analytical use cases with reproducible outputs:

| Category | Use Case | Analytical Question |
|----------|----------|---------------------|
| Compound Analysis | **Top Bioremediation Compounds** | Which compounds show the broadest functional annotation coverage? |
| Compound Analysis | **Most Toxic Compounds** | Which compounds present the highest predicted toxicological risk? |
| Compound Analysis | **Risk vs Bioremediation Potential** | Which compounds combine high degradation potential and high risk? |
| Compound Analysis | **Regulated Compounds by Agency** | Which compounds are classified by EPA, ATSDR, or IARC? |
| Pathway Analysis | **Pathways with Highest Functional Coverage** | Which pathways have the highest number of associated KOs? |
| Pathway Analysis | **Pathways Associated with Toxic Compounds** | Which pathways are linked to compounds with high predicted toxicity? |
| Gene / KO Analysis | **Most Connected Genes** | Which genes are associated with the largest number of compounds? |
| Gene / KO Analysis | **Genes Linked to Toxic Compounds** | Which genes are associated with compounds above the selected toxicity threshold? |

---

## Integrated Databases

| Database | Focus |
|----------|-------|
| **BioRemPP** | Core compound-KO-gene mapping for bioremediation |
| **KEGG** | Xenobiotic metabolism and degradation pathways |
| **HADEG** | Aerobic hydrocarbon degradation enzymes |
| **ToxCSM** | Computational toxicity predictions (31 endpoints) |

Regulatory frameworks: IARC, EPA, ATSDR, WFD, PSL, EPC, CONAMA.

> Details: [Database Schemas](https://biorempp-dbx.readthedocs.io/en/stable/database-schemas/)

---

## Documentation

| Section | Description |
|---------|-------------|
| [Getting Started](https://biorempp-dbx.readthedocs.io/en/stable/getting-started/) | Installation, Docker setup, data ingestion |
| [User Guide](https://biorempp-dbx.readthedocs.io/en/stable/user-guide/) | Feature walkthrough and results interpretation |
| [Guided Analysis](https://biorempp-dbx.readthedocs.io/en/stable/guided-analysis/) | Use case catalog and analytical methodology |
| [Database Schemas](https://biorempp-dbx.readthedocs.io/en/stable/database-schemas/) | Source schemas and field definitions |
| [Configuration](https://biorempp-dbx.readthedocs.io/en/stable/configuration/) | Docker Compose profiles, Nginx, environment variables |
| [API Reference](https://biorempp-dbx.readthedocs.io/en/stable/api-reference/) | TypeScript source reference (TypeDoc) |

---

## Citation

When using BioRemPP Database Explorer, please cite both the web service and the database:

**Web Service:**
> Lima Silva, D. F., & Fassarella Agnez-Lima, L. (2026). BioRemPP: A Compound-Centric Web Server for Bioremediation Potential Profiling (1.0.0). Zenodo. https://doi.org/10.5281/zenodo.18919675

**Database:**
> Lima Silva, D. F., & Fassarella Agnez-Lima, L. (2025–2026). BioRemPP Database: A Curated Compound-Centric Resource for Bioremediation Potential Profiling (1.0.0) [Data set]. Zenodo. https://doi.org/10.5281/zenodo.18905195

> Full citation guidelines: [How to Cite](https://biorempp-dbx.readthedocs.io/en/stable/about/how-to-cite/)

---

## License

- **Source Code:** [Apache License 2.0](LICENSE)
- **Database Content:** [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)
- **Third-party:** KEGG (academic license), HADEG (open access), ToxCSM (open access)

> Details: [License](https://biorempp-dbx.readthedocs.io/en/stable/about/license/)

---

## Limitations

BioRemPP Database Explorer is a research tool for hypothesis generation. Results represent **genetic and functional potential**, not confirmed biological activity. Not intended for clinical, regulatory, or remediation decisions without experimental validation.

> [Limitations and Scope](https://biorempp-dbx.readthedocs.io/en/stable/methods/limitations/)

---

## Support

- **Documentation:** [biorempp-dbx.readthedocs.io](https://biorempp-dbx.readthedocs.io/en/stable/guided-analysis/)
- **Issues:** [GitHub Issues](https://github.com/BioRemPP/biorempp-dbx/issues)
- **Email:** biorempp@gmail.com

---

**BioRemPP Database Explorer** | [Documentation](https://biorempp-dbx.readthedocs.io/en/stable/guided-analysis/) | [GitHub](https://github.com/BioRemPP/biorempp-dbx)
