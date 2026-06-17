# Database Schemas — Overview

The BioRemPP Database Explorer integrates four curated source databases into a unified compound-centric resource. This section documents the schema of each source database and the compound-centric integration model that drives the explorer interface.

---

## Data Sources

| Database | Role | Format | Version |
|----------|------|--------|---------|
| **BioRemPP** | Core compound–gene–enzyme–agency mapping | CSV (11 cols) | v1.1.0 |
| **HADEG** | Hydrocarbon aerobic degradation gene–pathway associations | CSV (4 cols) | v1.0.0 |
| **KEGG Degradation** | Xenobiotic degradation pathway–gene mapping from KEGG | CSV (3 cols) | Release 117.0+ |
| **ToxCSM** | Computational toxicological endpoint predictions (31 endpoints) | CSV (66 cols) | v1.0.0 |

These four sources are processed by the ingest pipeline (`npm run ingest:sqlite`) into a single SQLite database (`biorempp.sqlite`) containing 12 relational tables. The SQLite database is the exclusive runtime data store for the application — all API queries are served from it.

---

## Database Coverage (v1.1.0)

| Entity | Count |
|--------|-------|
| Unique compounds | 384 |
| Unique KEGG Ortholog (KO) groups | 1,543 |
| Unique gene symbols | 1,517 |
| Unique enzyme activity terms | 206 |
| Unique degradation pathways | 66 |
| Unique compound classes | 12 |
| Regulatory agency annotations | 9 agencies |
| Toxicological endpoints (ToxCSM) | 31 endpoints × 370 compounds |

---

## Schema Pages

This section is organized as follows:

- **[BioRemPP Integrated Database](biorempp-integrated-database.md)** — The BioRemPP v1.1.0 CSV source schema: 11-column flat structure for compound–gene–enzyme–agency relationships
- **[Compound-Centric Model](compound-centric-model.md)** — The runtime SQLite model: how the four source databases are integrated into compound-centric summary tables
- **[Entity Relationships](entity-relationships.md)** — Cardinality and foreign key relationships across all 12 SQLite tables
- **[Field Dictionary](field-dictionary.md)** — Complete field-by-field reference across all tables
- **[HADEG Schema](hadeg-schema.md)** — HADEG CSV source schema: gene–pathway–compound class mapping for hydrocarbon degradation
- **[KEGG Degradation Schema](kegg-degradation-schema.md)** — KEGG Degradation CSV source schema: KO–pathway mapping from KEGG xenobiotic metabolism
- **[ToxCSM Schema](toxcsm-schema.md)** — ToxCSM CSV source schema: 66-column toxicological prediction database

---

## Integration Architecture

```
[BioRemPP v1.1.0 CSV]  [HADEG CSV]  [KEGG Degradation CSV]  [ToxCSM CSV]
         |                  |                  |                    |
         +------------------+------------------+--------------------+
                                    |
                         [ingest-sqlite.mjs]
                         (npm run ingest:sqlite)
                                    |
                         [biorempp.sqlite — 12 tables]
                                    |
                    [Express API — read-only queries]
                                    |
                          [React Frontend]
```

The ingest pipeline:

1. Parses all four CSV sources
2. Validates identifier formats (`K#####` for KOs, `C#####` for compounds)
3. Joins BioRemPP compound–KO pairs with HADEG and KEGG pathway annotations (via the `ko` join key)
4. Joins BioRemPP compounds with ToxCSM toxicity predictions (via the `cpd` join key)
5. Builds compound-centric summary rows aggregating all linked entities
6. Writes 12 SQLite tables with appropriate indexes for query performance

---

## Related Pages

- [Field Dictionary](field-dictionary.md) — full column reference
- [Entity Relationships](entity-relationships.md) — ER diagram and cardinality table
- [Configuration → YAML Content Configuration](../configuration/yaml-content-configuration.md) — YAML content pipeline
- [Configuration → API Endpoint Configuration](../configuration/api-endpoint-configuration.md) — SQLite runtime requirements
