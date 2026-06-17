# Interpretation Guide

This page provides guidance for scientifically responsible interpretation of content displayed in the BioRemPP Database Explorer.

---

## Purpose

The Database Explorer integrates curated records from four databases to support exploratory analysis of bioremediation potential and environmental risk. All displayed associations, scores, and classifications are **database-derived** — they require careful interpretation and downstream validation before applied use.

This page addresses:

- The distinction between database-derived evidence and experimental validation
- How to interpret compound–gene–pathway associations
- How to interpret ToxCSM toxicity predictions
- How to interpret regulatory annotations
- Common misinterpretation patterns to avoid

---

## What the Database Explorer Provides

The Database Explorer displays:

| Content type | Source | What it represents |
|-------------|--------|-------------------|
| Compound–KO associations | BioRemPP DB | Curated enzyme–compound co-annotations |
| Pathway memberships | KEGG, HADEG | Gene/compound membership in xenobiotic degradation pathways |
| Toxicity predictions | ToxCSM | Machine learning–based toxicity endpoint estimates |
| Regulatory classifications | IARC, EPA, ATSDR, WFD, PSL, EPC, CONAMA | Compound presence in regulatory priority/classification lists |

All of these are **curated database records** — not real-time experimental measurements.

---

## Compound–Gene–Pathway Associations

### What high association counts indicate

A compound with high **KO Count** or **Gene Count** has many annotated enzyme–compound associations in the integrated database. This indicates:

- Broad database coverage of enzymatic evidence for that compound
- Multiple annotated degradation-related genes are linked to the compound across curated sources

**This does NOT indicate:**

- That the compound is actively degraded by those enzymes in any environment
- That the associated genes are expressed in a relevant biological context
- That degradation is thermodynamically or kinetically feasible under specific conditions

### Pathway coverage

A compound appearing in many pathways reflects its presence in curated degradation pathway annotations. **Pathway membership is a database annotation**, not a measurement of in situ pathway activity.

**Correct framing:**

> "Compound X is annotated in Y degradation pathways across the integrated database, suggesting broad enzymatic coverage for bioremediation-relevant biotransformation."

**Incorrect framing:**

> "Compound X is degraded via Y pathways."

### Database source agreement

A compound or gene appearing in multiple integrated sources (BioRemPP, KEGG, HADEG) reflects **consistent curation across databases**, not experimental confirmation. Cross-source agreement increases evidence robustness but does not constitute experimental validation.

---

## Toxicity Predictions (ToxCSM)

### Nature of ToxCSM values

All toxicity values in the Database Explorer are **ToxCSM computational predictions** derived from compound structure using machine learning models. They are estimates, not measured toxicity endpoints.

**Value scale:** 0–1 (continuous prediction score for most endpoints)

**Endpoint groups displayed:**

- Aquatic toxicity — fish, Daphnia, Tetrahymena
- Regulatory toxicity — AMES mutagenicity, carcinogenicity, hepatotoxicity
- Organ toxicity — nuclear receptor and stress response pathway interference
- Environmental persistence — biodegradation classification

### Interpretation guidelines

| Correct use | Incorrect use |
|-------------|--------------|
| Prioritize compounds for further experimental toxicity testing | Use as definitive hazard classification |
| Compare predicted profiles across a compound set | Report as measured LD50 or experimental endpoint |
| Identify candidates for screening-level risk assessment | Use for regulatory submissions without validation |
| Combine with bioremediation evidence for risk-vs-potential analysis | Infer specific organism- or environment-level toxicity |

### Toxicity heatmaps

Toxicity heatmaps on compound, gene, and pathway detail pages display predicted toxicity scores as a compound × endpoint matrix. Color intensity reflects predicted value magnitude.

**Reading a heatmap:**

- High-intensity cells indicate a high predicted toxicity score for that compound–endpoint combination
- The pattern of active endpoints suggests which toxicity categories may be relevant for further investigation
- White or low-intensity cells indicate low predicted values or absence of a prediction for that endpoint

!!! warning "Heatmap interpretation boundary"
    Heatmap patterns support exploratory prioritization only. They do not constitute toxicological risk assessments or hazard classifications.

---

## Regulatory Annotations

### What regulatory classifications represent

Regulatory annotations indicate that a compound appears in the priority substance list or classification system of one or more agencies (IARC, EPA, ATSDR, WFD, PSL, EPC, CONAMA).

