# KEGG Degradation Database Schema

> **Formal specification of the KEGG Degradation Database source schema**

The KEGG Degradation Database contains KO–pathway–gene associations for xenobiotic and pollutant degradation pathways extracted from the KEGG Pathway database. It is one of the four source databases integrated by the BioRemPP Database Explorer pipeline.

---

## Overview

The KEGG Degradation Database uses a **flat, denormalized schema** optimized for gene–pathway queries. The schema consists of a single table with **3 columns** representing KO–pathway–genesymbol associations derived from KEGG xenobiotic metabolism pathways.

**Design rationale:**

- **Simplicity** — Minimal 3-column structure for focused pathway analysis
- **KEGG-sourced** — All data extracted from official KEGG pathway definitions
- **Cross-reference ready** — KO identifiers enable integration with BioRemPP and HADEG databases

---

## Schema Definition

### File: `kegg_degradation_db.csv`

| Property | Value |
|----------|-------|
| **KEGG Release** | 117.0+ (retrieved 2026-02-17) |
| **Format** | CSV |
| **Rows** | 855 |
| **Columns** | 3 |
| **File size** | ~21.1 KB |
| **Character encoding** | UTF-8 |
| **Field delimiter** | Semicolon (`;`) |
| **Text qualifier** | Double quote (`"`) |
| **Header row** | Yes |

---

## Column Specifications

| # | Column Name | Data Type | Nullable | Controlled Vocabulary | Example Value |
|---|-------------|-----------|----------|----------------------|---------------|
| 1 | `ko` | Character | No | KEGG Orthology ID | `K00001` |
| 2 | `pathname` | Character | No | KEGG pathway name (20 values) | `Naphthalene` |
| 3 | `genesymbol` | Character | No | Gene symbol | `nahAc` |

**Data completeness:** 100% — Zero missing values across all 3 columns.

---

## Column 1: `ko`

**Data type:** Character (string)  
**Format:** KEGG Orthology identifier  
**Pattern:** `K#####` (capital K followed by exactly 5 digits)  
**Example:** `K00001`, `K14579`, `K07408`

**Controlled vocabulary:** Yes — Values must exist in KEGG Orthology database  
**Uniqueness:** Not unique — 517 unique KO entries, some appear in multiple pathways  
**Purpose:** Links genes to functional orthologs in KEGG; used as join key to BioRemPP data

**Validation rules:**

- ✅ Must match regex: `^K\d{5}$`
- ✅ Must exist in KEGG Orthology database (Release 117.0+)
- ✅ Case-sensitive (uppercase K required)

**Cardinality:** 517 unique KO entries

---

## Column 2: `pathname`

**Data type:** Character (string)  
**Format:** Human-readable KEGG pathway name  
**Example:** `Aromatic`, `Naphthalene`, `Cytochrome P450`

**Controlled vocabulary:** Partially — 20 pathway names  
**Uniqueness:** Not unique — Multiple KO groups belong to each pathway  
**Purpose:** Categorizes genes by their KEGG xenobiotic degradation pathway

**Pathway coverage:**

| Pathway | KO Count | Gene Count |
|---------|----------|-----------|
| `Aromatic` | 215 | 213 |
| `Benzoate` | 106 | 105 |
| `Aminobenzoate` | 89 | 88 |
| `Toluene` | 46 | 46 |
| `PAH` | 43 | 43 |
| `Cl. alkane and Cl.alkene` | 43 | 43 |
| `Cl. cyclohexane and Cl. benzene` | 41 | 41 |
| `Cytochrome P450` | 34 | 34 |
| `Xylene` | 34 | 34 |
| `Dioxin` | 31 | 29 |
| `Naphthalene` | 29 | 29 |
| `Styrene` | 25 | 25 |
| `Caprolactam` | 22 | 22 |
| `Nitrotoluene` | 22 | 22 |
| `Fluorobenzoate` | 18 | 18 |
| `Atrazine` | 16 | 16 |
| `Ethylbenzene` | 16 | 16 |
| `Steroid` | 15 | 15 |
| `Furfural` | 8 | 8 |
| `Bisphenol` | 2 | 2 |

**Cardinality:** 20 unique pathways  
**KOs per pathway:** min 2, max 215, mean 42.75

---

## Column 3: `genesymbol`

