# Compound-Centric Model

The BioRemPP Database Explorer is organized around a **compound-centric integration model**. All four source databases are ingested, joined, and summarized with the KEGG compound identifier (`cpd`) as the primary organizing key. This page documents the runtime SQLite database structure and the compound-centric design rationale.

---

## Design Rationale

The compound-centric model reflects the scientific framing of the BioRemPP resource: the central question is always *which genes, pathways, toxicity endpoints, and regulatory annotations are associated with a given compound of environmental concern?*

All entity summaries are derived from and anchor back to compounds. Gene summaries record how many compounds each KO group is linked to. Pathway summaries record how many compounds are covered by each pathway. Toxicity endpoint records are stored per compound. This design enables:

- **Efficient compound-centric lookups**: the Compounds Explorer serves paginated, filtered compound lists from a single pre-aggregated table
- **Detail page assembly**: each compound's tab content (Genes, Pathways, Toxicity) is served from normalized tables joined on `cpd`
- **Cross-entity navigation**: from a compound, users can navigate to linked genes, pathways, and toxicity profiles; from a gene, users can retrieve all linked compounds

---

## Runtime SQLite Database

**File:** `data/biorempp.sqlite`  
**Database size:** ~15.8 MB  
**Format:** SQLite 3  
**Access mode:** Read-only at runtime  
**Total tables:** 12  

| Table | Rows | Purpose |
|-------|------|---------|
| `compound_summary` | 384 | One row per compound — pre-aggregated counts and scores |
| `gene_summary` | 1,543 | One row per KO group — linked compound and pathway counts |
| `pathway_summary` | 66 | One row per (pathway, source) pair — coverage statistics |
| `toxicity_endpoint` | 11,470 | One row per (compound, endpoint) — ToxCSM predictions |
| `compound_gene_card` | 12,664 | Gene detail cards per compound (cpd × ko) |
| `compound_gene_map` | 3,399 | Flat cpd → genesymbol junction for filter lookup |
| `compound_pathway_map` | 1,531 | Flat cpd → pathway junction for filter lookup |
| `compound_reference_map` | 806 | Flat cpd → reference_ag junction for filter lookup |
| `compound_pathway_card` | 1,531 | Pathway detail cards per compound (cpd × source × pathway) |
| `compound_ko_pathway_rel` | 3,747 | KO-level pathway membership per compound |
| `compound_ko_overview` | 3,422 | Per-compound KO × pathway relationship counts |
| `compound_metadata` | 384 | Per-compound JSON metadata blob (identifiers, provenance) |

---

## Summary Tables

### `compound_summary`

The primary table powering the Compounds Explorer. One row per unique KEGG compound.

| Column | Type | Description |
|--------|------|-------------|
| `cpd` | TEXT (PK) | KEGG Compound ID |
| `compoundname` | TEXT | Compound common name |
| `compoundclass` | TEXT | Chemical class |
| `reference_ag` | TEXT | Semicolon-separated agency codes |
| `reference_count` | INTEGER | Number of agencies listing this compound |
| `ko_count` | INTEGER | Number of unique KO groups linked |
| `gene_count` | INTEGER | Number of unique gene symbols linked |
| `pathway_count` | INTEGER | Number of unique pathways linked |
| `toxicity_risk_mean` | REAL | Mean toxicity value across all ToxCSM endpoints (null if no ToxCSM coverage) |
| `high_risk_endpoint_count` | INTEGER | Number of endpoints with label "High Toxicity" |
| `toxicity_scores` | TEXT | JSON object mapping endpoint → value |
| `smiles` | TEXT | SMILES molecular structure (from ToxCSM) |
| `genes` | TEXT | JSON array of gene symbols |
| `pathways` | TEXT | JSON array of pathway names |
| `updated_at` | TEXT | Ingest timestamp |

**Distribution statistics:**

