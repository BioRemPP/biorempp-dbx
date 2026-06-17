# BioRemPP Integrated Database

> **Formal specification of the BioRemPP Database v1.1.0 source CSV schema**

This page documents the BioRemPP Database source file (`biorempp_database_v1.1.0.csv`) — the primary input to the integration pipeline. It is a flat denormalized table linking environmental pollutant compounds to their associated genes, enzymatic functions, and regulatory annotations.

---

## Overview

The BioRemPP Database uses a **flat, denormalized schema** optimized for analytical queries and data integration workflows. The schema consists of a single table representing compound–gene–enzyme–agency relationships across 384 environmentally relevant compounds.

**Design rationale:**

- **Simplicity** — A single tidy table facilitates direct import into R, Python, and spreadsheet environments
- **Analytical optimization** — Denormalized design enables efficient filtering, grouping, and aggregation
- **Interoperability** — Standard semicolon-delimited CSV ensures compatibility with bioinformatics pipelines
- **FAIR compliance** — Controlled vocabularies for identifiers, compound classes, and agency codes support findability and reusability

---

## Schema Definition

### File: `biorempp_database_v1.1.0.csv`

| Property | Value |
|----------|-------|
| **Version** | 1.1.0 |
| **Format** | CSV (Comma-Separated Values) |
| **Rows** | 123,762 |
| **Columns** | 11 |
| **File size** | ~32 MB |
| **Character encoding** | UTF-8 |
| **Field delimiter** | Semicolon (`;`) |
| **Text qualifier** | Double quote (`"`) |
| **Header row** | Yes |

---

## Column Specifications

| # | Column Name | Data Type | Nullable | Controlled Vocabulary | Example Value |
|---|-------------|-----------|----------|----------------------|---------------|
| 1 | `cpd` | Character | No | KEGG Compound ID | `C06790` |
| 2 | `compoundclass` | Character | No | Chemical classification | `Aromatic` |
| 3 | `ko` | Character | No | KEGG Orthology ID | `K07408` |
| 4 | `ec` | Character | Yes | EC number | `1.14.14.1` |
| 5 | `reaction` | Character | Yes | KEGG Reaction ID | `R02340` |
| 6 | `reaction_description` | Character | Yes | KEGG reaction description | `alkane 1-monooxygenase; ...` |
| 7 | `referenceAG` | Character | No | Agency code | `EPA` |
| 8 | `compoundname` | Character | No | KEGG standard name | `Trichloroethene` |
| 9 | `genesymbol` | Character | No | Gene symbol | `CYP2E1` |
| 10 | `genename` | Character | No | KEGG gene annotation | `cytochrome P450 family 2...` |
| 11 | `enzyme_activity` | Character | No | Enzyme activity term | `monooxygenase` |

---

## Data Completeness

| Column | Missing Count | Completeness |
|--------|--------------|-------------|
| `cpd` | 0 | 100% |
| `compoundclass` | 0 | 100% |
| `ko` | 0 | 100% |
| `ec` | 961 | 99.22% |
| `reaction` | 2,223 | 98.20% |
| `reaction_description` | 2,223 | 98.20% |
| `referenceAG` | 0 | 100% |
| `compoundname` | 0 | 100% |
| `genesymbol` | 0 | 100% |
| `genename` | 0 | 100% |
| `enzyme_activity` | 0 | 100% |

Missing `ec` and `reaction` values reflect KO groups that do not have a resolved EC number or reaction identifier in KEGG Release 117.0+. These entries are retained in the database and flagged during integration.

---

## Row Distribution by Type

Based on the completeness pattern of `ec` and `reaction` columns:

| Row Type | Count | Description |
|----------|-------|-------------|
| Dense (ec + reaction both present) | 120,651 | Full annotation with EC and reaction |
| EC only (no reaction) | 2,150 | EC annotated, reaction not resolved |
| Reaction only (no EC) | 888 | Reaction annotated, EC not resolved |
| Both missing | 73 | Neither EC nor reaction resolved |

