# YAML Content Configuration

The BioRemPP Database Explorer uses YAML files as the authoritative source for declarative content: guided analysis use cases, FAQ entries, contact information, home page editorial copy, and database schema documentation. YAML files are **compiled to JSON** before build or runtime.

---

## Overview

Content YAML files live in two locations:

| Location | Content type |
|----------|-------------|
| `src/features/guided-analysis/config/` | Guided analysis catalog and query definitions |
| `src/content/editorial/` | Home page, FAQ, contact, database schemas, downloads, user guide |

---

## Compile Pipeline

YAML configuration is compiled using dedicated Node.js scripts before the application starts or builds:

```bash
npm run compile:configs
```

This runs the following sub-compilers in sequence:

| Command | Script | Output |
|---------|--------|--------|
| `compile:app-metadata` | `scripts/compile-app-metadata.mjs` | Application release metadata |
| `compile:guided` | `scripts/compile-guided-config.mjs` | `server/generated/guided/catalog.json` |
| `compile:user-guide` | `scripts/compile-user-guide-config.mjs` | User guide compiled config |
| `compile:faq` | `scripts/compile-faq-config.mjs` | FAQ compiled config |
| `compile:contact` | `scripts/compile-contact-config.mjs` | Contact page compiled config |

The `npm run build` command includes `compile:configs` automatically. In development, `npm run dev:full` calls `compile:configs` on startup.

!!! warning "Schema validation"
    Compile scripts validate YAML structure against their schemas. A malformed YAML file causes the compile step to fail with an error, which in turn fails the build. Always validate YAML changes with `npm run compile:configs` before committing.

---

## Guided Analysis Configuration

### Catalog

**Location:** `src/features/guided-analysis/config/catalog.yaml`

Defines category groupings and the display order of use cases:

```yaml
version: v1
title: Guided Analysis
categories:
  - id: compound_analysis
    label: Compound Analysis
  - id: pathway_analysis
    label: Pathway Analysis
  - id: gene_ko_analysis
    label: Gene / KO Analysis
query_order:
  - uc1_top_bioremediation_compounds
  - uc2_most_toxic_compounds
  - uc4_regulated_by_agency
  - uc5_pathways_functional_coverage
  - uc6_pathways_toxic_compounds
  - uc7_genes_most_connected
  - uc8_genes_linked_toxic_compounds
  - uc3_risk_vs_bioremediation_potential
```

The `query_order` array controls the display sequence on the Guided Analysis page. Modify this array to reorder use cases. Adding a new query ID here without a corresponding query definition file causes a compile-time error.

### Query definitions

**Location:** `src/features/guided-analysis/config/queries/{id}.yaml`

Each use case has its own YAML file. The schema includes:

| Field | Purpose |
|-------|---------|
| `id` | Unique identifier matching the catalog entry |
| `category` | Category ID from `catalog.yaml` |
| `title` | Display title |
| `question` | One-line scientific question |
| `description` | Short description |
| `dataset` | SQLite table name used as input |
| `executor` | Execution strategy identifier |
| `use_case_description` | Scientific question, description, visual elements, interpretation guidelines, limitations |
| `methods_modal` | Methods modal content (button label, title, step-by-step methodology) |
| `defaults` | Default page size and sort field/order |
| `executor_config` | Executor-specific configuration (e.g., `metric_field`, `sort_field`) |
| `filters` | List of filter definitions (id, type, label, provider) |
| `summary_cards` | Summary metric cards shown above visualizations |
| `visualizations` | Visualization definitions (id, type, title, data key) |
| `table` | Table definition (columns, row click field, empty message) |

#### Filter types

| Type | Description |
|------|-------------|
| `search` | Free-text search input |
| `select` | Single-choice dropdown |
| `dependent_select` | Dropdown dependent on another filter's value |
| `number_range` | Min/max numeric range input |
| `toggle` | Boolean on/off switch |

