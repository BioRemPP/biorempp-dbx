# Search and Filtering

This page describes how search, filtering, and pagination work across the BioRemPP Database Explorer.

---

## Overview

Each explorer interface in the Database Explorer provides:

- A **search bar** for text-based entity lookup
- A **filter panel** for structured multi-field filtering
- A **paginated results table** with configurable page size
- A **reset control** to clear all active filters

Search and filter operations are applied in real time against the current explorer's entity set.

---

## Search Bar

The search bar performs full-text matching against the primary identifier and name fields of the active explorer.

### Supported search fields by explorer

| Explorer | Searchable fields |
|----------|------------------|
| **Compounds** | Compound name, KEGG CPD identifier, CAS number |
| **Genes and KOs** | Gene symbol, KO identifier, enzyme activity description |
| **Pathways** | Pathway name, pathway identifier |
| **Toxicity** | Compound name, KEGG CPD identifier |
| **Compound Classes** | Class name |

### Search behavior

- Matching is case-insensitive
- Partial matches are returned (substring search)
- Results update as you type
- Searching resets pagination to page 1
- The search term persists until cleared or the explorer is changed

### Clearing search

Click the **×** icon inside the search bar, or delete the text manually, to clear the active search term and return to the full result set.

---

## Filter Panel

The filter panel provides structured criteria for narrowing results within the active explorer. Available filter types depend on the explorer and the data properties of the entity type.

### Filter types

| Type | Description | Example |
|------|-------------|---------|
| **Dropdown (single)** | Select one value from a controlled vocabulary | Compound class: `Aromatic Hydrocarbon` |
| **Dropdown (multi-select)** | Select one or more values simultaneously | Regulatory agency: `IARC`, `EPA` |
| **Numeric range** | Define minimum and/or maximum threshold | Toxicity score: `≥ 0.7` |
| **Boolean toggle** | Include only entities with/without a property | `Has toxicity data: Yes` |

### Available filters by explorer

**Compounds Explorer:**

- Compound class
- Regulatory framework (one or more agencies)
- Has toxicity data
- Has pathway associations
- Has gene associations

**Genes and KEGG Orthologs Explorer:**

- Pathway membership
- Source database (KEGG / HADEG)
- Has compound associations

**Pathways Explorer:**

- Source database (KEGG / HADEG)
- Has toxicity-linked compounds

**Toxicity Explorer:**

- Endpoint group (aquatic, regulatory, organ, environmental)
- Predicted classification (active / inactive)

**Compound Classes Explorer:**

- Has regulatory annotations
- Has toxicity data

---

## Combining Search and Filters

Search and filters can be applied simultaneously. The results table reflects the intersection of all active criteria:

- Active search term narrows by text match
- Active filters narrow by structured properties
- Both constraints are applied together

**Example:** Searching for `benzene` while filtering by `Compound Class = Aromatic Hydrocarbon` returns only compounds matching both criteria.

---

## Pagination

Results are displayed in paginated tables. Controls are located at the bottom of each table.

| Control | Function |
|---------|----------|
| **Page selector** | Jump to a specific page number |
| **Previous / Next** | Navigate one page at a time |
| **Rows per page** | Set 10, 25, 50, or 100 rows per page |
| **Result count** | Displays total matching entities |

Changing filters or search terms resets the view to page 1.

---

## Resetting Filters

To reset all active filters:

- Click the **Clear Filters** button in the filter panel
- All filter criteria are removed and the full entity set is restored
- The active search term is preserved unless also cleared

To reset both search and filters simultaneously, clear the search bar and click **Clear Filters**.

---

## Downloading Filtered Results

After applying search terms and filters, the active result set can be downloaded:

1. Click the **Download** button above or below the results table
2. Select the desired format: CSV, Excel (.xlsx), or JSON
3. The exported file reflects the current filtered view, not the full database

For visualization exports, use the camera icon on chart components.

---

## Related Pages

- [Quickstart](quickstart.md) — Guided walkthrough using search and filters
- [Example Queries](example-queries.md) — Step-by-step query recipes
- [User Guide — Explorer Pages](../user-guide/explorer-pages.md) — Explorer interface structure
- [User Guide — Downloads](../user-guide/downloads.md) — Download options and formats