---

## Entity Cardinalities

| Entity | Unique Values |
|--------|--------------|
| Compounds (`cpd`) | 384 |
| KEGG Orthologs (`ko`) | 1,543 |
| Compound classes (`compoundclass`) | 12 |
| Reference agencies (`referenceAG`) | 9 |
| Gene symbols (`genesymbol`) | 1,517 |
| Gene names (`genename`) | 1,422 |
| Enzyme activities (`enzyme_activity`) | 206 |
| EC numbers (`ec`) | 994 |
| KEGG reaction IDs (`reaction`) | 1,939 |

---

## Compound Coverage

### Compounds per Regulatory Agency

| Agency Code | Full Name | Jurisdiction | Compounds |
|------------|-----------|-------------|----------|
| `ATSDR` | Agency for Toxic Substances and Disease Registry | USA | 191 |
| `IARC2B` | IARC Group 2B (Possibly carcinogenic) | International | 130 |
| `PSL` | Priority Substances List | Canada | 99 |
| `EPC` | Environmental Priority Chemicals | Europe | 91 |
| `WFD` | Water Framework Directive | EU | 84 |
| `EPA` | U.S. Environmental Protection Agency | USA | 83 |
| `IARC1` | IARC Group 1 (Carcinogenic to humans) | International | 56 |
| `CONAMA` | Conselho Nacional do Meio Ambiente | Brazil | 43 |
| `IARC2A` | IARC Group 2A (Probably carcinogenic) | International | 29 |

Compounds appear under multiple agencies when they are simultaneously listed by more than one regulatory body. Row counts per agency exceed the unique compound count due to this replication logic.

### Compounds per Chemical Class

| Class | Compounds | Description |
|-------|----------|-------------|
| `Aromatic` | 123 | Benzene ring-containing compounds |
| `Chlorinated` | 117 | Halogenated with chlorine substituents |
| `Nitrogen-containing` | 115 | Nitrogen functional groups |
| `Polyaromatic` | 98 | Multiple fused aromatic rings (PAHs) |
| `Aliphatic` | 94 | Straight-chain or branched hydrocarbons |
| `Metal` | 29 | Metal and metal-containing compounds |
| `Inorganic` | 26 | Inorganic compounds (ammonia, sulfates, nitrates) |
| `Sulfur-containing` | 20 | Sulfur functional groups |
| `Organophosphorus` | 13 | Phosphorus-containing organic compounds |
| `Organometallic` | 9 | Direct metal-carbon bonds |
| `Halogenated` | 8 | Halogenated compounds (bromo/fluoro) |
| `Organosulfur` | 1 | Organic sulfur compounds |

!!! note "Multi-class compounds"
    Compound class counts reflect how many compounds appear under each class in the CSV. A single compound may appear under multiple classes when it carries multiple class annotations — for example, a chlorinated aromatic compound generates rows under both `Chlorinated` and `Aromatic`.

---

## Top 20 Compounds by Row Frequency

The row count per compound reflects the number of compound–KO–agency combinations, not unique compound count.

| Rank | CPD | Name | Rows |
|------|-----|------|------|
| 1 | C00014 | Ammonia | 60,806 |
| 2 | C00067 | Formaldehyde | 14,997 |
| 3 | C06790 | Trichloroethene | 5,100 |
| 4 | C00084 | Acetaldehyde | 2,232 |
| 5 | C07535 | Benzo[a]pyrene | 2,135 |
| 6 | C00090 | Catechol | 1,735 |
| 7 | C14343 | Trifluralin | 1,602 |
| 8 | C00829 | Naphthalene | 1,326 |
| 9 | C18428 | Diuron | 1,251 |
| 10 | C06604 | Parathion | 1,056 |

---

## KO Distribution Statistics

