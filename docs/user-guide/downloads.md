# Downloads

This page documents how to access the BioRemPP Integrated Database for download, what files are available, and how to verify file integrity.

---

## Overview

The BioRemPP Integrated Database is distributed as static CSV files archived on Zenodo with a stable DOI. Database files are versioned and accompaniedby SHA-256 checksums for integrity verification.

**Primary download location:**

[https://doi.org/10.5281/zenodo.18905195](https://doi.org/10.5281/zenodo.18905195)

Downloads are also accessible from the **Releases section** on the BioRemPP Database Explorer home page, which links directly to the Zenodo deposit.

---

## Available Files

The Zenodo deposit for BioRemPP Database v1.0.0 contains the following files:

| File | Content | Format |
|------|---------|--------|
| `biorempp_db.csv` | Curated enzyme–compound associations, regulatory annotations | CSV |
| `hadeg_db.csv` | HADEG gene–pathway associations for hydrocarbon degradation | CSV |
| `kegg_degradation_db.csv` | KEGG-derived degradation gene–pathway–compound relationships | CSV |
| `toxcsm_db.csv` | ToxCSM-predicted toxicity values for environmental compounds | CSV |
| `checksums.sha256` | SHA-256 integrity hashes for all distributed files | Text |

All CSV files use UTF-8 encoding and a comma delimiter.

---

## File Descriptions

### `biorempp_db.csv`

Contains curated enzyme–compound associations from the BioRemPP database. Key fields include:

- `cpd` — KEGG compound identifier
- `compoundname` — IUPAC compound name
- `compoundclass` — structural/chemical class
- `ko` — KEGG Ortholog identifier
- `genesymbol` — KEGG gene symbol annotation
- `genename` — gene name or functional description
- `enzyme_activity` — enzyme activity description
- `referenceAG` — regulatory agency classification

For the complete field specification, see [Database Schemas — BioRemPP Integrated Database](../database-schemas/biorempp-integrated-database.md).

### `hadeg_db.csv`

Contains HADEG gene–pathway association records. Key fields include:

- `ko` — KEGG Ortholog identifier
- `Gene` — gene symbol
- `Pathway` — degradation pathway name
- `compound_pathway` — associated compound pathway

For the complete field specification, see [Database Schemas — HADEG Schema](../database-schemas/hadeg-schema.md).

### `kegg_degradation_db.csv`

Contains KEGG-derived degradation gene–pathway–compound relationships. Key fields include:

- `ko` — KEGG Ortholog identifier
- `genesymbol` — KEGG gene symbol
- `pathname` — KEGG pathway name
- `cpd` — KEGG compound identifier

For the complete field specification, see [Database Schemas — KEGG Degradation Schema](../database-schemas/kegg-degradation-schema.md).

### `toxcsm_db.csv`

Contains ToxCSM-predicted toxicity values organized by compound and endpoint. Key fields include:

- `Compound` — compound name or identifier
- `SMILES` — molecular structure string
- `value_*` columns — predicted toxicity values per endpoint (multiple columns)

For the complete field specification including all endpoint columns, see [Database Schemas — ToxCSM Schema](../database-schemas/toxcsm-schema.md).

---

## Integrity Verification

All distributed files are accompanied by SHA-256 checksums in `checksums.sha256`. To verify file integrity after download:

```bash
sha256sum -c checksums.sha256
```

Expected output for all files: `OK`

If a file reports a mismatch, re-download it from Zenodo directly.

Current checksums for BioRemPP Database v1.0.0:

| File | SHA-256 |
|------|---------|
| `biorempp_db.csv` | `216cf113400161d6eee8d4eefb13bab23f60f9286874fa41ae8d00f3fc4637c0` |
| `hadeg_db.csv` | `d546c01be1cf05866b18aa25fd1edb23e4d90f9ab4e65fb5e37911c1e57ce938` |
| `kegg_degradation_db.csv` | `f3df93d3bc5492043d2f6a9ea087b6687757e4757057ba1ab19c1a0d53fcd619` |
| `toxcsm_db.csv` | `0d4616930b438964d9e007b20c9ffb9c414879b775a3b89d660bfc6278fe5f38` |

---

## Using the Downloaded Database

The CSV files can be loaded directly in R, Python, or any spreadsheet application.

**Python (pandas):**

```python
import pandas as pd

biorempp = pd.read_csv("path/biorempp_db.csv")
hadeg    = pd.read_csv("path/hadeg_db.csv")
kegg     = pd.read_csv("path/kegg_degradation_db.csv")
toxcsm   = pd.read_csv("path/toxcsm_db.csv")
```

**R:**

```r
biorempp <- read.csv("path/biorempp_db.csv", stringsAsFactors = FALSE)
hadeg    <- read.csv("path/hadeg_db.csv",    stringsAsFactors = FALSE)
kegg     <- read.csv("path/kegg_degradation_db.csv", stringsAsFactors = FALSE)
toxcsm   <- read.csv("path/toxcsm_db.csv",   stringsAsFactors = FALSE)
```

---

## Reproducibility Requirements

To ensure reproducibility when using the database in publications:

| Item | How to document |
|------|----------------|
| **Database version** | State v1.0.0 and the Zenodo DOI |
| **Database DOI** | `https://doi.org/10.5281/zenodo.18905195` |
| **KEGG release version** | BioRemPP DB v1.0.0 uses KEGG Release December 2025 |
| **File checksums** | Record SHA-256 hashes from `checksums.sha256` |
| **Analysis date** | Document when the database was accessed or downloaded |

### Recommended Methods statement

```text
Database analyses were performed using BioRemPP Database v1.0.0
(Lima Silva & Fassarella Agnez-Lima, 2025–2026; DOI: 10.5281/zenodo.18905195),
integrating compound-centric records from BioRemPP DB, KEGG Release December 2025,
HADEG, and ToxCSM.
```

---

## License

The BioRemPP Database is distributed under **Creative Commons Attribution 4.0 International (CC BY 4.0)**. You are free to share and adapt the data provided that appropriate credit is given and the license is cited.

Third-party integrated databases (KEGG, HADEG, ToxCSM) retain their own licensing terms. See [License](../about/license.md) and [Terms of Use](../about/terms-of-use.md).

---

## Related Pages

- [Data and Software Availability](../about/data-software-availability.md) — DOI references and FAIR principles
- [Database Schemas](../database-schemas/index.md) — complete field specifications for all four source databases
- [How to Cite](../about/how-to-cite.md) — citation requirements for publications
- [Interpretation Guide](interpretation-guide.md) — scientific interpretation of downloaded data
