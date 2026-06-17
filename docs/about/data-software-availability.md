# Data and Software Availability

This page documents the availability of all BioRemPP Database Explorer components for citation, download, and independent deployment.

---

## Database Availability

The BioRemPP Integrated Database is publicly available and archived with a stable DOI on Zenodo:

| Resource | Version | DOI | License |
|----------|---------|-----|---------|
| **BioRemPP Database** | 1.0.0 | [10.5281/zenodo.18905195](https://doi.org/10.5281/zenodo.18905195) | CC BY 4.0 |

The Zenodo deposit includes:

- `biorempp_db.csv` — curated enzyme–compound associations and regulatory annotations
- `hadeg_db.csv` — HADEG gene–pathway associations
- `kegg_degradation_db.csv` — KEGG-derived degradation gene–pathway–compound relationships
- `toxcsm_db.csv` — ToxCSM-derived toxicity predictions for environmental compounds
- `checksums.sha256` — SHA-256 integrity hashes for all distributed files

Download the complete database artifact from:
[https://doi.org/10.5281/zenodo.18905195](https://doi.org/10.5281/zenodo.18905195)

---

## Software Availability

The BioRemPP Database Explorer source code is publicly available on GitHub:

| Resource | Repository | License |
|----------|-----------|---------|
| **Database Explorer** | [github.com/DougFelipe/biorempp_database_explorer](https://github.com/DougFelipe/biorempp_database_explorer) | Apache License 2.0 |
| **BioRemPP Web Service** | [github.com/BioRemPP/biorempp_web](https://github.com/BioRemPP/biorempp_web) | Apache License 2.0 |

---

## Related Web Service

The **BioRemPP Web Service** is a complementary tool providing upload-based bioremediation profiling workflows:

| Resource | Version | DOI | License |
|----------|---------|-----|---------|
| **BioRemPP Web Service** | 1.0.0 | [10.5281/zenodo.18919675](https://doi.org/10.5281/zenodo.18919675) | Apache License 2.0 |

---

## Integrity Verification

Database files distributed via Zenodo are accompanied by SHA-256 checksums. To verify integrity after download:

```bash
sha256sum -c checksums.sha256
```

---

## Deployment and Reproducibility

The BioRemPP Database Explorer supports self-hosted institutional deployments. All configuration options are documented in the [Configuration](../configuration/index.md) section.

Docker images and deployment artifacts are included in the repository. See [Docker Integration](../configuration/docker-integration.md) for setup instructions.

---

## FAIR Principles

The BioRemPP Database follows FAIR data principles:

| Principle | Implementation |
|-----------|---------------|
| **Findable** | Stable Zenodo DOI; indexed metadata |
| **Accessible** | Open-access download; no registration required |
| **Interoperable** | Standard CSV format; KEGG and CAS identifiers |
| **Reusable** | CC BY 4.0 license; versioned releases; documented schema |

---

## Contact

For availability questions or download issues, see [Contact](contact.md).
