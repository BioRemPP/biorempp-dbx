# Field Dictionary

Complete field-by-field reference for all tables in the BioRemPP Database Explorer runtime database (`biorempp.sqlite`) and all source CSV files.

---

## SQLite Tables

### `compound_summary`

| Column | Type | PK | Nullable | Description |
|--------|------|----|----------|-------------|
| `cpd` | TEXT | Yes | No | KEGG Compound ID (`C#####`) |
| `compoundname` | TEXT | — | Yes | Compound common or IUPAC name |
| `compoundclass` | TEXT | — | Yes | Chemical class (12 standardized values) |
| `reference_ag` | TEXT | — | Yes | Semicolon-separated regulatory agency codes |
| `reference_count` | INTEGER | — | No | Number of agencies listing this compound |
| `ko_count` | INTEGER | — | No | Number of unique KO groups linked (default 0) |
| `gene_count` | INTEGER | — | No | Number of unique gene symbols linked (default 0) |
| `pathway_count` | INTEGER | — | No | Number of unique pathways linked (default 0) |
| `toxicity_risk_mean` | REAL | — | Yes | Mean of all non-null ToxCSM value scores |
| `high_risk_endpoint_count` | INTEGER | — | Yes | Count of ToxCSM endpoints labeled "High Toxicity" |
| `toxicity_scores` | TEXT | — | No | JSON object: `{endpoint: value, ...}` |
| `smiles` | TEXT | — | Yes | SMILES molecular structure string |
| `genes` | TEXT | — | No | JSON array of gene symbol strings |
| `pathways` | TEXT | — | No | JSON array of pathway name strings |
| `updated_at` | TEXT | — | No | Ingest timestamp (ISO 8601) |

**Indexes:** `compoundclass`, `ko_count`, `gene_count`, `reference_ag`, `reference_count`, `toxicity_risk_mean`, `high_risk_endpoint_count`

---

### `gene_summary`

| Column | Type | PK | Nullable | Description |
|--------|------|----|----------|-------------|
| `ko` | TEXT | Yes | No | KEGG Orthology ID (`K#####`) |
| `genesymbol` | TEXT | — | No | Representative gene symbol |
| `genename` | TEXT | — | No | Gene or enzyme functional description |
| `compound_count` | INTEGER | — | No | Number of compounds linked to this KO (default 0) |
| `pathway_count` | INTEGER | — | No | Number of pathways in which this KO appears (default 0) |
| `enzyme_activities` | TEXT | — | No | JSON array of enzyme activity terms |
| `updated_at` | TEXT | — | No | Ingest timestamp |

**Indexes:** `genesymbol`, `compound_count`

---

### `pathway_summary`

| Column | Type | PK | Nullable | Description |
|--------|------|----|----------|-------------|
| `pathway` | TEXT | Yes | No | Pathway name |
| `source` | TEXT | Yes | No | Source database: `HADEG` or `KEGG` |
| `compound_count` | INTEGER | — | No | Compounds linked via this pathway (default 0) |
| `gene_count` | INTEGER | — | No | Unique gene symbols in this pathway (default 0) |
| `updated_at` | TEXT | — | No | Ingest timestamp |

**Indexes:** `source`  
**Note:** Composite PK `(pathway, source)` — same pathway name can exist under both HADEG and KEGG.

---

### `toxicity_endpoint`

| Column | Type | PK | Nullable | Description |
|--------|------|----|----------|-------------|
| `cpd` | TEXT | Yes | No | KEGG Compound ID |
| `compoundname` | TEXT | — | Yes | Compound name (denormalized for query convenience) |
| `compoundclass` | TEXT | — | Yes | Chemical class (denormalized) |
| `endpoint` | TEXT | Yes | No | ToxCSM endpoint identifier (e.g., `Avian`, `hERG_I_Inhibitor`) |
| `label` | TEXT | — | Yes | Categorical prediction: `High Safety`, `Medium Safety`, `Low Safety`, `Low Toxicity`, `Medium Toxicity`, `High Toxicity` |
| `value` | REAL | — | Yes | Numeric prediction score (0.0–1.0) |
| `updated_at` | TEXT | — | No | Ingest timestamp |

**Indexes:** `endpoint`, `label`, `value`, `compoundname`, `compoundclass`  
**Total rows:** 370 compounds × 31 endpoints = 11,470

---

### `compound_gene_card`

