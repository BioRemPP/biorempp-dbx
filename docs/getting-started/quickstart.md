# Quickstart

Explore the BioRemPP Integrated Database in under 5 minutes — no account, no installation, no file submission required.

---

## What You Will Explore

The Database Explorer provides compound-centric access to four integrated databases (BioRemPP DB, KEGG, HADEG, ToxCSM) and seven regulatory frameworks. In this walkthrough you will:

1. Open the Database Explorer
2. Browse the Compounds Explorer
3. Search for a specific compound
4. Apply a filter
5. Inspect a compound detail page
6. Run a Guided Analysis query
7. Download results

---

## Step 1 — Open the Database Explorer

Navigate to the BioRemPP Database Explorer at the institutional deployment endpoint.

No login or registration is required. The homepage displays a navigation bar with links to each Explorer and the Guided Analysis section.

---

## Step 2 — Navigate to the Compounds Explorer

Click **Compounds** in the top navigation bar.

The Compounds Explorer loads a paginated table of all environmental compounds in the integrated database. Each row displays:

- Compound name and KEGG CPD identifier
- CAS number
- Compound class
- Number of linked genes, pathways, and toxicity records
- Regulatory classification flags

---

## Step 3 — Search for a Compound

Use the **search bar** at the top of the Compounds Explorer to search by compound name, KEGG CPD code, or CAS number.

**Example:** Type `benzene` to retrieve all compounds matching that term.

Results update in real time as you type. The table shows all compounds whose name, identifier, or class contains the search term.

---

## Step 4 — Apply a Filter

Use the **filter panel** to narrow results by one or more criteria.

**Example filter workflow:**

1. Expand the **Compound Class** filter
2. Select `Aromatic Hydrocarbon`
3. The table updates to show only aromatic hydrocarbons

You can combine multiple filters simultaneously. Click **Clear Filters** to reset to the full result set.

---

## Step 5 — Inspect a Compound Detail Page

Click on any compound row to open its **detail page**.

The compound detail page consolidates all integrated evidence for that compound:

- **Identifiers** — KEGG CPD, CAS number, IUPAC name, compound class
- **Linked genes and KOs** — enzyme associations with gene symbol and pathway context
- **Linked pathways** — degradation pathway membership from KEGG and HADEG
- **Toxicity profile** — ToxCSM-predicted toxicity values organized by endpoint group
- **Regulatory annotations** — classification status across all applicable frameworks (IARC, EPA, ATSDR, WFD, PSL, EPC, CONAMA)

---

## Step 6 — Run a Guided Analysis Query

Navigate to **Guided Analysis** in the top navigation bar.

Select **UC1 — Top Bioremediation-Linked Compounds**.

This query returns the compounds with the highest number of enzyme–pathway associations in the integrated database, ranked by bioremediation evidence coverage.

The result displays:

- A ranked compound table
- A bar chart of evidence counts
- Interpretation guidance and limitation notes

For a complete list of available queries, see [Example Queries](example-queries.md).

---

## Step 7 — Download Results

From any Explorer table or Guided Analysis result:

- Click **Download** to export the current filtered result set
- Available formats: CSV, Excel (.xlsx), JSON

For visualization exports, hover over a chart and use the camera icon to save as PNG or SVG.

---

## What Comes Next?

**To understand your results:**

- [User Guide — Explorer Pages](../user-guide/explorer-pages.md) — Structure and behavior of each explorer interface
- [User Guide — Entity Detail Pages](../user-guide/entity-detail-pages.md) — How to read compound, gene, and pathway detail views
- [User Guide — Interpretation Guide](../user-guide/interpretation-guide.md) — Scientific interpretation of database-derived evidence

**To run more queries:**

- [Guided Analysis](../guided-analysis/index.md) — All eight guided query use cases
- [Example Queries](example-queries.md) — Step-by-step query walkthroughs

**Need help?**

- [FAQ](faq.md) — Common questions and answers
- [User Guide — Troubleshooting](../user-guide/troubleshooting.md) — Technical issues
- [Contact](../about/contact.md) — Support and collaboration

---

## Scope Reminder

The BioRemPP Database Explorer provides **database-derived evidence** for exploratory analysis of bioremediation potential and environmental risk.

Results support:

- Identification of candidate compounds and genes for bioremediation research
- Hypothesis generation for downstream experimental validation
- Comparative inspection of toxicity and regulatory profiles

Results do NOT constitute:

- Experimental validation of biodegradation capability
- Confirmation of toxicity outcomes in environmental conditions
- Regulatory compliance determinations

!!! warning "Downstream validation required"
    All database-derived associations must be validated through independent experimental or field studies before any applied or regulatory use.

---

## Related Pages

- [Database Access](database-access.md) — How to connect to the resource
- [Search and Filtering](search-and-filtering.md) — Complete search and filter reference
- [Example Queries](example-queries.md) — Guided analysis walkthroughs
- [FAQ](faq.md) — Frequently asked questions
- [Methods — Data Sources](../methods/data-sources.md) — Integrated database provenance