| Metric | Min | Max | Mean |
|--------|-----|-----|------|
| KO groups per compound | 1 | 334 | 8.91 |
| Genes per compound | 1 | 327 | 8.85 |
| Pathways per compound | 0 | 31 | 3.99 |
| Agencies per compound | 1 | 7 | 2.10 |

**Coverage:**
- 370 / 384 compounds (96.4%) have ToxCSM toxicity data and SMILES
- 12 compound classes represented (Aromatic: 76, Nitrogen-containing: 68, Polyaromatic: 65, Aliphatic: 63, Chlorinated: 54, others: 58)

---

### `gene_summary`

One row per unique KEGG Ortholog (KO) group across all compounds.

| Column | Type | Description |
|--------|------|-------------|
| `ko` | TEXT (PK) | KEGG Orthology ID |
| `genesymbol` | TEXT | Representative gene symbol |
| `genename` | TEXT | Gene/enzyme functional description |
| `compound_count` | INTEGER | Number of compounds linked to this KO |
| `pathway_count` | INTEGER | Number of pathways in which this KO appears |
| `enzyme_activities` | TEXT | JSON array of enzyme activity terms |
| `updated_at` | TEXT | Ingest timestamp |

**Distribution statistics:**

| Metric | Min | Max | Mean |
|--------|-----|-----|------|
| Compounds per KO | 1 | 27 | 2.22 |
| Pathways per KO | 0 | 12 | 0.48 |

---

### `pathway_summary`

One row per (pathway, source) pair. Source is `HADEG` or `KEGG`.

| Column | Type | Description |
|--------|------|-------------|
| `pathway` | TEXT (PK) | Pathway name |
| `source` | TEXT (PK) | Source database (`HADEG` or `KEGG`) |
| `compound_count` | INTEGER | Number of compounds linked via this pathway |
| `gene_count` | INTEGER | Number of gene symbols in this pathway |
| `updated_at` | TEXT | Ingest timestamp |

**Coverage:**
- Total pathways in SQLite: 66 (after deduplication and filtering)
- HADEG-sourced pathways: the majority, covering hydrocarbon aerobic degradation
- KEGG-sourced pathways: covering xenobiotic and pollutant metabolism

---

### `toxicity_endpoint`

One row per (compound, endpoint) pair. Exactly 370 compounds × 31 endpoints = 11,470 rows.

| Column | Type | Description |
|--------|------|-------------|
| `cpd` | TEXT (PK) | KEGG Compound ID |
| `compoundname` | TEXT | Compound name |
| `compoundclass` | TEXT | Chemical class |
| `endpoint` | TEXT (PK) | ToxCSM endpoint identifier |
| `label` | TEXT | Categorical prediction label |
| `value` | REAL | Numeric prediction score (0.0–1.0) |
| `updated_at` | TEXT | Ingest timestamp |

---

## Detail and Junction Tables

### `compound_gene_card`

Gene-level detail cards for each compound, one row per (cpd, ko, genesymbol, genename, enzyme_activity, ec) combination. Powers the Genes tab on Compound detail pages.

| Column | Type | Description |
|--------|------|-------------|
| `cpd` | TEXT (PK) | Compound ID |
| `ko` | TEXT (PK) | KO group ID |
| `genesymbol` | TEXT (PK) | Gene symbol |
| `genename` | TEXT (PK) | Gene name |
| `enzyme_activity` | TEXT (PK) | Enzyme activity term |
| `ec` | TEXT (PK) | EC number (or empty string) |
| `reactions` | TEXT | JSON array of KEGG reaction IDs |
| `reaction_descriptions` | TEXT | JSON array of KEGG reaction descriptions |
| `supporting_rows` | INTEGER | BioRemPP CSV rows supporting this entry |
| `updated_at` | TEXT | Ingest timestamp |

Total rows: 12,664

---

### `compound_pathway_card`

Pathway-level detail cards per compound, one row per (cpd, source, pathway). Powers the Pathways tab on Compound detail pages.

