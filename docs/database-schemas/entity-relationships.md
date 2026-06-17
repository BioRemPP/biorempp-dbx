# Entity Relationships

This page documents the entity relationships, cardinalities, and join paths across the 12 SQLite tables in the BioRemPP Database Explorer runtime database.

---

## Entity Relationship Overview

```
                    ┌─────────────────────────────────┐
                    │         compound_summary         │
                    │  cpd (PK) · compoundname         │
                    │  ko_count · gene_count           │
                    │  pathway_count · toxicity_risk   │
                    └───────────────┬─────────────────┘
                                    │ cpd (1:1)
             ┌──────────────────────┼──────────────────────────┐
             │                      │                          │
             ▼                      ▼                          ▼
┌────────────────────┐  ┌────────────────────┐  ┌────────────────────┐
│  compound_metadata │  │  toxicity_endpoint  │  │ compound_gene_map  │
│  cpd (PK) · json   │  │  cpd+endpoint (PK) │  │  cpd · genesymbol  │
└────────────────────┘  │  label · value      │  └────────┬───────────┘
                        └────────────────────┘           │
                                                          │ genesymbol (M:1)
                                                          ▼
                                               ┌────────────────────┐
                        ┌──────────────────────│    gene_summary     │
                        │                      │  ko (PK) · symbol  │
                        │                      │  compound_count     │
                        │                      └────────────────────┘
                        │
           ┌────────────┼────────────────────────────┐
           │            │                            │
           ▼            ▼                            ▼
┌──────────────┐ ┌────────────────────┐  ┌───────────────────────┐
│compound_gene │ │compound_ko_overview│  │  compound_ko_pathway  │
│  _card       │ │cpd+ko (PK)         │  │  _rel                 │
│cpd+ko+(PK)   │ │relation counts     │  │  cpd+ko+source+pathway│
└──────────────┘ └────────────────────┘  └──────────┬────────────┘
                                                    │ pathway (M:1)
                                                    ▼
                                         ┌──────────────────────┐
                        ┌────────────────│   pathway_summary    │
                        │                │  pathway+source (PK) │
                        │                │  compound_count      │
                        │                └──────────────────────┘
                        │
           ┌────────────┼──────────────────────────┐
           │            │                          │
           ▼            ▼                          ▼
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────────┐
│compound_pathway  │ │compound_pathway  │ │compound_reference    │
│_map              │ │_card             │ │_map                  │
│cpd · pathway     │ │cpd+source+pathway│ │cpd · reference_ag    │
└──────────────────┘ └──────────────────┘ └──────────────────────┘
```

---

## Cardinality Table

| Relationship | Cardinality | Join Key | Rows |
|-------------|-------------|----------|------|
| `compound_summary` → `compound_metadata` | 1:1 | `cpd` | 384:384 |
| `compound_summary` → `toxicity_endpoint` | 1:N | `cpd` | 370→11,470 |
| `compound_summary` → `compound_gene_map` | 1:N | `cpd` | 384→3,399 |
| `compound_summary` → `compound_pathway_map` | 1:N | `cpd` | 384→1,531 |
| `compound_summary` → `compound_reference_map` | 1:N | `cpd` | 384→806 |
| `compound_summary` → `compound_gene_card` | 1:N | `cpd` | 384→12,664 |
| `compound_summary` → `compound_pathway_card` | 1:N | `cpd` | 384→1,531 |
| `compound_summary` → `compound_ko_overview` | 1:N | `cpd` | 384→3,422 |
| `compound_summary` → `compound_ko_pathway_rel` | 1:N | `cpd` | 384→3,747 |
| `compound_gene_map` → `gene_summary` | N:1 | `genesymbol` | 3,399→1,543 |
| `compound_pathway_map` → `pathway_summary` | N:1 | `pathway` | 1,531→66 |
| `compound_ko_overview` → `compound_ko_pathway_rel` | 1:N | `cpd+ko` | 3,422→3,747 |

