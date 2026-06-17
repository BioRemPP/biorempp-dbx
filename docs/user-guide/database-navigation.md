# Database Navigation

This page describes the application layout, navigation bar, primary routes, and how to move between pages in the BioRemPP Database Explorer.

---

## Application Layout

The BioRemPP Database Explorer is a single-page web application. It is composed of:

- A **persistent top navigation bar** with links to the main sections
- A **home page** with database overview cards and links to each explorer
- **Explorer pages** for each entity type (Compounds, Genes/KOs, Pathways, Toxicity, Compound Classes)
- **Entity detail pages** that open when a row is clicked in an explorer
- A **Guided Analysis** section with eight pre-configured query use cases
- A **Databases** section with integrated database schema documentation
- A **footer** with the release version label and contact information

---

## Primary Navigation Bar

The top navigation bar is persistent across all pages and provides access to the main sections:

| Nav item | Route | Purpose |
|----------|-------|---------|
| **User Guide** | `/user-guide` | In-application user documentation |
| **Guided Analysis** | `/guided-analysis` | Eight pre-configured query use cases (UC1–UC8) |
| **Databases** | `/databases` | Integrated database schema documentation |
| **FAQ** | `/faq` | Frequently asked questions |
| **Documentation** | `/documentation` | External documentation links |
| **Contact** | `/contact` | Contact information and support |

!!! note "Explorer access"
    The five explorer interfaces (Compounds, Genes, Pathways, Toxicity, Compound Classes) are accessible from cards on the **home page**, not directly from the navigation bar.

---

## Home Page

The home page (`/`) serves as the entry point to the database. It displays:

- **Database overview cards** — a snapshot of each integrated database (BioRemPP, KEGG, HADEG, ToxCSM) showing entity counts and schema summary links
- **Explorer entry points** — cards linking to each of the five explorer interfaces
- **Releases section** — links to versioned database download artifacts on Zenodo

From the home page, clicking an explorer card navigates to that explorer's table view.

---

## Explorer Routes

Each explorer is accessible at a dedicated route:

| Explorer | Route |
|----------|-------|
| Compounds | `/compounds` |
| Genes and KOs | `/genes` |
| Pathways | `/pathways` |
| Toxicity | `/toxicity` |
| Compound Classes | `/compound-classes` |

---

## Entity Detail Routes

Clicking a row in an explorer (where row navigation is enabled) opens an entity detail page:

| Entity | Route pattern | Example |
|--------|--------------|---------|
| Compound detail | `/compounds/{cpd}` | `/compounds/C00001` |
| Gene / KO detail | `/genes/{ko}` | `/genes/K00001` |
| Pathway detail | `/pathways/detail/{source}/{pathway}` | `/pathways/detail/KEGG/map00362` |
| Compound class detail | `/compound-classes/detail/{compoundclass}` | `/compound-classes/detail/Aromatic` |

!!! info "Toxicity Explorer"
    The Toxicity Explorer does not navigate to a detail page on row click. Toxicity data for a specific compound is accessible through the compound's detail page.

Detail pages include a **back button** (← or arrow link) in the page header to return to the corresponding explorer.

---

## Database Schema Routes

The Databases section provides schema documentation for each integrated database:

| Schema | Route |
|--------|-------|
| BioRemPP DB | `/databases/biorempp` |
| HADEG | `/databases/hadeg` |
| KEGG Degradation | `/databases/kegg` |
| ToxCSM | `/databases/toxcsm` |

---

## Guided Analysis Route

All guided analysis use cases are accessible at `/guided-analysis`. The catalog page lists all eight use cases (UC1–UC8). Selecting a use case opens its query interface inline.

---

## Legacy Redirects

The following legacy routes are automatically redirected:

| Legacy route | Redirects to |
|-------------|-------------|
| `/visualizations` | `/guided-analysis` |
| `/database-metrics` | `/databases` |

---

## Navigation Patterns

### From explorer to detail

1. Open an explorer (e.g., `/compounds`)
2. Apply search or filters to narrow results
3. Click any row to open the entity detail page
4. Use the back button in the detail page header to return to the explorer

### From detail to related entity

Entity detail pages include cross-links to related entities. For example:

- A **compound detail page** lists linked genes; clicking a gene symbol opens that gene's detail page
- A **gene detail page** lists linked compounds; clicking a compound opens that compound's detail page

### Home page shortcut

The BioRemPP logo in the navigation bar links back to the home page (`/`) from any route.

---

## Related Pages

- [Explorer Pages](explorer-pages.md) — search, filter, and table structure for each explorer
- [Entity Detail Pages](entity-detail-pages.md) — compound, gene, pathway, and compound class detail views
- [Getting Started — Quickstart](../getting-started/quickstart.md) — step-by-step navigation walkthrough