**Purpose in the Database Explorer:** provide environmental and health relevance context for compound prioritization in bioremediation research.

**Regulatory annotations do NOT represent:**

- Legal compliance determinations in any jurisdiction
- Exposure limit values or safe concentration thresholds
- Risk evaluations or hazard assessments
- Regulatory approval or certification

Users requiring formal risk assessment or regulatory compliance evaluation must consult jurisdiction-specific regulations and conduct independent assessments.

### Combining regulatory context with bioremediation evidence

A compound classified under multiple regulatory frameworks AND linked to multiple degradation genes/pathways is a **candidate of interest** for bioremediation research — a compound that is environmentally regulated and has annotated enzymatic degradation evidence. This combination supports prioritization for experimental investigation.

---

## Guided Analysis Outputs

### UC3 — Risk vs. Bioremediation Potential scatterplot

The quadrant scatterplot (X = gene count / bioremediation evidence, Y = predicted toxicity) positions compounds by their database-derived profiles. Compounds in the **top-right quadrant** (high gene count AND high toxicity) are candidates of highest research interest under this framing.

**Correct interpretation:** These compounds combine broad enzymatic annotation with high predicted toxicity — making them candidates for bioremediation-focused risk reduction research.

**Incorrect interpretation:** These compounds are confirmed toxic and can be biodegraded by the identified enzymes.

Quadrant thresholds are based on **P75 (75th percentile)** of each axis across the result set — not absolute scientific thresholds.

### Rankings in UC1, UC7

Rankings by KO count (UC1) or compound count (UC7) reflect database coverage, not biological significance. The top-ranked compound is the one with the most curated database records — not necessarily the most important candidate in any specific environmental context.

---

## Common Misinterpretations

### Misinterpretation 1 — Enzyme annotation as proof of degradation

**Incorrect:**
> "This compound has 15 linked KOs, so it is biodegradable."

**Correct:**
> "This compound has 15 annotated enzyme–compound associations in the integrated database, indicating substantial curated evidence for degradation-related enzymatic activity. Experimental validation is required."

---

### Misinterpretation 2 — Toxicity prediction as measured hazard

**Incorrect:**
> "ToxCSM predicts high AMES toxicity for this compound; it is a mutagen."

**Correct:**
> "ToxCSM computational prediction indicates a high AMES toxicity score for this compound. Experimental mutagenicity testing is required for definitive classification."

---

### Misinterpretation 3 — Regulatory listing as active risk

**Incorrect:**
> "This compound appears in IARC and EPA lists, so it presents imminent risk at this site."

**Correct:**
> "This compound is classified under IARC and EPA frameworks, providing regulatory context for prioritization. Site-specific risk assessment requires environmental sampling and exposure analysis."

---

### Misinterpretation 4 — Empty results as absence of function

**Incorrect:**
> "No toxicity records appear for this compound, so it is safe."

**Correct:**
> "No ToxCSM predictions are available for this compound in the current database version. This reflects database coverage limitations, not a confirmed absence of toxicity."

---

### Misinterpretation 5 — Database coverage as experimental validation

**Incorrect:**
> "This compound appears in BioRemPP, KEGG, and HADEG — the evidence is validated."

**Correct:**
> "This compound has consistent annotations across three integrated databases, indicating robust curated evidence. Cross-source agreement strengthens hypothesis confidence but does not replace experimental validation."

---

## Reproducibility and Transparency

When reporting database-derived analyses:

- State the database version: BioRemPP Database v1.0.0
- Cite the Zenodo DOI: `https://doi.org/10.5281/zenodo.18905195`
- Document all applied filters and query parameters
- Report KEGG release version when citing KEGG-derived associations (KEGG Release December 2025)
- Explicitly distinguish database-derived evidence from experimental validation in Methods sections

See [How to Cite](../about/how-to-cite.md) for citation templates.

---

## Related Pages

- [Downloads](downloads.md) — access the full database for independent analysis
- [Methods — Assumptions and Limitations](../methods/assumptions-and-limitations.md) — full scope boundaries
- [Methods — Toxicity Endpoint Grouping](../methods/toxicity-endpoint-grouping.md) — ToxCSM endpoint classification
- [Guided Analysis — Output Interpretation](../guided-analysis/output-interpretation.md) — use-case-specific interpretation
- [How to Cite](../about/how-to-cite.md) — citation requirements