---

## Compound-to-Gene Relationships

**Type:** Many-to-Many  
**Join table:** `compound_gene_map` (3,399 rows)  
**Detail table:** `compound_gene_card` (12,664 rows)

Each compound is linked to 1–327 unique gene symbols. Each gene (KO group) is linked to 1–27 compounds.

```
compound_summary.cpd ──< compound_gene_map.cpd
compound_gene_map.genesymbol >── gene_summary.genesymbol
```

The `compound_gene_card` table extends this relationship with per-(cpd, ko) detail: enzyme activity, EC number, reaction identifiers, and reaction descriptions. A compound can have multiple KO cards per gene symbol when a single gene symbol maps to multiple KO groups.

---

## Compound-to-Pathway Relationships

**Type:** Many-to-Many  
**Join table:** `compound_pathway_map` (1,531 rows)  
**Detail table:** `compound_pathway_card` (1,531 rows)  
**Source dimension:** HADEG or KEGG

Each compound is linked to 0–31 pathways. Pathway associations derive from the union of HADEG and KEGG pathway annotations on the compound's linked KO groups.

```
compound_summary.cpd ──< compound_pathway_map.cpd
compound_pathway_map.pathway >── pathway_summary.pathway
compound_pathway_card.source ∈ {'HADEG', 'KEGG'}
```

The `pathway_summary` table has a composite primary key `(pathway, source)` — the same pathway name can appear under both HADEG and KEGG if both databases annotate it.

---

## Compound-to-Agency Relationships

**Type:** Many-to-Many  
**Join table:** `compound_reference_map` (806 rows)

Each compound is listed by 1–7 regulatory agencies. The denormalized `reference_ag` column in `compound_summary` stores a semicolon-separated list for display convenience.

```
compound_summary.cpd ──< compound_reference_map.cpd
compound_reference_map.reference_ag ∈ {ATSDR, EPA, IARC1, IARC2A, IARC2B, PSL, EPC, WFD, CONAMA}
```

---

## Compound-to-Toxicity Relationships

**Type:** One-to-Many  
**Table:** `toxicity_endpoint` (11,470 rows)

370 compounds have ToxCSM coverage. Each has exactly 31 endpoint rows.

```
compound_summary.cpd ──< toxicity_endpoint.cpd
toxicity_endpoint.endpoint ∈ {31 ToxCSM endpoint identifiers}
toxicity_endpoint.label ∈ {'High Safety', 'Medium Safety', 'Low Safety',
                            'Low Toxicity', 'Medium Toxicity', 'High Toxicity'}
toxicity_endpoint.value ∈ [0.0, 1.0]
```

14 compounds (3.6%) in `compound_summary` have no ToxCSM entry; their `toxicity_risk_mean` and `high_risk_endpoint_count` are `NULL`.

---

## KO–Pathway Relationship Matrix

The `compound_ko_overview` and `compound_ko_pathway_rel` tables track the relationship between individual KO groups and pathways at the per-compound level.

| Table | Primary Key | Description |
|-------|------------|-------------|
| `compound_ko_overview` | `(cpd, ko)` | Per-compound KO × pathway count summary |
| `compound_ko_pathway_rel` | `(cpd, ko, source, pathway)` | Full KO–pathway membership per compound |

This data powers the KO-level bar charts on compound overview tabs.

---

## Interpretation Scope

The relationships documented here are **database-derived associations**, not experimental evidence of biological interactions. All compound–gene and compound–pathway links originate from KEGG Orthology mappings, HADEG curation, and KEGG degradation pathway annotations. They support exploratory navigation and hypothesis generation; experimental validation is required before drawing biological conclusions.

---

## Related Pages

- [Field Dictionary](field-dictionary.md) — per-column type and constraint reference
- [Compound-Centric Model](compound-centric-model.md) — table design and row counts
- [BioRemPP Integrated Database](biorempp-integrated-database.md) — source CSV schema