**Data type:** Character (string)  
**Format:** Standard gene nomenclature (free text)  
**Example:** `E1.1.1.1`, `nahAc`, `AKR1A1`

**Controlled vocabulary:** No — Free text, sourced from KEGG KO annotations  
**Uniqueness:** Not unique — 513 unique symbols; some shared across pathways  
**Purpose:** Provides the short gene abbreviation for the associated KO group

**Naming conventions:**

- EC number format for enzyme-named genes (e.g., `E1.1.1.1`)
- HUGO nomenclature for human genes (e.g., `AKR1A1`)
- Organism-specific abbreviations for microbial genes (e.g., `nahAc`, `dmpN`)

**Cardinality:** 513 unique gene symbols

---

## Schema Constraints and Relationships

### Primary Key

**None defined** — Flat structure without explicit primary key  
**Conceptual primary key:** Combination of (`ko`, `pathname`) approximates uniqueness

---

### Foreign Key Relationships

**Conceptual foreign keys (not enforced):**

- `ko` → KEGG Orthology database
- `ko` → BioRemPP Database v1.1.0 (`ko` join key)
- `ko` → HADEG Database (`ko` join key, overlapping coverage)

---

### Cardinality

| Relationship | Type | Note |
|-------------|------|------|
| KO → Pathway | Many-to-Many | A KO can participate in multiple pathways |
| Pathway → KOs | One-to-Many | Each pathway contains multiple KO entries |
| KO → Gene symbol | Many-to-One | Multiple KOs may share the same gene symbol (isoforms) |

---

## Role in Integration Pipeline

The KEGG Degradation Database is joined to BioRemPP data during ingest via the `ko` column:

```
kegg_degradation_db.ko ──→ biorempp_database_v1.1.0.ko
```

For each BioRemPP compound–KO pair, the pipeline looks up matching KEGG degradation records and:

1. Records the KEGG pathway(s) for that KO
2. Adds the compound–pathway pair to `compound_pathway_map` (source = `KEGG`)
3. Records per-compound pathway cards in `compound_pathway_card` with source `KEGG`
4. Updates `compound_ko_pathway_rel` with the KEGG pathway–KO link

**Coverage:** 517 unique KEGG degradation KOs contribute to pathway annotations for linked compounds.

---

## Data Source

**Source:** KEGG Pathway Database  
**Category:** Metabolism → Xenobiotics biodegradation and metabolism  
**KEGG Release used:** 117.0+/02-18 (retrieved 2026-02-17)

The KEGG pathways included represent the "Xenobiotics biodegradation and metabolism" module in KEGG, covering aerobic and anaerobic degradation of aromatic compounds, chlorinated compounds, and other environmental pollutants.

---

## Data Quality

| Metric | Value |
|--------|-------|
| Total rows | 855 |
| Missing values (any column) | 0 |
| KO format valid (`^K\d{5}$`) | 855 / 855 (100%) |
| Unique KOs | 517 |
| Unique pathways | 20 |
| Unique gene symbols | 513 |

---

## Loading Examples

=== "Python"

    ```python
    import pandas as pd

    kegg = pd.read_csv("data/raw/kegg_degradation_db.csv", sep=";", dtype=str)
    print(kegg.shape)          # (855, 3)
    print(kegg.columns.tolist())
    # ['ko', 'pathname', 'genesymbol']

    # KOs per pathway
    kegg.groupby("pathname")["ko"].nunique().sort_values(ascending=False)

    # Find pathways for a specific KO
    kegg[kegg["ko"] == "K14579"]["pathname"].unique()
    ```

=== "R"

    ```r
    library(readr)
    kegg <- read_delim("data/raw/kegg_degradation_db.csv", delim = ";")
    
    # Genes in naphthalene degradation
    naph_genes <- kegg[kegg$pathname == "Naphthalene", ]
    
    # Count KOs per pathway
    table(kegg$pathname)
    ```

---

## Related Pages

- [BioRemPP Integrated Database](biorempp-integrated-database.md) — compound–gene source joined via `ko`
- [HADEG Schema](hadeg-schema.md) — complementary pathway source
- [Entity Relationships](entity-relationships.md) — how KEGG data feeds the SQLite model
- [Field Dictionary](field-dictionary.md) — SQLite pathway_summary table schema
