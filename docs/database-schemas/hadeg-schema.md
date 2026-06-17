# HADEG Database Schema

> **Formal specification of the HADEG (Hydrocarbon Aerobic Degradation Enzymes and Genes) Database source schema**

The HADEG Database provides gene–KO–pathway associations for hydrocarbon aerobic degradation pathways. It is one of the four source databases integrated by the BioRemPP Database Explorer pipeline and is joined to the BioRemPP compound–gene data via the `ko` column.

---

## Overview

The HADEG Database uses a **flat, denormalized schema** optimized for gene–pathway relationship queries. The schema consists of a single table with **4 columns** representing gene–KO–pathway associations for hydrocarbon aerobic degradation.

**Design rationale:**

- **Simplicity** — Single tidy table structure facilitates direct import into R, Python, and spreadsheet tools
- **Pathway-centric** — Organized by degradation pathways for functional analysis
- **Interoperability** — Standard CSV format ensures compatibility with bioinformatics pipelines
- **KEGG integration** — KO identifiers enable cross-referencing with KEGG databases and BioRemPP

---

## Schema Definition

### File: `hadeg_db.csv`

| Property | Value |
|----------|-------|
| **Format** | CSV |
| **Rows** | 867 |
| **Columns** | 4 |
| **File size** | ~34.6 KB |
| **Character encoding** | UTF-8 |
| **Field delimiter** | Semicolon (`;`) |
| **Text qualifier** | Double quote (`"`) |
| **Header row** | Yes |

---

## Column Specifications

| # | Column Name | Data Type | Nullable | Controlled Vocabulary | Example Value |
|---|-------------|-----------|----------|----------------------|---------------|
| 1 | `Gene` | Character | No | Gene symbol | `alkB` |
| 2 | `ko` | Character | No | KEGG Orthology ID | `K00496` |
| 3 | `Pathway` | Character | No | Pathway name (71 values) | `A_Terminal/biterminal_oxidation` |
| 4 | `compound_pathway` | Character | No | Compound class (5 values) | `Alkanes` |

**Data completeness:** 100% — Zero missing values across all 4 columns.

---

## Column 1: `Gene`

**Data type:** Character (string)  
**Format:** Standard gene nomenclature  
**Example:** `ahpC`, `alkB`, `phaA`

**Controlled vocabulary:** No — Free text, curated during database assembly  
**Uniqueness:** Not unique — 323 unique genes, some appear in multiple pathways  
**Purpose:** Identifies the gene symbol associated with a hydrocarbon degradation function  

**Naming conventions:**

- Short lowercase abbreviations typical for microbial genes (e.g., `alkB`, `nahAc`)
- May include alphanumeric suffixes (e.g., `alkB1`, `phaC1`)
- Organism-agnostic naming

**Cardinality:** 323 unique genes

---

## Column 2: `ko`

**Data type:** Character (string)  
**Format:** KEGG Orthology identifier  
**Pattern:** `K#####` (capital K followed by exactly 5 digits)  
**Example:** `K00496`, `K03386`, `K24119`

**Controlled vocabulary:** Yes — Values must exist in KEGG Orthology database  
**Uniqueness:** Not unique — 337 unique KO entries, some appear in multiple pathways  
**Purpose:** Links genes to functional orthologs in KEGG; used as join key to BioRemPP data  

**Validation rules:**

- ✅ Must match regex: `^K\d{5}$`
- ✅ Must exist in KEGG Orthology database
- ✅ Case-sensitive (uppercase K required)

**Cardinality:** 337 unique KO entries

---

## Column 3: `Pathway`

**Data type:** Character (string)  
**Format:** Pathway name with compound class prefix  
**Example:** `A_Terminal/biterminal_oxidation`, `C_Toluene_degradation`, `D_PCL`

**Controlled vocabulary:** Partially — 71 standardized pathway names  
**Uniqueness:** Not unique — Multiple genes belong to each pathway  
**Purpose:** Categorizes genes by their metabolic pathway in hydrocarbon degradation

**Pathway naming convention:**

| Prefix | Compound Class | Examples |
|--------|---------------|----------|
| `A_` | Alkanes | `A_Terminal/biterminal_oxidation`, `A_Finnerty_pathway` |
| `B_` | Alkenes | `B_Propene_degradation`, `B_Isoprene_degradation` |
| `C_` | Aromatics | `C_Toluene_degradation`, `C_Naphthalene_degradation` |
| `D_` | Polymers | `D_PCL`, `D_PET`, `D_PHA`, `D_PHB` |
| (variable) | Biosurfactant | `Biosurfactant_*` |

**Top 10 pathways by gene count:**

