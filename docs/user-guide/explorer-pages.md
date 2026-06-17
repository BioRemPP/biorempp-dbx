# Explorer Pages

This page documents the structure, columns, search behavior, and filter options of each of the five explorer interfaces in the BioRemPP Database Explorer.

---

## Common Structure

All five explorer pages share the same layout:

1. **Page header** — explorer title and description
2. **Toolbar** — search bar and action controls
3. **Filter panel** — structured filter fields
4. **Results table** — paginated, sortable table of entities
5. **Pagination footer** — page navigation and result count display

### Search bar

Each explorer has a search bar that performs **case-insensitive substring matching** against the primary identifier and name fields. Results update as you type. Searching resets pagination to page 1.

### Filter panel

Filters are structured form controls (dropdowns, range inputs) that narrow the result set by specific properties. Multiple filters can be active simultaneously. All active filters combine as AND conditions.

### Pagination

Default page size is **50 rows**. Navigation controls at the bottom of the table allow moving between pages. The result summary bar displays total matching entity count.

### Row click behavior

Clicking a row navigates to the entity's detail page — except in the **Toxicity Explorer**, which does not have row-level navigation.

---

## Compounds Explorer (`/compounds`)

### Table columns

| Column | Description |
|--------|-------------|
| **Compound ID** | KEGG CPD identifier (clickable — opens compound detail page) |
| **Name** | IUPAC or common compound name |
| **Class** | Compound class (structural/chemical category) |
| **KO Count** | Number of KEGG Ortholog entries linked to this compound |
| **Gene Count** | Number of distinct gene symbols associated |
| **Pathway Annotations** | Aggregated count of pathway associations (HADEG, KEGG, compound pathways) |
| **Toxicity Risk Mean** | Mean predicted risk score across active ToxCSM endpoints |
| **High Risk Endpoints** | Count of ToxCSM endpoints classified as high risk |
| **References** | Number of regulatory agency references (`reference_count`) |

### Search fields

Free-text search matches against compound name and KEGG CPD identifier.

### Filters

| Filter | Type | Description |
|--------|------|-------------|
| **Compound Class** | Dropdown | Filter by structural/chemical class |
| **Pathway Source** | Dropdown | Filter by pathway source (KEGG or HADEG) |
| **Pathway** | Dependent dropdown | Filter by specific pathway (depends on Pathway Source selection) |
| **Gene** | Dropdown | Filter by associated gene symbol or identifier |
| **Reference AG** | Dropdown | Filter by regulatory agency reference |
| **KO Count (min/max)** | Numeric range | Minimum and/or maximum KO association count |
| **Gene Count (min/max)** | Numeric range | Minimum and/or maximum gene count |

---

## Genes and KOs Explorer (`/genes`)

### Table columns

| Column | Description |
|--------|-------------|
| **KO** | KEGG Ortholog identifier (clickable — opens gene detail page) |
| **Gene Symbol** | KEGG gene symbol annotation |
| **Gene Name** | Full gene name or functional description |
| **Compound Count** | Number of distinct compounds linked to this KO |
| **Pathway Count** | Number of distinct pathways this KO participates in |
| **Enzyme Activities** | Enzyme activity descriptions (truncated to 2 entries; "+X more" shown when additional entries exist) |

### Search fields

Free-text search matches against gene symbol, gene name, and KO identifier.

### Filters

| Filter | Type | Description |
|--------|------|-------------|
| **Compound Count (min/max)** | Numeric range | Minimum and/or maximum linked compound count |

---

## Pathways Explorer (`/pathways`)

### Table columns

| Column | Description |
|--------|-------------|
| **Pathway** | Pathway name and identifier (clickable — opens pathway detail page) |
| **Source** | Source database displayed as a badge: KEGG or HADEG |
| **Compound Count** | Number of compounds associated with this pathway |
| **Gene Count** | Number of distinct genes annotated in this pathway |

### Search fields

Free-text search matches against pathway name and identifier.

### Filters

| Filter | Type | Description |
|--------|------|-------------|
| **Source** | Toggle | Show KEGG pathways (default) or HADEG pathways |

!!! note "One source at a time"
    The Pathways Explorer displays one source at a time. Toggle between KEGG (default) and HADEG using the Source filter. Both sources are available individually through detail pages and guided analysis.

---

## Toxicity Explorer (`/toxicity`)

### Table columns

| Column | Description |
|--------|-------------|
| **Compound ID** | KEGG CPD identifier |
| **Compound Name** | Compound name |
| **Compound Class** | Compound class |
| **Endpoint** | ToxCSM toxicity endpoint identifier |
| **Endpoint Label** | Human-readable endpoint label |
| **Value** | Predicted toxicity value (numeric, 0–1 scale) |

### Search fields

Free-text search matches against compound name and KEGG CPD identifier.

### Filters

| Filter | Type | Description |
|--------|------|-------------|
| **Endpoint** | Dropdown | Select a toxicity endpoint (auto-selects first on load) |
| **Label** | Dependent dropdown | Select endpoint label (depends on Endpoint selection; incompatible labels clear automatically) |
| **Compound Class** | Dropdown | Filter by compound class |
| **Value (min/max)** | Numeric range | Minimum and/or maximum toxicity value (0–1, step 0.0001) |

!!! note "No row navigation"
    Clicking a row in the Toxicity Explorer does not navigate to a detail page. To view a compound's full toxicity profile, open the compound's detail page via the Compounds Explorer.

!!! note "Endpoint dependency"
    The Label filter is dependent on the selected Endpoint. Changing the Endpoint clears any incompatible Label selection automatically.

---

## Compound Classes Explorer (`/compound-classes`)

### Table columns

| Column | Description |
|--------|-------------|
| **Compound Class** | Class name (clickable — opens compound class detail page) |
| **Compound Count** | Number of compounds in this class |
| **KO Count** | Number of distinct KO entries linked to compounds in this class |
| **Gene Count** | Number of distinct gene symbols in this class |
| **Pathway Annotations** | Aggregated pathway association count across compounds in this class |

### Search fields

Free-text search matches against compound class name.

### Filters

No additional filter controls beyond search. All compounds in the database are partitioned into compound classes by structural/chemical category.

---

## Shared API Pattern

All explorer tables use a paginated GET API with consistent parameters:

```
GET /api/{feature}?search=&...filters...&page=1&pageSize=50
```

Response payloads follow a shared pagination contract with `data`, `total`, `page`, and `pageSize` fields. See [API Reference — Pagination Contract](../api-reference/pagination-contract.md) for full specification.

---

## Related Pages

- [Entity Detail Pages](entity-detail-pages.md) — what opens when you click a row
- [Database Navigation](database-navigation.md) — routes and navigation patterns
- [Getting Started — Search and Filtering](../getting-started/search-and-filtering.md) — search and filter reference
- [Explorers section](../explorers/index.md) — per-explorer scientific documentation
