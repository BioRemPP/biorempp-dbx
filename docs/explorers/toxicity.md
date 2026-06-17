# Toxicity Explorer

## Purpose

The Toxicity Explorer provides an endpoint-level view of ToxCSM-derived toxicity rows already integrated into the BioRemPP Database Explorer. It is designed for screening, prioritization, and comparative review of compound-endpoint combinations rather than for entity-by-entity drill-down.

This view is implemented by `src/features/toxicity/pages/ToxicityExplorer.tsx`.

## Route and API Surface

- View route: `/toxicity`
- List endpoint: `GET /api/toxicity`
- Metadata endpoints used by the current UI:
  - `GET /api/meta/toxicity/endpoints`
  - `GET /api/meta/toxicity/labels`
  - `GET /api/meta/compound-classes`

## Main entities displayed

The explorer displays one row per compound-endpoint record from `toxicity_endpoint`. Each row includes:

- compound identifier and preferred name
- compound class
- toxicity endpoint
- endpoint label
- numeric value

This makes the explorer useful for endpoint-focused screening when the goal is to identify compounds associated with particular toxicity domains or severity labels.

## Search behavior

- Free-text search is case-insensitive and targets compound name and compound ID.
- Search is committed when the search action runs.
- Results are paginated in batches of `50`.
- The server orders results with non-null values first, then by descending numeric value, followed by compound name and compound ID.
- When endpoint metadata loads, the UI automatically selects the first available endpoint so the page always opens with one endpoint already in focus.

## Filtering behavior

The current UI exposes dependent endpoint filters and numeric bounds.

- `Endpoint`: exact endpoint identifier from `/api/meta/toxicity/endpoints`
- `Label`: exact label values refreshed for the currently selected endpoint
- `Compound Class`: exact class filter from `/api/meta/compound-classes`
- `Min Value` / `Max Value`: inclusive numeric bounds

Important current behaviors:

- label options are endpoint-dependent
- changing the endpoint refreshes the label list
- incompatible selected labels are cleared automatically
- clearing filters preserves the current endpoint selection so the explorer remains scoped to a valid endpoint context

## Table columns

| Column | Meaning |
| --- | --- |
| `Compound ID` | Compound identifier linked to the endpoint row |
| `Compound Name` | Preferred compound name when available |
| `Class` | Curated compound class |
| `Endpoint` | ToxCSM endpoint identifier formatted for display |
| `Label` | Endpoint label returned by the current dataset |
| `Value` | Numeric endpoint value shown to four decimal places when available |

## Detail page structure

The current routed application does not implement a dedicated toxicity detail page. The toxicity explorer is intentionally table-first.

- there is no `/toxicity/{id}` route in the current app shell
- table rows are not clickable drill-down targets
- follow-up inspection is expected to happen through the other explorers, especially compound detail pages

## Linked entities

Although this page does not drill down directly, each row still refers to linked entities that can be inspected elsewhere:

- the compound record identified by `cpd`
- the compound class used for aggregation in the Compound Classes Explorer
- the same toxicity endpoint groups reused by pathway, gene, compound, and compound-class heatmaps

## Visual summaries

The current explorer does not render chart panels or heatmaps. Its visual emphasis is the paginated endpoint table itself.

For toxicity-oriented visual summaries, use:

- compound detail toxicity heatmaps
- gene detail toxicity heatmaps
- pathway detail toxicity heatmaps
- compound-class detail toxicity heatmaps

## Example workflow

1. Open `/toxicity`.
2. Keep the default endpoint or switch to another endpoint of interest.
3. Refresh the endpoint-specific `Label` filter if finer screening is needed.
4. Apply a compound class filter or numeric range to narrow the endpoint table.
5. Record the compound IDs that appear most relevant and inspect them in the Compounds Explorer or in guided-analysis outputs.

## Interpretation guidance

- Toxicity rows should be interpreted within the currently selected endpoint context. Numeric values from different endpoints should not be compared as if they were a single common scale.
- Labels are predictive or database-derived indicators when applicable. They support prioritization and exploratory inspection rather than confirmatory toxicological claims.
- Endpoint-focused filtering is useful for identifying candidates for follow-up, not for determining real-world exposure outcomes or legal hazard status.
- A high value or high-risk label in this table does not confirm environmental impact, just as the absence of a row does not prove safety.

## Limitations

- There is no dedicated detail page or direct row drill-down in the current routed UI.
- The page is intentionally scoped to one endpoint focus at a time because the label filter depends on endpoint semantics.
- The auto-selected endpoint on first load means the initial table is not a cross-endpoint global ranking.
- Free-text search covers compound fields, not endpoint descriptions beyond the exact endpoint selector.
- Toxicity values remain model-derived or database-derived indicators and require downstream validation.

## Related pages

- [Explorers Overview](index.md)
- [Compounds Explorer](compounds.md)
- [Genes and KEGG Orthologs Explorer](genes-kos.md)
- [Pathways Explorer](pathways.md)
- [Compound Classes Explorer](compound-classes.md)