| Pathway | Gene Count | Class |
|---------|-----------|-------|
| `D_PCL` | 28 | Polymers |
| `C_Toluene_degradation` | 26 | Aromatics |
| `D_PET` | 26 | Polymers |
| `D_PHA` | 22 | Polymers |
| `D_PHB` | 22 | Polymers |
| `A_Terminal/biterminal_oxidation` | 21 | Alkanes |
| `C_Protocatechuate_degradation` | 19 | Aromatics |
| `D_PLA` | 16 | Polymers |
| `C_Catechol_degradation` | 13 | Aromatics |
| `C_Anthranilate_degradation` | 12 | Aromatics |

**Cardinality:** 71 unique pathways  
**Genes per pathway:** min 1, max 28, mean 6.07

---

## Column 4: `compound_pathway`

**Data type:** Character (string)  
**Format:** Compound class (controlled vocabulary)  
**Example:** `Alkanes`, `Aromatics`, `Polymers`

**Controlled vocabulary:** Yes — Exactly 5 valid compound classes  
**Uniqueness:** Not unique — Multiple genes/pathways share the same class  
**Purpose:** High-level classification of hydrocarbon type targeted by the degradation pathway

**Valid compound classes:**

| Class | Genes | Rows | Pathways | Description |
|-------|-------|------|----------|-------------|
| `Aromatics` | 152 | 357 | 23 | Single-ring and PAH aromatic compounds |
| `Polymers` | 85 | 340 | 27 | Synthetic and biopolymers |
| `Alkanes` | 37 | 68 | 5 | Linear and branched alkanes |
| `Biosurfactant` | 28 | 52 | 12 | Biosurfactant-related pathways |
| `Alkenes` | 21 | 50 | 4 | Unsaturated hydrocarbons |

!!! note "HADEG v1.0.0 class update"
    The compound pathway classes in the current HADEG database are `Aromatics`, `Polymers`, `Alkanes`, `Biosurfactant`, and `Alkenes`. Earlier HADEG documentation referenced different class labels (`Cycloalkanes`, `BTEX`). The current CSV reflects the updated curation.

---

## Schema Constraints and Relationships

### Primary Key

**None defined** — Flat structure without explicit primary key  
**Conceptual primary key:** Combination of (`Gene`, `ko`, `Pathway`) approximates uniqueness

---

### Foreign Key Relationships

**Conceptual foreign keys (not enforced):**

- `ko` → KEGG Orthology database
- `ko` → BioRemPP Database v1.1.0 (`ko` join key)

---

### Cardinality

| Relationship | Type | Note |
|-------------|------|------|
| Gene → Pathway | Many-to-Many | A gene can participate in multiple pathways |
| Pathway → Compound class | Many-to-One | Each pathway belongs to exactly one class |
| KO → Pathway | Many-to-Many | A KO can appear in multiple pathways |

---

## Role in Integration Pipeline

The HADEG database is joined to BioRemPP data during ingest via the `ko` column:

```
hadeg_db.ko ──→ biorempp_database_v1.1.0.ko
```

For each BioRemPP compound–KO pair, the pipeline looks up matching HADEG records and:

1. Records the HADEG pathway(s) for that KO
2. Adds the compound to the `compound_pathway_map` if not already present
3. Records the source as `HADEG` in `compound_pathway_card`
4. Updates `compound_ko_pathway_rel` with the HADEG pathway–KO link

**Coverage:** 337 unique HADEG KOs; the majority of BioRemPP KOs (1,543 total) do not overlap with HADEG pathways.

---

## Data Quality

| Metric | Value |
|--------|-------|
| Total rows | 867 |
| Missing values (any column) | 0 |
| KO format valid (`^K\d{5}$`) | 867 / 867 (100%) |
| Unique genes | 323 |
| Unique KOs | 337 |
| Unique pathways | 71 |

---

## Loading Examples

=== "Python"

    ```python
    import pandas as pd

    hadeg = pd.read_csv("data/raw/hadeg_db.csv", sep=";", dtype=str)
    print(hadeg.shape)          # (867, 4)
    print(hadeg.columns.tolist())
    # ['Gene', 'ko', 'Pathway', 'compound_pathway']

    # Genes per compound class
    hadeg.groupby("compound_pathway")["Gene"].nunique()
    ```

=== "R"

    ```r
    library(readr)
    hadeg <- read_delim("data/raw/hadeg_db.csv", delim = ";")
    
    # Pathways for alkane degradation
    alkane_pathways <- unique(hadeg[hadeg$compound_pathway == "Alkanes", "Pathway"])
    
    # Count genes per pathway
    table(hadeg$Pathway)
    ```

---

## Related Pages

- [BioRemPP Integrated Database](biorempp-integrated-database.md) — compound–gene source joined via `ko`
- [KEGG Degradation Schema](kegg-degradation-schema.md) — second pathway source
- [Entity Relationships](entity-relationships.md) — how HADEG data feeds the SQLite model
- [Field Dictionary](field-dictionary.md) — SQLite pathway_summary table schema
