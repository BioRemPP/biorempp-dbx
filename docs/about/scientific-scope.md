# Scientific Scope

This page defines the scientific boundaries, entity coverage, and integration strategy of the BioRemPP Database Explorer.

---

## Overview

The BioRemPP Database Explorer provides structured access to a curated, integrated database resource designed for exploratory environmental bioinformatics. The resource organizes biological and chemical evidence around individual **environmental compounds** to enable compound-centric exploration of bioremediation potential and toxicological risk.

---

## Scope and Purpose

The BioRemPP Integrated Database integrates curated annotations from four complementary databases:

| Database | Version reference | Primary scope |
|----------|-------------------|---------------|
| **BioRemPP DB** | v1.0.0 | Curated enzyme–compound associations and regulatory annotations |
| **KEGG Degradation** | KEGG Release Dec 2025 | Gene–pathway–compound relationships for xenobiotic degradation |
| **HADEG** | Current release | Hydrocarbon and aerobic degradation genes and enzymes |
| **ToxCSM** | Current release | Predicted toxicity profiles across environmental endpoints |

---

## Entity Coverage

The Database Explorer provides structured access to the following biological and chemical entity types:

### Compounds

Environmental compounds with at least one curated association in the BioRemPP integrated database. Each compound entry aggregates:

- Chemical identifiers (KEGG CPD, CAS number, IUPAC name, compound class)
- Enzyme–compound associations from BioRemPP DB
- Pathway membership from KEGG and HADEG
- Toxicity predictions from ToxCSM
- Regulatory classification from up to seven frameworks

### Genes and KEGG Orthologs (KOs)

KEGG Ortholog entries annotated in the context of xenobiotic degradation. Each KO entry provides:

- KEGG Ortholog identifier and functional description
- Gene symbol and enzyme activity annotation
- Pathway membership
- Linked compounds

### Pathways

Xenobiotic degradation pathways from KEGG and HADEG. Each pathway entry documents:

- Pathway identifier and name
- Source database (KEGG or HADEG)
- Member genes and KOs
- Associated compounds

### Toxicity Endpoints

ToxCSM-derived toxicity predictions organized into grouped endpoint categories:

- **Aquatic toxicity** — fish, Daphnia, and Tetrahymena endpoints
- **Regulatory toxicity** — AMES mutagenicity, carcinogenicity, hepatotoxicity
- **Organ toxicity** — NR and SR signaling pathway interference endpoints
- **Environmental persistence** — biodegradation classification

### Compound Classes

Structural and chemical classification categories that group compounds by shared chemical features. Classes allow population-level inspection of toxicological and bioremediation profiles across compound subsets.

---

## Regulatory Frameworks

Regulatory classifications are integrated at the compound level from seven international and regional frameworks:

| Framework | Agency | Geographic scope |
|-----------|--------|-----------------|
| **IARC** | International Agency for Research on Cancer | Global |
| **EPA** | U.S. Environmental Protection Agency | United States |
| **ATSDR** | Agency for Toxic Substances and Disease Registry | United States |
| **WFD** | Water Framework Directive | European Union |
| **PSL** | Priority Substances List | Canada |
| **EPC** | Environmental Protection Criteria | Brazil |
| **CONAMA** | National Environment Council | Brazil |

Regulatory annotations support compound prioritization and contextualization. They do not constitute legal compliance assessments.

---

## Interpretation Boundaries

The BioRemPP Database Explorer integrates curated database evidence. The following boundaries apply:

!!! warning "What this resource does NOT provide"
    - Experimental validation of biodegradation capability
    - Confirmation of toxicity outcomes in environmental conditions
    - Legal or regulatory compliance determination
    - Prediction of real-world remediation efficacy

!!! success "What this resource DOES provide"
    - Integrated curated evidence supporting exploratory analysis
    - Hypothesis-generating associations between compounds, genes, pathways, and toxicity profiles
    - Regulatory classification context for compound prioritization
    - Reproducible, structured access to database-derived relationships

---

## Data Provenance and Versioning

All integrated data is version-controlled and associated with stable DOI identifiers:

- **BioRemPP Database v1.0.0** — [Zenodo DOI: 10.5281/zenodo.18905195](https://doi.org/10.5281/zenodo.18905195)

External database versions (KEGG, HADEG, ToxCSM) used during integration are documented in [Data Sources](../methods/data-sources.md).

---

## Related Pages

- [Methods — Data Sources](../methods/data-sources.md)
- [Methods — Compound-Centric Mapping Strategy](../methods/compound-centric-mapping-strategy.md)
- [Methods — Assumptions and Limitations](../methods/assumptions-and-limitations.md)
- [Database Schemas — BioRemPP Integrated Database](../database-schemas/biorempp-integrated-database.md)