| Column | Type | PK | Nullable | Description |
|--------|------|----|----------|-------------|
| `cpd` | TEXT | Yes | No | Compound ID |
| `ko` | TEXT | Yes | No (default `''`) | KO group ID |
| `genesymbol` | TEXT | Yes | No (default `''`) | Gene symbol |
| `genename` | TEXT | Yes | No (default `''`) | Gene name |
| `enzyme_activity` | TEXT | Yes | No (default `''`) | Enzyme activity term |
| `ec` | TEXT | Yes | No (default `''`) | EC number (empty string if absent) |
| `reactions` | TEXT | — | No (default `'[]'`) | JSON array of KEGG reaction IDs |
| `reaction_descriptions` | TEXT | — | No (default `'[]'`) | JSON array of reaction descriptions |
| `supporting_rows` | INTEGER | — | No (default `0`) | BioRemPP CSV rows supporting this entry |
| `updated_at` | TEXT | — | No | Ingest timestamp |

**Indexes:** `cpd`, `ko`, `genesymbol`

---

### `compound_gene_map`

| Column | Type | PK | Description |
|--------|------|----|-------------|
| `cpd` | TEXT | Yes | Compound ID |
| `genesymbol` | TEXT | Yes | Gene symbol |

**Indexes:** `cpd`, `genesymbol`  
**Total rows:** 3,399

---

### `compound_pathway_map`

| Column | Type | PK | Description |
|--------|------|----|-------------|
| `cpd` | TEXT | Yes | Compound ID |
| `pathway` | TEXT | Yes | Pathway name |

**Indexes:** `cpd`, `pathway`  
**Total rows:** 1,531

---

### `compound_reference_map`

| Column | Type | PK | Description |
|--------|------|----|-------------|
| `cpd` | TEXT | Yes | Compound ID |
| `reference_ag` | TEXT | Yes | Agency code |

**Indexes:** `cpd`, `reference_ag`  
**Total rows:** 806

---

### `compound_pathway_card`

| Column | Type | PK | Nullable | Description |
|--------|------|----|----------|-------------|
| `cpd` | TEXT | Yes | No | Compound ID |
| `source` | TEXT | Yes | No | `HADEG` or `KEGG` |
| `pathway` | TEXT | Yes | No | Pathway name |
| `supporting_rows` | INTEGER | — | No (default `0`) | Number of KOs supporting this compound–pathway link |
| `updated_at` | TEXT | — | No | Ingest timestamp |

**Indexes:** `cpd`, `source`, `pathway`  
**Total rows:** 1,531

---

### `compound_ko_pathway_rel`

| Column | Type | PK | Description |
|--------|------|----|-------------|
| `cpd` | TEXT | Yes | Compound ID |
| `ko` | TEXT | Yes | KO group ID |
| `source` | TEXT | Yes | `HADEG` or `KEGG` |
| `pathway` | TEXT | Yes | Pathway name |
| `updated_at` | TEXT | — | Ingest timestamp |

**Total rows:** 3,747

---

### `compound_ko_overview`

| Column | Type | PK | Nullable | Description |
|--------|------|----|----------|-------------|
| `cpd` | TEXT | Yes | No | Compound ID |
| `ko` | TEXT | Yes | No | KO group ID |
| `relation_count_total` | INTEGER | — | No | Total pathway relationships for this cpd×ko pair |
| `relation_count_hadeg` | INTEGER | — | No | HADEG pathway relationships |
| `relation_count_kegg` | INTEGER | — | No | KEGG pathway relationships |
| `updated_at` | TEXT | — | No | Ingest timestamp |

**Indexes:** `cpd`  
**Total rows:** 3,422

---

### `compound_metadata`

| Column | Type | PK | Nullable | Description |
|--------|------|----|----------|-------------|
| `cpd` | TEXT | Yes | Yes | Compound ID |
| `metadata_json` | TEXT | — | No (default `'{}'`) | Full compound metadata as JSON (identifiers, functional annotation, data sources, provenance, data quality) |
| `updated_at` | TEXT | — | No | Ingest timestamp |

**Total rows:** 384

---

## Source CSV Fields

### BioRemPP v1.1.0 CSV Columns