| Metric | Value |
|--------|-------|
| Min KOs per compound | 1 |
| Max KOs per compound | 334 (Ammonia, C00014) |
| Mean KOs per compound | 8.91 |
| Min compounds per KO | 1 |
| Max compounds per KO | 27 |
| Mean compounds per KO | 2.22 |

---

## Top Enzyme Activity Families

| Enzyme Activity | Row Count | Compounds |
|----------------|-----------|----------|
| cytochrome P450 | 17,729 | 35 |
| dioxygenase | 11,414 | 88 |
| hydrolase | 7,818 | 26 |
| dehydrogenase | 7,029 | 106 |
| reductase | 6,314 | 53 |
| demethylase | 6,273 | 6 |
| oxidase | 5,852 | 28 |
| transglutaminase | 5,824 | 2 |
| monooxygenase | 4,438 | 74 |
| S-transferase | 3,922 | 13 |

---

## Version History

| Version | Date | Rows | Columns | Key Changes |
|---------|------|------|---------|-------------|
| v1.0.0 | December 2025 | 10,869 | 8 | Initial release |
| **v1.1.0** | April 2026 | **123,762** | **11** | **Added `ec`, `reaction`, `reaction_description` columns; expanded KEGG link matching with synthetic EC/reaction cartesian coverage; KEGG Release 117.0+** |

---

## Data Provenance

| Column | Source |
|--------|--------|
| `cpd`, `compoundname` | KEGG Compound database (Release 117.0+) |
| `ko`, `genesymbol`, `genename` | KEGG Orthology database (Release 117.0+) |
| `ec`, `reaction`, `reaction_description` | KEGG Reaction database (Release 117.0+) |
| `compoundclass` | KEGG Compound + ChEBI classification |
| `referenceAG` | Manual compilation from agency databases |
| `enzyme_activity` | Automated extraction via curated enzyme lexicon |

**KEGG release used for v1.1.0:** Release 117.0+/02-18 (retrieved 2026-02-17)

---

## Validation Rules

| Column | Validation |
|--------|-----------|
| `cpd` | Must match `^C\d{5}$` |
| `ko` | Must match `^K\d{5}$` |
| `referenceAG` | Must be one of 9 valid agency codes |
| `compoundclass` | Should match one of 12 standardized classes |
| `enzyme_activity` | Should match curated enzyme lexicon |

---

## Loading Examples

=== "Python"

    ```python
    import pandas as pd

    df = pd.read_csv("data/raw/biorempp_database_v1.1.0.csv", sep=";", dtype=str)
    print(df.shape)          # (123762, 11)
    print(df.columns.tolist())
    # ['cpd', 'compoundclass', 'ko', 'ec', 'reaction',
    #  'reaction_description', 'referenceAG', 'compoundname',
    #  'genesymbol', 'genename', 'enzyme_activity']

    # Unique compounds
    print(df["cpd"].nunique())   # 384

    # Compounds per class
    print(df.groupby("compoundclass")["cpd"].nunique().sort_values(ascending=False))
    ```

=== "R"

    ```r
    library(readr)
    db <- read_delim("data/raw/biorempp_database_v1.1.0.csv", delim = ";")
    
    # Shape
    dim(db)  # [1] 123762     11
    
    # Unique compounds
    length(unique(db$cpd))  # 384
    
    # Compounds per agency
    db |> dplyr::group_by(referenceAG) |> 
          dplyr::summarise(n_cpd = n_distinct(cpd)) |>
          dplyr::arrange(desc(n_cpd))
    ```

---

## Related Pages

- [Compound-Centric Model](compound-centric-model.md) — how v1.1.0 data is integrated into SQLite
- [Field Dictionary](field-dictionary.md) — full field reference including SQLite columns
- [HADEG Schema](hadeg-schema.md) — pathway source joined via `ko`
- [ToxCSM Schema](toxcsm-schema.md) — toxicity source joined via `cpd`
