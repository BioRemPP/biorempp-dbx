# BioRemPP Database Explorer

**BioRemPP Database Explorer** is a curated, integrated, compound-centric database resource for exploratory analysis of bioremediation potential and environmental risk.

The resource enables researchers to navigate relationships between environmental compounds, degradation genes, metabolic pathways, toxicity endpoints, and regulatory annotations through a unified, open-access interface — without file submission or registration.

---

## What is the Database Explorer?

The Database Explorer provides structured, browser-based access to the **BioRemPP Integrated Database**, a curated compilation of four complementary data sources:

| Database | Scientific focus |
|----------|-----------------|
| **BioRemPP DB** | Curated enzyme–compound associations for bioremediation |
| **KEGG Degradation** | KEGG-derived gene–pathway–compound relationships |
| **HADEG** | Hydrocarbon and aerobic degradation genes and enzymes |
| **ToxCSM** | Predicted toxicity profiles for environmental compounds |

Regulatory classifications from seven frameworks (IARC, EPA, ATSDR, WFD, PSL, EPC, CONAMA) are integrated at the compound level, enabling cross-domain interpretation of bioremediation potential and environmental risk.

---

## Key Capabilities

- **Compound-centric navigation** — all integrated evidence is organized around individual environmental compounds
- **Explorer interfaces** — dedicated pages for Compounds, Genes/KOs, Pathways, Toxicity, and Compound Classes
- **Guided analysis** — pre-configured query recipes addressing eight scientific use cases (UC1–UC8)
- **Regulatory context** — seven regulatory classification frameworks accessible per compound
- **Open access** — no registration, no file upload, no data submission required
- **Reproducible exploration** — all queries and filters are parameter-driven and documentable

---

## Scientific Framing

The Database Explorer supports **exploratory analysis and hypothesis generation** in environmental bioinformatics. It is designed to assist:

- Prioritization of candidate compounds for bioremediation research
- Inspection of degradation pathway coverage across curated gene catalogs
- Comparative assessment of toxicity profiles against bioremediation potential
- Identification of compounds under regulatory classification
- Generation of research hypotheses for downstream experimental validation

!!! warning "Interpretation boundary"
    Database-derived associations do not constitute experimental validation of biodegradation capability, toxicity outcomes, or remediation efficacy. Downstream experimental validation is required before any applied or regulatory use.

---

## Getting Started

New to the Database Explorer?

- [Quickstart](getting-started/quickstart.md) — explore the database in five minutes
- [Database Access](getting-started/database-access.md) — how to connect to the resource
- [Example Queries](getting-started/example-queries.md) — step-by-step query walkthroughs

---

## Citation

If you use the BioRemPP Database Explorer or the BioRemPP Database in your research, please cite:

```text
Lima Silva, D. F., & Fassarella Agnez-Lima, L. (2025–2026). BioRemPP Database:
A Curated Compound-Centric Resource for Bioremediation Potential Profiling (1.0.0)
[Data set]. Zenodo. https://doi.org/10.5281/zenodo.18905195
```

See [How to Cite](about/how-to-cite.md) for complete citation guidance and BibTeX templates.

---

## License

| Component | License |
|-----------|---------|
| **Database Explorer source code** | Apache License 2.0 |
| **BioRemPP Database content** | CC BY 4.0 |

See [License](about/license.md) for full licensing details.

---

## Version

Current release: **v1.0.0** — See [Changelog](about/changelog.md) for release history.

---

## Related Resources

- [BioRemPP Web Service](https://biorempp.readthedocs.io) — upload-based bioremediation profiling pipeline
- [BioRemPP Database on Zenodo](https://doi.org/10.5281/zenodo.18905195) — downloadable database artifact
- [LBMG UFRN](https://lbmg.cb.ufrn.br/) — host laboratory
