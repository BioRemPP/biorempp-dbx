# Explorers

This section documents the explorer views implemented by the BioRemPP Database Explorer frontend. These views are route-level workspaces resolved by the application shell and used to browse the curated integrated database without submitting external datasets.

--8<-- "includes/app-release.md"

## Purpose

The explorer layer is the main database-facing interface of the application. It is designed for:

- compound-centric browsing of the integrated resource
- KO- and gene-level inspection of linked evidence
- pathway-level comparison across curated source catalogs
- toxicity-oriented prioritization of compound records
- class-level aggregation of related compounds before drilling down into detail views

Explorer routes are implemented in `src/App.tsx` and `src/app/routes.ts`. The current primary header navigation emphasizes user guidance and documentation, but the explorers remain first-class application views addressable by direct routes such as `/compounds`, `/genes`, `/pathways`, `/toxicity`, and `/compound-classes`.

!!! warning "Interpretation Boundary"
    Explorer outputs summarize curated and database-derived relationships. They support exploratory analysis and prioritization, not experimental validation, remediation claims, or regulatory compliance decisions.

## Explorer Map

| Explorer | Route | Primary unit | Detail view | Current emphasis |
| --- | --- | --- | --- | --- |
| Compounds | `/compounds` | One compound record | Yes, `/compounds/{cpd}` | Compound-centric integration of genes, pathways, references, and toxicity |
| Genes and KOs | `/genes` | One KO-centric gene summary | Yes, `/genes/{ko}` | KO-level links to compounds, pathways, and toxicity coverage |
| Pathways | `/pathways` | One pathway row scoped to a source | Yes, `/pathways/detail/{source}/{pathway}` or all-sources route | Source-aware pathway browsing across KEGG and HADEG |
| Toxicity | `/toxicity` | One compound-endpoint prediction row | No dedicated routed detail page | Endpoint-focused screening of ToxCSM-derived rows |
| Compound Classes | `/compound-classes` | One compound class aggregate | Yes, `/compound-classes/detail/{compoundclass}` | Class-level rollups across compounds, genes, pathways, and toxicity coverage |

## Shared Interaction Model

- Explorer tables are server-paginated and currently request `50` rows per page.
- Free-text search is committed when the user runs the search action; typing alone does not immediately update the active server query.
- Filter changes reset pagination to the first page so the table remains consistent with the updated query scope.
- Metadata-backed filters are populated from shared `/api/meta/*` endpoints rather than hardcoded lists.
- Drill-down detail routes currently exist for compounds, genes, pathways, and compound classes. Toxicity remains a table-first explorer and is used mainly to prioritize follow-up inspection in the other explorers.

## Common Interpretation Boundaries

- Explorer counts represent the breadth of linked curated annotations inside the current release snapshot, not abundance, prevalence, kinetics, or environmental performance.
- Pathway, gene, and compound associations indicate integrated evidence and candidate relationships, not confirmed degradation activity.
- Toxicity values and labels should be interpreted as predictive or database-derived indicators when applicable.
- Missing annotations should not be interpreted as proof of biological absence. They may reflect source scope, harmonization rules, or incomplete upstream coverage.

## Explorer Pages

- [Compounds Explorer](compounds.md)
- [Genes and KEGG Orthologs Explorer](genes-kos.md)
- [Pathways Explorer](pathways.md)
- [Toxicity Explorer](toxicity.md)
- [Compound Classes Explorer](compound-classes.md)

## Related Pages

- [Getting Started](../getting-started/index.md)
- [User Guide](../user-guide/index.md)
- [Guided Analysis](../guided-analysis/index.md)
- [Database Schemas](../database-schema.md)
- [API Reference Overview](../api/index.md)