| # | Column | Nullable | Controlled Vocab | Example |
|---|--------|----------|------------------|---------|
| 1 | `cpd` | No | KEGG `C#####` | `C06790` |
| 2 | `compoundclass` | No | 12 classes | `Aromatic` |
| 3 | `ko` | No | KEGG `K#####` | `K07408` |
| 4 | `ec` | Yes | EC notation | `1.14.14.1` |
| 5 | `reaction` | Yes | KEGG `R#####` | `R02340` |
| 6 | `reaction_description` | Yes | Free text | `alkane 1-monooxygenase; ...` |
| 7 | `referenceAG` | No | 9 agency codes | `EPA` |
| 8 | `compoundname` | No | KEGG name | `Trichloroethene` |
| 9 | `genesymbol` | No | KEGG KO annotation | `CYP2E1` |
| 10 | `genename` | No | KEGG KO annotation | `cytochrome P450 family 2...` |
| 11 | `enzyme_activity` | No | Curated lexicon | `monooxygenase` |

---

### HADEG CSV Columns

| # | Column | Nullable | Controlled Vocab | Example |
|---|--------|----------|------------------|---------|
| 1 | `Gene` | No | Gene symbol | `alkB` |
| 2 | `ko` | No | KEGG `K#####` | `K00496` |
| 3 | `Pathway` | No | 71 pathway names | `A_Terminal/biterminal_oxidation` |
| 4 | `compound_pathway` | No | 5 classes | `Alkanes` |

**Compound pathway classes:** `Aromatics`, `Polymers`, `Alkanes`, `Biosurfactant`, `Alkenes`

---

### KEGG Degradation CSV Columns

| # | Column | Nullable | Controlled Vocab | Example |
|---|--------|----------|------------------|---------|
| 1 | `ko` | No | KEGG `K#####` | `K00001` |
| 2 | `pathname` | No | 20 pathway names | `Naphthalene` |
| 3 | `genesymbol` | No | KEGG KO annotation | `nahAc` |

---

### ToxCSM CSV Columns

| Category | Columns | Count | Description |
|----------|---------|-------|-------------|
| Identifiers | `SMILES`, `cpd`, `ChEBI`, `compoundname` | 4 | Compound identifiers |
| Labels | `label_*` | 31 | Categorical predictions per endpoint |
| Values | `value_*` | 31 | Numeric scores per endpoint (0.0–1.0) |
| **Total** | | **66** | |

**Label vocabulary:** `High Safety`, `Medium Safety`, `Low Safety`, `Low Toxicity`, `Medium Toxicity`, `High Toxicity`

---

## Controlled Vocabularies

### Compound Classes (12)

| Value | Stable since |
|-------|-------------|
| `Aromatic` | v1.0.0 |
| `Chlorinated` | v1.0.0 |
| `Nitrogen-containing` | v1.0.0 |
| `Polyaromatic` | v1.0.0 |
| `Aliphatic` | v1.0.0 |
| `Metal` | v1.0.0 |
| `Inorganic` | v1.0.0 |
| `Sulfur-containing` | v1.0.0 |
| `Organophosphorus` | v1.0.0 |
| `Organometallic` | v1.0.0 |
| `Halogenated` | v1.0.0 |
| `Organosulfur` | v1.0.0 |

### Regulatory Agency Codes (9)

| Code | Full Name | Jurisdiction |
|------|-----------|-------------|
| `ATSDR` | Agency for Toxic Substances and Disease Registry | USA |
| `EPA` | U.S. Environmental Protection Agency | USA |
| `IARC1` | IARC Group 1 (Carcinogenic to humans) | International |
| `IARC2A` | IARC Group 2A (Probably carcinogenic) | International |
| `IARC2B` | IARC Group 2B (Possibly carcinogenic) | International |
| `PSL` | Priority Substances List | Canada |
| `EPC` | Environmental Priority Chemicals | Europe |
| `WFD` | Water Framework Directive | EU |
| `CONAMA` | Conselho Nacional do Meio Ambiente | Brazil |

### Pathway Sources (2)

| Value | Source Database |
|-------|----------------|
| `HADEG` | Hydrocarbon Aerobic Degradation Enzymes and Genes database |
| `KEGG` | KEGG Xenobiotic Metabolism pathways |

---

## Related Pages

- [Entity Relationships](entity-relationships.md) — cardinality and join paths
- [Compound-Centric Model](compound-centric-model.md) — table design and row counts
- [BioRemPP Integrated Database](biorempp-integrated-database.md) — source CSV schema
