# User Guide

This section documents the BioRemPP Database Explorer interface: how to navigate the application, how each explorer works, how to read entity detail pages, how to access the database for download, how to interpret results scientifically, and how to resolve common technical issues.

---

## Quick Navigation

| Page | Purpose |
|------|---------|
| **[Database Navigation](database-navigation.md)** | Application layout, routes, and navigation patterns |
| **[Explorer Pages](explorer-pages.md)** | All five explorer interfaces — columns, search, and filters |
| **[Entity Detail Pages](entity-detail-pages.md)** | Compound, gene, pathway, and compound class detail views |
| **[Downloads](downloads.md)** | Database download access and reproducibility |
| **[Interpretation Guide](interpretation-guide.md)** | Scientific interpretation of database-derived evidence |
| **[Troubleshooting](troubleshooting.md)** | Resolving common interface and performance issues |

---

## Application Overview

The BioRemPP Database Explorer is organized around five explorer interfaces and a guided analysis system, all accessible from the application home page.

### Five Explorer Interfaces

Each explorer provides a searchable, filterable, paginated table for a specific entity type:

| Explorer | Route | Entity type |
|----------|-------|-------------|
| **Compounds** | `/compounds` | Environmental compounds with integrated evidence |
| **Genes and KOs** | `/genes` | KEGG Ortholog entries in the context of degradation |
| **Pathways** | `/pathways` | Xenobiotic degradation pathways (KEGG and HADEG) |
| **Toxicity** | `/toxicity` | ToxCSM-derived toxicity predictions per compound |
| **Compound Classes** | `/compound-classes` | Structural and chemical class groups |

### Guided Analysis

The Guided Analysis section (`/guided-analysis`) provides eight pre-configured query use cases (UC1–UC8) for structured exploratory analysis. See [Guided Analysis](../guided-analysis/index.md) for full documentation.

### Database Schemas

The Databases section (`/databases`) provides structured documentation of the integrated database schemas (BioRemPP, HADEG, KEGG, ToxCSM). See [Database Schemas](../database-schemas/index.md).

---

## What This Guide Covers

**[Database Navigation](database-navigation.md)** — where things are and how to move between them: the primary navigation bar, home page structure, explorer access, detail page routing, and back navigation.

**[Explorer Pages](explorer-pages.md)** — what each explorer shows. Exact table columns, search fields, filter options, and pagination behavior for all five explorer interfaces.

**[Entity Detail Pages](entity-detail-pages.md)** — what opens when you click an entity. Compound detail tabs (Overview, Genes, Metadata), gene detail tabs (Overview, Compounds, Metadata), and visualization pages for pathway and compound class detail.

**[Downloads](downloads.md)** — how to access the full BioRemPP Integrated Database. The database is available as static CSV files archived on Zenodo; this page documents what is available, where to find it, and how to verify file integrity.

**[Interpretation Guide](interpretation-guide.md)** — scientific constraints on result interpretation. Covers database-derived evidence vs. experimental validation, toxicity prediction limitations, regulatory annotation scope, and common misinterpretation patterns.

**[Troubleshooting](troubleshooting.md)** — structured resolution for common technical issues: explorer tables not loading, search returning no results, charts not rendering, detail pages failing to load.

---

## Related Sections

- [Getting Started](../getting-started/index.md) — first-time exploration walkthroughs
- [Guided Analysis](../guided-analysis/index.md) — eight pre-configured query recipes
- [Methods](../methods/index.md) — data sources, integration strategy, and assumptions
