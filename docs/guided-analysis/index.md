# Guided Analysis

This section documents the catalog-driven guided queries exposed by the BioRemPP Database Explorer at `/guided-analysis`. Unlike the older Web Service workflow, these analyses operate directly on the curated integrated database and do not require user-uploaded datasets.

--8<-- "includes/app-release.md"

## Purpose

Guided Analysis is the highest-level exploratory workspace in the current application. It packages recurring scientific questions into reusable query definitions so users can:

- rank compounds, pathways, or genes within a curated database scope
- compare annotation breadth against predictive toxicity indicators
- inspect regulatory-reference coverage without leaving the main interface
- move from ranked summaries into compound, pathway, or gene detail pages

The current implementation is centered on `src/features/guided-analysis/pages/GuidedAnalysisPage.tsx` on the frontend and `server/guided/engine.mjs` on the backend.

!!! warning "Interpretation Boundary"
    Guided Analysis summarizes database-derived relationships inside the current BioRemPP release snapshot. It supports exploratory analysis, prioritization, and hypothesis generation. It does not provide experimental validation, remediation guarantees, or legal/regulatory determinations.

## Current Architecture

The guided layer is declarative and server-executed.

- Catalog source: `src/features/guided-analysis/config/catalog.yaml`
- Query definitions: `src/features/guided-analysis/config/queries/*.yaml`
- Shared validation schema: `server/guided/catalog-schema.mjs`
- Compile step: `scripts/compile-guided-config.mjs`
- Generated runtime artifact: `server/generated/guided/catalog.json`
- Runtime loader: `server/guided/catalog-loader.mjs`
- Execution engine: `server/guided/engine.mjs`

The frontend consumes three dedicated endpoints:

- `GET /api/guided/catalog`
- `GET /api/guided/queries/:id/options`
- `POST /api/guided/queries/:id/execute`

All current bundled use cases declare the `compound_summary` dataset and then join additional tables such as `toxicity_endpoint`, `compound_reference_map`, `compound_ko_pathway_rel`, `compound_gene_map`, and `compound_gene_card` inside executor-specific logic.

## Workspace Structure

The current page combines five stable UI regions:

- Query selector sidebar:
  grouped into `Compound Analysis`, `Pathway Analysis`, and `Gene / KO Analysis`
- Header card:
  shows the selected query title, summary cards, and execution metadata such as dataset, execution time, and threshold basis when relevant
- Use-case accordion:
  `View Use Case Description` expands scientific question, description, visual elements, interpretation guidance, and limitations
- Action dialogs:
  `View Methods` opens a declarative methods modal and `View Queries` opens static recipe bundles when available
- Result workspace:
  renders guided visualizations plus a paginated table with query-specific drill-down behavior

## Current Use Cases

The order below follows `query_order` in `src/features/guided-analysis/config/catalog.yaml`.

| Use case | Current UI label | Query id | Returned entity | Main visualization(s) |
| --- | --- | --- | --- | --- |
| UC1 | Top Bioremediation Compounds | `uc1_top_bioremediation_compounds` | Compounds | Horizontal bar ranking |
| UC2 | Most Toxic Compounds | `uc2_most_toxic_compounds` | Compounds | Toxicity heatmap matrix |
| UC4 | Regulated Compounds by Agency | `uc4_regulated_by_agency` | Compounds | Agency bar ranking |
| UC5 | Pathways with Highest Functional Coverage | `uc5_pathways_functional_coverage` | Pathways | Horizontal bar ranking |
| UC6 | Pathways Associated with Toxic Compounds | `uc6_pathways_toxic_compounds` | Pathways | Horizontal bar ranking and heatmap matrix |
| UC7 | Most Connected Genes | `uc7_genes_most_connected` | Genes / KOs | Horizontal bar ranking |
| UC8 | Genes Linked to Toxic Compounds | `uc8_genes_linked_toxic_compounds` | Genes / KOs | Boxplot and horizontal bar ranking |
| UC3 | Risk vs Bioremediation Potential | `uc3_risk_vs_bioremediation_potential` | Compounds in the top-right quadrant | Scatter quadrant plot |

## Interaction Model

- The first available query in the catalog is selected by default.
- Switching queries restores the defaults declared in the selected query YAML.
- Filter changes trigger a new server-side execution for the active query scope.
- When the scope changes, pagination returns to page `1`.
- During incremental refreshes, the previous result set remains visible and the UI shows `Refreshing results...`.
- If dependent option loading fails, the page shows a warning and keeps the current filters available.
- Current bundled use cases all default to `10` rows per page.

## Drill-Down Semantics

Row clicks do not all behave the same way.

- UC1, UC2, UC3, and UC4 open compound detail routes
- UC5 and UC6 open pathway detail routes and preserve source context when it is specific enough to route
- UC7 opens gene detail by KO
- UC8 also targets gene detail and can resolve a KO from the gene symbol when the table row does not already expose one

## Related Pages

- [Query Recipes](query-recipes.md)
- [Filters and Parameters](filters-and-parameters.md)
- [Output Interpretation](output-interpretation.md)
- [Visualizations Overview](../visualizations/index.md)
- [Compounds Explorer](../explorers/compounds.md)
- [Genes and KEGG Orthologs Explorer](../explorers/genes-kos.md)
- [Pathways Explorer](../explorers/pathways.md)