| Column | Type | Description |
|--------|------|-------------|
| `cpd` | TEXT (PK) | Compound ID |
| `source` | TEXT (PK) | Pathway source (`HADEG` or `KEGG`) |
| `pathway` | TEXT (PK) | Pathway name |
| `supporting_rows` | INTEGER | KOs supporting this compound–pathway link |
| `updated_at` | TEXT | Ingest timestamp |

Total rows: 1,531

---

### Junction Tables

| Table | Columns | Rows | Purpose |
|-------|---------|------|---------|
| `compound_gene_map` | `cpd`, `genesymbol` | 3,399 | Flat many-to-many for gene filter queries |
| `compound_pathway_map` | `cpd`, `pathway` | 1,531 | Flat many-to-many for pathway filter queries |
| `compound_reference_map` | `cpd`, `reference_ag` | 806 | Flat many-to-many for agency filter queries |
| `compound_ko_pathway_rel` | `cpd`, `ko`, `source`, `pathway` | 3,747 | KO-level pathway membership per compound |
| `compound_ko_overview` | `cpd`, `ko`, + relation counts | 3,422 | Per-compound KO × pathway heatmap data |
| `compound_metadata` | `cpd`, `metadata_json` | 384 | Per-compound JSON blob for detail page metadata tab |

---

## Database Indexes

Performance-critical indexes on the most frequently queried columns:

| Table | Indexed Columns |
|-------|----------------|
| `compound_summary` | `compoundclass`, `ko_count`, `gene_count`, `reference_ag`, `reference_count`, `toxicity_risk_mean`, `high_risk_endpoint_count` |
| `gene_summary` | `genesymbol`, `compound_count` |
| `pathway_summary` | `source` |
| `toxicity_endpoint` | `endpoint`, `label`, `value`, `compoundname`, `compoundclass` |
| `compound_gene_card` | `cpd`, `ko`, `genesymbol` |
| `compound_gene_map` | `cpd`, `genesymbol` |
| `compound_pathway_map` | `cpd`, `pathway` |
| `compound_pathway_card` | `cpd`, `source`, `pathway` |
| `compound_reference_map` | `cpd`, `reference_ag` |

All tables use composite primary keys as the primary uniqueness constraint.

---

## Integration Join Strategy

The ingest pipeline joins source databases using two keys:

| Join Key | Sources Connected | Direction |
|----------|-------------------|-----------|
| `ko` | BioRemPP ↔ HADEG, BioRemPP ↔ KEGG Degradation | Each BioRemPP row's KO is looked up in HADEG and KEGG pathway tables |
| `cpd` | BioRemPP ↔ ToxCSM | Each BioRemPP compound ID is looked up in ToxCSM predictions |

**Coverage after integration:**

- 1,527 / 1,543 KOs (98.9%) matched at least one HADEG or KEGG pathway entry
- 169 / 384 compounds (44.0%) have direct KEGG compound support; remaining 215 are KO-supported via link inference
- 370 / 384 compounds (96.4%) matched a ToxCSM entry

---

## Interpretation Notes

!!! warning "Database-derived associations only"
    All compound–gene and compound–pathway associations in the BioRemPP Database Explorer are database-derived from KEGG Orthology mappings and curated bioremediation gene databases. They support exploratory hypothesis generation and prioritization. They do not constitute experimental validation of biodegradation activity, organism capability, or environmental remediation efficacy.

!!! info "Toxicity predictions"
    ToxCSM values are **computational QSAR predictions**, not experimentally measured toxicity values. They support exploratory risk prioritization within the integrated resource.

---

## Related Pages

- [Entity Relationships](entity-relationships.md) — ER diagram and cardinality
- [Field Dictionary](field-dictionary.md) — full column reference
- [BioRemPP Integrated Database](biorempp-integrated-database.md) — source CSV schema
- [Configuration → API Endpoint Configuration](../configuration/api-endpoint-configuration.md) — SQLite table validation at startup
