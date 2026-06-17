# Heatmaps

Heatmaps are the main matrix-style visualization family in the current BioRemPP Database Explorer. They are used to compare toxicity signals across endpoint groups while preserving a compact overview of multiple compounds or pathway-linked scopes.

## Where it appears

- Compound detail overview:
  grouped endpoint heatmap with separate `Prediction` and `Risk` rows
- Gene detail overview:
  compound-by-endpoint toxicity matrix
- Pathway detail:
  compound-by-endpoint toxicity matrix for compounds linked to the pathway
- Compound-class detail:
  compound-by-endpoint toxicity matrix for class members
- Guided Analysis UC2:
  compound-oriented toxicity heatmap
- Guided Analysis UC6:
  pathway-oriented toxicity heatmap

## Data represented

Current heatmaps represent predictive or database-derived toxicity values, grouped into stable endpoint domains such as:

- `ecotoxicity`
- `genotoxicity_carcinogenicity`
- `nuclear_receptors`
- `stress_response`
- `organ_irritation`
- `other`

The grouping logic is shared by the frontend and is defined in `src/features/toxicity/utils/endpointGroups.ts`.

## Axes and encodings

The exact axes depend on the surface:

- Compound detail overview:
  columns are endpoints grouped by domain; rows are `Prediction` and `Risk`
- Gene detail, pathway detail, and compound-class detail:
  rows are compounds; columns are endpoints
- Guided UC2:
  rows are top-ranked compounds; columns are endpoints in the selected context
- Guided UC6:
  rows are pathways; columns are grouped endpoints

Color encodings also vary slightly by heatmap type:

- matrix heatmaps use a continuous low-to-high prediction gradient
- compound detail overview also includes a separate categorical risk row
- grouped headers use fixed pastel domain colors to keep endpoint families visually separated

## How to read the chart

1. Start with the grouped header row to identify the endpoint domain.
2. Read along one row to compare a compound or pathway across multiple endpoints.
3. Read down one column to compare multiple compounds or pathways for the same endpoint.
4. Use the tooltip text to inspect the exact endpoint label and numeric value.
5. For compound detail overview, compare the `Prediction` row with the `Risk` row to distinguish raw score from derived bucket.

In pathway and compound-class details, rows are sorted by mean toxicity descending by default. In gene detail, the provided backend order is preserved instead.

## What patterns may suggest

- broad warm-color coverage across several endpoint groups may suggest broader predicted toxicological concern
- isolated high-intensity cells may point to endpoint-specific alerts rather than generalized toxicity
- in UC6, pathways with repeated higher-intensity cells can mark pathway contexts linked to compounds above the current predictive threshold
- in gene or compound-class detail views, the matrix can help identify which linked compounds deserve follow-up in the compound or toxicity explorers

## What should not be inferred

- Heatmap intensity does not prove experimental toxicity.
- A hot row does not mean the pathway or gene itself causes toxicity.
- A blank or gray cell does not prove absence of effect; it may reflect missing database coverage or a null prediction.
- Endpoint grouping is a navigation aid, not a mechanistic ontology.
- Cross-page heatmap comparisons are not automatically equivalent because the row population and filtering context can differ.

## Example interpretation

If a pathway detail heatmap shows several compounds with elevated values across `Stress Response (SR)` endpoints but only sparse values in other groups, a cautious interpretation is:

> This pathway context is associated with compounds that concentrate stronger predicted SR-related signals in the current database scope, which may justify compound-level follow-up.

An overclaim would be:

> This pathway triggers stress-response toxicity.

## Limitations

- Heatmaps compress multiple compounds, endpoints, and sometimes pathways into one matrix and therefore hide mechanistic detail.
- Current toxicity heatmaps rely on ToxCSM-derived endpoint values when such values exist.
- The application also contains a generic `CategoricalHeatmap` shared component, but the dominant user-facing heatmaps in the current release are toxicity-oriented matrices.

## Related Pages

- [Visualizations Overview](index.md)
- [Legends and Tooltips](legends-tooltips.md)
- [Interpretation Boundaries](interpretation-boundaries.md)
- [Toxicity Explorer](../explorers/toxicity.md)
