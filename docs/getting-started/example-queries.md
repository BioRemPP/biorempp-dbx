# Example Queries

This page provides step-by-step walkthroughs for the eight guided analysis use cases available in the BioRemPP Database Explorer. Each query recipe addresses a specific scientific question about bioremediation potential and environmental risk.

!!! info "Guided Analysis section"
    Full documentation for each use case — including query logic, output structure, visualization guides, and interpretation boundaries — is available in the [Guided Analysis](../guided-analysis/index.md) section.

---

## UC1 — Top Bioremediation-Linked Compounds

**Scientific question:** Which compounds in the database have the highest number of enzyme–pathway associations, indicating broad bioremediation evidence coverage?

**Steps:**

1. Navigate to **Guided Analysis** in the top navigation bar
2. Select **UC1 — Top Bioremediation-Linked Compounds**
3. Optionally adjust the **Top N** parameter (default: 20 compounds)
4. Click **Run Query**
5. Review the ranked compound table and bar chart
6. Click any compound row to open its detail page

**Output:** Ranked table of compounds by total enzyme–pathway evidence count; bar chart visualization.

**Interpretation note:** High association counts reflect database coverage, not experimental confirmation of degradation activity.

---

## UC2 — Most Toxic Compounds

**Scientific question:** Which compounds have the broadest predicted toxicity profiles across ToxCSM endpoint groups?

**Steps:**

1. Navigate to **Guided Analysis → UC2 — Most Toxic Compounds**
2. Optionally filter by **endpoint group** (aquatic, regulatory, organ)
3. Click **Run Query**
4. Review the ranked compound table and toxicity distribution chart

**Output:** Ranked table of compounds by number of active toxicity endpoints; distribution visualization.

**Interpretation note:** Toxicity values are ToxCSM predictions — database-derived indicators, not experimentally measured toxicity outcomes.

---

## UC3 — Risk versus Bioremediation Potential

**Scientific question:** Which compounds combine high predicted toxicity with substantial bioremediation evidence, identifying priority candidates for remediation research?

**Steps:**

1. Navigate to **Guided Analysis → UC3 — Risk versus Bioremediation Potential**
2. Click **Run Query**
3. Examine the scatterplot with compounds distributed by toxicity score (Y-axis) and bioremediation evidence count (X-axis)
4. Identify compounds in the high-toxicity / high-bioremediation quadrant
5. Click any point to open the compound detail page

**Output:** Scatterplot; compound table with both dimensions shown.

**Interpretation note:** Quadrant position indicates relative database-derived profiles, not real-world remediation efficacy.

---

## UC4 — Compounds Regulated by Agency

**Scientific question:** Which compounds in the database are classified under one or more regulatory frameworks?

**Steps:**

1. Navigate to **Guided Analysis → UC4 — Compounds Regulated by Agency**
2. Select one or more **Regulatory Agencies** from the filter (IARC, EPA, ATSDR, WFD, PSL, EPC, CONAMA)
3. Click **Run Query**
4. Review the compound table showing regulatory classification per framework

**Output:** Compound table with regulatory status columns per selected agency.

**Interpretation note:** Regulatory annotations are classification indicators for prioritization. They do not constitute legal compliance assessments.

---

## UC5 — Pathway Functional Coverage

**Scientific question:** Which degradation pathways are most broadly represented in the integrated gene catalog?

**Steps:**

1. Navigate to **Guided Analysis → UC5 — Pathway Functional Coverage**
2. Optionally filter by **source database** (KEGG, HADEG, or both)
3. Click **Run Query**
4. Review the pathway ranking table and coverage bar chart

**Output:** Ranked table of pathways by number of annotated genes; bar chart.

**Interpretation note:** Coverage reflects database annotation density, not in situ functional activity.

---

## UC6 — Pathways Linked to Toxic Compounds

**Scientific question:** Which degradation pathways are associated with compounds that have predicted toxicity profiles?

**Steps:**

1. Navigate to **Guided Analysis → UC6 — Pathways Linked to Toxic Compounds**
2. Optionally set a **minimum toxicity score threshold**
3. Click **Run Query**
4. Review the pathway table with linked compound and toxicity counts

**Output:** Pathway table showing count of linked toxic compounds per pathway.

**Interpretation note:** Pathway–toxicity links are database-derived associations. Downstream validation of toxicological relevance is required.

---

## UC7 — Most Connected Genes

**Scientific question:** Which KEGG Ortholog entries (KOs) are linked to the highest number of compounds and pathways, indicating broad functional connectivity?

**Steps:**

1. Navigate to **Guided Analysis → UC7 — Most Connected Genes**
2. Optionally adjust the **Top N** parameter (default: 20 KOs)
3. Click **Run Query**
4. Review the ranked KO table with compound and pathway counts
5. Click any KO row to open the gene detail page

**Output:** Ranked table of KOs by total connectivity (compounds + pathways); bar chart.

**Interpretation note:** High connectivity reflects database coverage. It does not imply gene expression or enzymatic activity.

---

## UC8 — Genes Linked to Toxic Compounds

**Scientific question:** Which KOs are associated with compounds that have predicted toxicity profiles, identifying genes relevant to toxic compound degradation?

**Steps:**

1. Navigate to **Guided Analysis → UC8 — Genes Linked to Toxic Compounds**
2. Optionally filter by **endpoint group** or set a minimum toxicity score
3. Click **Run Query**
4. Review the KO table with linked compound and toxicity counts

**Output:** KO table showing count of linked toxic compounds; toxicity summary per KO.

**Interpretation note:** Gene–toxicity links are database-derived. Experimental validation of degradation activity is required before applied use.

---

## Downloading Query Results

After running any query:

1. Click **Download** above the results table
2. Select format: CSV, Excel (.xlsx), or JSON
3. The exported file reflects the current query result with all applied parameters

For chart exports, use the camera icon on the visualization component to save as PNG or SVG.

---

## Related Pages

- [Guided Analysis — Overview](../guided-analysis/index.md) — Complete guided analysis documentation
- [Guided Analysis — Query Recipes](../guided-analysis/query-recipes.md) — Query logic and parameters
- [Guided Analysis — Output Interpretation](../guided-analysis/output-interpretation.md) — How to read outputs
- [User Guide — Downloads](../user-guide/downloads.md) — Export options and formats
- [Methods — Assumptions and Limitations](../methods/assumptions-and-limitations.md) — Scope boundaries
