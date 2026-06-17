# Frequently Asked Questions

Common questions about the BioRemPP Database Explorer, its entities, results, and operations.

---

## General

### What is the BioRemPP Database Explorer?

The BioRemPP Database Explorer is a curated, integrated, compound-centric database resource for exploratory analysis of bioremediation potential and environmental risk. It provides open-access, browser-based navigation of four integrated databases (BioRemPP DB, KEGG, HADEG, ToxCSM) with regulatory annotations from seven frameworks.

### Do I need an account to use it?

No. The Database Explorer is fully open access. No registration, login, or data submission is required.

### Is the Database Explorer free?

Yes. The resource is free for scientific and educational use.

Commercial use of the underlying data requires compliance with the respective source licenses. See [License](../about/license.md) and [Terms of Use](../about/terms-of-use.md).

### What is the difference between the Database Explorer and the BioRemPP Web Service?

| Feature | Database Explorer | Web Service |
|---------|------------------|-------------|
| **Input** | No file upload | KO annotation file upload |
| **Purpose** | Browse integrated database | Process user-uploaded KO profiles |
| **Access model** | Read-only database navigation | Session-based analysis pipeline |
| **Output** | Explorer tables, detail pages, guided queries | Analytical results across 56 use cases |

Both tools share the same BioRemPP Integrated Database as their evidence source.

---

## Database Coverage

### What compounds are included?

All environmental compounds with at least one curated association in the BioRemPP integrated database. Compounds are linked to enzyme annotations (BioRemPP DB), degradation genes and pathways (KEGG, HADEG), toxicity predictions (ToxCSM), and regulatory classifications (up to seven frameworks).

### What databases are integrated?

| Database | Focus |
|----------|-------|
| **BioRemPP DB** | Curated enzyme–compound associations |
| **KEGG Degradation** | Gene–pathway–compound relationships |
| **HADEG** | Hydrocarbon and aerobic degradation genes |
| **ToxCSM** | Predicted toxicity profiles |

### What regulatory frameworks are covered?

IARC, EPA, ATSDR, WFD, PSL, EPC, and CONAMA. See [Scientific Scope — Regulatory Frameworks](../about/scientific-scope.md#regulatory-frameworks) for details.

### How current is the data?

The current release (v1.0.0) uses KEGG Release December 2025 and stable versions of HADEG and ToxCSM. See [Data and Software Availability](../about/data-software-availability.md) for version references.

---

## Explorers and Navigation

### What are the Explorer interfaces?

The Database Explorer provides five dedicated explorer pages:

- **Compounds Explorer** — browse all compounds with search, filtering, and detail pages
- **Genes and KEGG Orthologs Explorer** — browse KO entries with pathway and compound links
- **Pathways Explorer** — browse degradation pathway catalog
- **Toxicity Explorer** — browse ToxCSM toxicity profiles per compound
- **Compound Classes Explorer** — browse compound groups by structural class

### How do I find a specific compound?

Use the **search bar** in the Compounds Explorer to search by compound name, KEGG CPD identifier, or CAS number. See [Search and Filtering](search-and-filtering.md) for full search behavior documentation.

### What information is on a compound detail page?

A compound detail page displays all integrated evidence for that compound:

- Chemical identifiers (KEGG CPD, CAS, IUPAC name, compound class)
- Linked genes and KOs with enzyme activity annotations
- Linked pathways with source database context
- ToxCSM toxicity predictions by endpoint group
- Regulatory classification status across applicable frameworks

---

## Results and Interpretation

### What do the explorer results represent?

Explorer results represent curated, database-derived associations. They support exploratory analysis and hypothesis generation in environmental bioinformatics.

### Do high gene/pathway association counts confirm biodegradation?

No. High association counts reflect **database coverage** — the number of curated records linking a compound to genes or pathways. They do not confirm that:

- Biodegradation actually occurs
- Genes are expressed in a relevant environmental context
- Enzyme activity has been measured

### Are toxicity values experimental measurements?

No. Toxicity values in the Database Explorer are **ToxCSM predictions** — machine learning–based estimates derived from compound structure. They are database-derived indicators, not experimentally validated toxicity measurements.

### Are regulatory annotations legal compliance determinations?

No. Regulatory annotations indicate that a compound appears in the classified or priority substance lists of the respective agency. They support compound prioritization for research purposes. They do not constitute legal compliance assessments.

!!! warning "Interpretation boundary"
    All database-derived associations require downstream experimental or field validation before applied or regulatory use.

---

## Downloads

### What can I export?

- Filtered explorer table results (CSV, Excel, JSON)
- Guided analysis query results (CSV, Excel, JSON)
- Visualization charts (PNG, SVG via camera icon on chart components)

### Does the export include all database records or just the filtered view?

Exported files reflect the **current filtered result set**, not the full database. Apply filters and search terms before downloading to obtain the desired subset.

### Can I download the complete database?

Yes. The full BioRemPP Integrated Database is available for download on Zenodo:

**Database DOI:** [https://doi.org/10.5281/zenodo.18905195](https://doi.org/10.5281/zenodo.18905195)

---

## Citation and Licensing

### How do I cite the BioRemPP Database Explorer?

Use the citation templates on the [How to Cite](../about/how-to-cite.md) page.

### Can I use the database commercially?

The BioRemPP Database is distributed under CC BY 4.0, which permits commercial use with proper attribution. Third-party integrated resources (KEGG, HADEG, ToxCSM) retain their own licensing terms. See [License](../about/license.md).

---

## Technical and Troubleshooting

### The explorer table is not loading. What should I try?

1. Refresh the page (Ctrl+R or Cmd+R)
2. Clear browser cache and reload
3. Try a different supported browser (Chrome, Firefox, Edge)
4. Check that JavaScript is enabled in your browser settings

### Search is returning no results. Is something wrong?

Empty search results are expected when no entities in the database match the search term. Try:

- A shorter or more general search term
- Checking for typos in identifiers (KEGG CPD format: `C#####`)
- Clearing active filters that may be restricting results further

### What browsers are supported?

Chrome 90+, Firefox 88+, Edge 90+, and Safari 14+. See [Database Access](database-access.md) for full compatibility details.

---

## Help and Support

- [Quickstart](quickstart.md) — First exploration walkthrough
- [Search and Filtering](search-and-filtering.md) — Search and filter reference
- [User Guide — Troubleshooting](../user-guide/troubleshooting.md) — Technical issue resolution
- [Contact](../about/contact.md) — Support and collaboration inquiries
