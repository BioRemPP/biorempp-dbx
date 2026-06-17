# Pathways Explorer

## Purpose

The Pathways Explorer is the source-aware entry point for browsing degradation and pathway annotations linked to compounds and genes in the integrated database. It is designed to keep pathway inspection explicit about catalog provenance, especially the distinction between KEGG and HADEG pathway records.

This view is implemented by `src/features/pathways/pages/PathwayExplorer.tsx` and resolves detail routes through `/pathways/detail/...`.

## Route and API Surface

- View route: `/pathways`
- Detail routes:
  - `/pathways/detail/{source}/{pathway}` for source-scoped detail
  - `/pathways/detail/{pathway}` for an all-sources detail route
- List endpoint: `GET /api/pathways`
- Detail endpoint used by the current UI: `GET /api/pathways/detail/overview`

## Main entities displayed

The explorer displays one summary row per pathway record from `pathway_summary`, scoped to a single source catalog. Each row includes:

- pathway name
- source catalog
- number of linked compounds
- number of linked genes

This source-aware model prevents KEGG and HADEG rows with the same or similar pathway names from being merged too early in the browsing workflow.

## Search behavior

- Free-text search is case-insensitive and targets the pathway name.
- Search is committed when the search action runs.
- Results are paginated in batches of `50`.
- Current server ordering is `compound_count DESC, pathway ASC`.
- The explorer starts with `KEGG` selected by default, so the initial table is already source-scoped before the user applies any extra filters.

## Filtering behavior

The current UI exposes two controls:

- `Source`: one active source at a time, currently `KEGG` or `HADEG`
- `Search`: free-text pathway filtering within the selected source scope

Clearing filters restores the default `KEGG` source and removes the search term.

## Table columns

| Column | Meaning |
| --- | --- |
| `Pathway` | Pathway label used as the drill-down target |
| `Source` | Catalog provenance badge, currently `KEGG` or `HADEG` |
| `Compound Count` | Number of linked compounds in the selected source scope |
| `Gene Count` | Number of linked genes in the selected source scope |

## Detail page structure

Selecting a row opens a pathway detail workspace with:

- header:
  pathway title and the selected source scope
- summary strip:
  `KOs`, `Genes`, `Compounds`, `Reactions`, `Sources`, and `Coverage`
- chart row:
  `KO Distribution`, `Gene Distribution`, and `EC Number Overview`
- grouped toxicity matrix:
  compound-by-endpoint heatmap spanning the compounds linked to the pathway

When the route is entered without a source, the backend can return an `ALL` view and compute cross-source KO overlap. When entered from the explorer table, the detail view is normally source-scoped because the selected row always carries a single source.

## Linked entities

The pathway detail view links the selected pathway to:

- compounds
- KO identifiers
- gene symbols
- EC classes
- available source catalogs for the same pathway label
- toxicity endpoint rows for linked compounds

## Visual summaries

| Visual summary | What it shows |
| --- | --- |
| Summary strip | High-level counts and optional cross-source KO coverage |
| KO Distribution | Top KOs ranked by number of linked compounds |
| Gene Distribution | Top genes ranked by number of linked compounds |
| EC Number Overview | Donut summary of EC-class composition |
| Toxicity heatmap | Compounds ranked against grouped toxicity endpoints; rows are sorted by mean toxicity by default |

## Example workflow

1. Open `/pathways`.
2. Review the default `KEGG` ranking or switch to `HADEG`.
3. Search for a pathway of interest inside the chosen source.
4. Open the pathway row to inspect KO and gene distributions.
5. Use the toxicity heatmap to identify compounds within that pathway context that may merit compound-level follow-up.

## Interpretation guidance

- A pathway row represents a curated source-specific annotation context, not measured pathway activity.
- `Compound Count` and `Gene Count` summarize linked database records, not abundance or environmental prevalence.
- `Coverage` in the detail header corresponds to KO overlap across sources only when the response is built in an all-sources mode and both KEGG and HADEG are available for the pathway.
- KO and gene distribution charts rank compound-linked support counts. They should be read as comparative summaries of linked evidence, not as kinetic or mechanistic proof.
- The toxicity heatmap supports comparative inspection of compounds linked to the pathway. It does not determine pathway hazard or remediation outcome on its own.

## Limitations

- The explorer intentionally shows one source at a time. Cross-source integration requires entering or generating an all-sources detail route.
- Search is limited to the pathway label and does not search gene or compound names.
- The detail page does not currently render dedicated tables of all compounds or genes; it emphasizes summary metrics and charts instead.
- Toxicity matrices depend on ToxCSM coverage of linked compounds.
- Pathway associations are curated and database-derived. Downstream validation remains necessary before any biological or environmental claim is made.

## Related pages

- [Explorers Overview](index.md)
- [Compounds Explorer](compounds.md)
- [Genes and KEGG Orthologs Explorer](genes-kos.md)
- [Compound Classes Explorer](compound-classes.md)
- [API Reference Overview](../api/index.md)
