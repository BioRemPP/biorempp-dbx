# Entity Detail Pages

This page documents the structure and content of entity detail pages for each entity type in the BioRemPP Database Explorer: Compounds, Genes/KOs, Pathways, and Compound Classes.

Detail pages are opened by clicking a row in the corresponding explorer table (where row navigation is enabled).

---

## Compound Detail Page (`/compounds/{cpd}`)

The compound detail page aggregates all integrated evidence for a single environmental compound.

### Summary panel

Loaded immediately on page entry. Displays high-level metrics for the compound:

| Field | Description |
|-------|-------------|
| **Compound ID** | KEGG CPD identifier |
| **Name** | IUPAC or common compound name |
| **Class** | Structural/chemical class |
| **KO Count** | Number of linked KEGG Ortholog entries |
| **Gene Count** | Number of distinct gene symbols associated |
| **Pathway Count** | Total pathway annotations across all sources |
| **Toxicity Risk Mean** | Mean predicted risk score across active ToxCSM endpoints |
| **High Risk Endpoint Count** | Count of endpoints with high-risk classification |
| **Reference Count** | Number of regulatory agency classifications |

### Tabs

The compound detail page has three tabs:

#### Overview tab

Lazy-loaded on first access. Contains:

- **KEGG structure thumbnail** — chemical structure image from KEGG (when available)
- **KO bar chart** — top 10 KOs by association count, broken down by source (HADEG / KEGG)
- **Top KEGG Pathways** — horizontal bar chart ranking KEGG pathway associations
- **Top HADEG Pathways** — horizontal bar chart ranking HADEG pathway associations
- **Pathway coverage matrix** — cross-source pathway coverage visualization
- **Toxicity heatmap** — compound-level toxicity score matrix by endpoint

#### Genes tab

Paginated table (25 rows per page) of all genes associated with the compound. Columns:

| Column | Description |
|--------|-------------|
| **KO** | KEGG Ortholog identifier |
| **Gene Symbol** | KEGG gene symbol |
| **Gene Name** | Full gene name |
| **Enzyme Activity** | Enzyme activity description |
| **EC Number** | Enzyme Commission number |
| **Reaction Descriptions** | Reaction descriptions (truncated) |
| **Supporting Rows** | Number of database records supporting this association |
| **Updated** | Timestamp of last record update |

Clicking a KO identifier in the Genes tab opens that gene's detail page.

#### Metadata tab

Lazy-loaded. Provides detailed provenance and cross-reference information:

- **Identifiers** — ChEBI ID, KO IDs, gene symbols, gene names, SMILES string
- **Functional annotation** — enzyme activities, EC numbers, pathways by source (HADEG / KEGG / compound pathway)
- **Chemical information** — compound name, class, SMILES, ChEBI reference
- **Data quality indicators** — format validation flags, completeness percentage, cross-reference coverage
- **Data sources** — badges showing which integrated databases contribute records and their roles
- **Provenance** — database version, last updated date, pipeline identifier
- **Cross-references** — KEGG compound ID, ChEBI, EC numbers, reaction count

---

## Gene / KO Detail Page (`/genes/{ko}`)

The gene detail page consolidates all evidence for a single KEGG Ortholog entry (KO).

### Summary panel

Loaded immediately. Displays:

| Field | Description |
|-------|-------------|
| **KO Identifier** | KEGG Ortholog code (e.g., K00001) |
| **Gene Symbol** | KEGG gene symbol annotation |
| **Gene Name** | Full gene name or functional description |
| **Compound Count** | Number of distinct compounds linked to this KO |
| **Pathway Count** | Number of pathways this KO participates in |
| **Enzyme Activities** | List of associated enzyme activity descriptions |
| **Compound Class Count** | Number of distinct compound classes in linked compounds |
| **Reference Agency Count** | Number of regulatory agencies classifying linked compounds |
| **Toxicity Coverage %** | Percentage of linked compounds with at least one toxicity prediction |

### Tabs

#### Overview tab

Lazy-loaded. Contains:

- **Toxicity heatmap** — compound × endpoint matrix for all compounds linked to this KO, showing predicted toxicity values per endpoint
- **Summary metrics** — linked compound count, active endpoint count, toxicity coverage percentage

#### Compounds tab

Paginated table (25 rows per page) of all compounds associated with this KO. Columns:

| Column | Description |
|--------|-------------|
| **CPD** | KEGG CPD identifier (clickable — opens compound detail page) |
| **Name** | Compound name |
| **Class** | Compound class |
| **Reference Agency** | Primary regulatory agency classification |
| **Reference Count** | Number of regulatory references |
| **KO Count** | Total KOs linked to this compound |
| **Gene Count** | Total gene symbols linked to this compound |
| **Pathway Count** | Total pathway annotations for this compound |
| **Toxicity Risk Mean** | Mean predicted toxicity risk score |
| **High Risk Endpoint Count** | Count of high-risk toxicity endpoints |
| **SMILES** | Simplified molecular-input line-entry system string |
| **Updated** | Timestamp of last record update |

Clicking a CPD identifier opens that compound's detail page.

#### Metadata tab

Lazy-loaded. Contains:

- **Identifiers** — gene symbol, gene name, KEGG KO ID, EC numbers, ChEBI IDs
- **Functional annotation** — pathway counts by source (HADEG / KEGG / compound pathway), EC numbers, enzyme activities, reaction IDs
- **Quantitative overview** — linked compound count, compound class count, pathway annotation count, regulatory agency count, toxicity coverage percentage
- **Data sources** — badges showing contributing integrated databases

---

## Pathway Detail Page (`/pathways/detail/{pathway}`)

The pathway detail page provides a visualization-focused summary of a xenobiotic degradation pathway. Unlike compound and gene detail pages, there are no tabs — the content is rendered as a single scrollable view.

### Summary panel

| Field | Description |
|-------|-------------|
| **Pathway Name** | Pathway identifier and name |
| **Source** | Contributing database (KEGG, HADEG, or ALL if not filtered) |
| **KO Count** | Number of KO entries in this pathway |
| **Gene Count** | Number of distinct gene symbols |
| **Compound Count** | Number of compounds associated |
| **Reaction EC Count** | Number of distinct EC class annotations |
| **Source Count** | Number of integrated databases contributing records |
| **KO Overlap %** | Percentage of KOs with multi-compound associations |

### Visualizations

All visualizations on the pathway detail page are rendered directly on the page:

| Visualization | Description |
|---------------|-------------|
| **KO distribution bar chart** | Number of compounds per KO entry in this pathway |
| **Gene distribution bar chart** | Number of compounds per gene symbol |
| **EC class distribution donut chart** | Proportion of compound support by EC class |
| **Toxicity heatmap matrix** | Compound × endpoint toxicity prediction matrix for compounds in this pathway |

### Source scoping

When navigating from the Pathways Explorer, the source (KEGG or HADEG) is passed as a URL parameter and scopes all visualizations to that source's records. Navigating to `/pathways/detail/{pathway}` without a source shows aggregated data across all contributing sources.

---

## Compound Class Detail Page (`/compound-classes/detail/{compoundclass}`)

The compound class detail page provides a population-level visualization of all compounds belonging to a structural/chemical class. Like pathway detail, it renders as a single scrollable view without tabs.

### Summary panel

| Field | Description |
|-------|-------------|
| **Class Name** | Compound class name |
| **Distinct KO Count** | Number of distinct KO entries across all compounds in the class |
| **Distinct Gene Count** | Number of distinct gene symbols |
| **Compound Count** | Total compounds in this class |
| **Distinct Pathway Count** | Number of distinct pathways represented |
| **Toxicity Coverage %** | Percentage of compounds with at least one toxicity prediction |

### Visualizations

| Visualization | Description |
|---------------|-------------|
| **KO distribution bar chart** | Number of compounds per KO entry across the class |
| **Gene distribution bar chart** | Number of compounds per gene symbol |
| **EC class distribution donut chart** | Proportion of compound support by EC class |
| **Toxicity heatmap matrix** | Compound × endpoint toxicity prediction matrix for compounds in this class |

---

## Navigation Between Detail Pages

Entity detail pages are cross-linked. For example:

- From a **compound detail page → Genes tab**: clicking a KO opens the gene detail page
- From a **gene detail page → Compounds tab**: clicking a CPD opens the compound detail page

All detail pages include a back button in the page header to return to the corresponding explorer table.

---

## Related Pages

- [Explorer Pages](explorer-pages.md) — table structure and filters for each explorer
- [Database Navigation](database-navigation.md) — routes and navigation patterns
- [Visualizations](../visualizations/index.md) — how to read chart types used in detail pages
- [Interpretation Guide](interpretation-guide.md) — scientific interpretation of detail page content