#### Filter providers

Select filters can be populated from a metadata API endpoint:

```yaml
provider:
  type: meta_endpoint
  endpoint: /api/meta/compound-classes
```

#### Visualization types

| Type | Description |
|------|-------------|
| `horizontal_bar` | Horizontal ranked bar chart |
| `scatter_quadrant` | 2D scatter with P75 quadrant thresholds |
| `heatmap_matrix` | Compound × endpoint toxicity heatmap |
| `boxplot` | Distribution boxplot |

### Recipes (SQL/Python)

**Location:** `src/features/guided-analysis/recipes/yaml/{id}.yaml`

Each use case also has a reproducibility recipe file defining the SQL or Python query that produces the same result as the guided execution endpoint. These recipes are surfaced in the UI as "reproducible query" artifacts.

The `test:guided:compliance` script validates that recipe outputs match execution engine outputs:

```bash
npm run test:guided:compliance
```

---

## Editorial YAML

### Home page

**Location:** `src/content/editorial/pages/home.page.yaml`

Controls all text content on the home page: hero section (title, subtitle, description paragraphs, CTA buttons, modals), scientific overview, data sources panel, target users, browse section (explorer cards), guided analysis overview, downloads section, and database snapshot section.

Key structural rules:
- `hero.description` must contain exactly 3 paragraphs
- `hero.cta_buttons` must include `launch-analysis`, `how-to-cite`, and `terms-of-use` in that order

### FAQ

**Location:** `src/content/editorial/faq/faq.en.yaml`

Source for all FAQ questions and answers. Compiled and consumed by the FAQ page at `/faq`.

### Contact

**Location:** `src/content/editorial/pages/contact.page.yaml`

Team and contact information rendered on the `/contact` page.

### Database schemas

**Location:** `src/content/editorial/databases/`

| File | Schema documented |
|------|------------------|
| `biorempp_schema.yaml` | BioRemPP DB field definitions |
| `hadeg_schema.yaml` | HADEG field definitions |
| `kegg_schema.yaml` | KEGG Degradation field definitions |
| `toxcsm_schema.yaml` | ToxCSM field definitions |
| `index_config.yaml` | Database index page configuration |

These files power the `/databases` section of the application.

### Downloads catalog

**Location:** `src/content/editorial/downloads/downloads.zenodo.yaml`

Defines the publicly available database download artifacts shown on the home page. Each entry specifies:

```yaml
- id: sqlite
  label: BioRemPP Runtime Database (SQLite Lean)
  format: SQLITE
  url: https://zenodo.org/records/...
  version: v1.1.0
  size: 15.77 MiB
  updated_at: 2026-04-09
  source: Zenodo
```

Update this file when a new Zenodo release is published. The `id` field is used as a stable dialog and selection key — do not change existing IDs.

---

## Application Release Metadata

**Location:** `src/app/config/app-metadata.json`

Centralized release version consumed by the React shell header, footer, browser title, and MkDocs release snippet. Updated independently from dataset/package releases to avoid conflating UI rollout state with database artifact versions.

Compile the metadata before any build or dev start:

```bash
npm run compile:app-metadata
```

---

## Adding a New Guided Analysis Use Case

1. Create `src/features/guided-analysis/config/queries/{new_id}.yaml` following the schema above
2. Add `{new_id}` to `query_order` in `catalog.yaml`
3. Create `src/features/guided-analysis/recipes/yaml/{new_id}.yaml` with the reproducibility recipe
4. Run `npm run compile:configs` to validate and compile
5. Run `npm run test:guided:compliance` to verify recipe output matches execution engine

---

## Related Pages

- [Environment Variables](environment-variables.md) — runtime variables
- [Frontend Build Configuration](frontend-build-configuration.md) — Vite build and asset pipeline
- [API Endpoint Configuration](api-endpoint-configuration.md) — guided execution endpoint and API routing
