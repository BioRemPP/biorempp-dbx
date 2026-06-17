# Rankings and Bar Charts

Ranked bar-based summaries are the most common visualization type in the current Database Explorer. They provide compact comparisons of counts or ranking metrics across compounds, pathways, genes, agencies, and related functional summaries.

## Where it appears

- Compound detail overview:
  `KO Coverage (Real Relations)`, `Top KEGG Pathways`, `Top HADEG Pathways`
- Pathway detail:
  `KO Distribution`, `Gene Distribution`
- Compound-class detail:
  `KO Distribution`, `Gene Distribution`
- Guided Analysis UC1, UC4, UC5, UC6, UC7, and UC8

The shared component is `src/shared/visualization/charts/HorizontalBarChart.tsx`.

## Data represented

The bar charts currently summarize ranked categorical values such as:

- KO support counts
- pathway support counts
- gene support counts
- compounds per agency
- toxic compounds per pathway
- toxic compounds per gene

Most of these are counts of linked records or distinct linked entities, not direct laboratory measurements.

## Axes and encodings

- Category labels appear on the vertical axis as a stacked list of rows
- Numeric magnitude is encoded by horizontal bar width
- Numeric values are also printed explicitly beside each row
- Tooltips provide a fuller explanation of what the count means
- Colors may be semantic in some contexts:
  source-aware pathway bars use different colors for `HADEG` and `KEGG`, while many guided rankings use a single default blue

Small bars remain visible because the current renderer enforces a minimum proportional width.

## How to read the chart

1. Read the title and subtitle first because the same bar component is reused for many different metrics.
2. Compare the explicit value labels before interpreting color.
3. Use the bar order to identify the current ranking basis.
4. Inspect the tooltip when the label alone does not explain the count semantics.
5. Pair the chart with the adjacent or downstream table if you need the full record context.

## What patterns may suggest

- long leading bars may suggest dominant categories within the active filtered scope
- a steep drop between the first few rows and the rest may indicate concentrated support rather than evenly distributed coverage
- similar bar lengths across many rows may suggest a flatter relationship landscape
- in source-aware charts, differences between KEGG and HADEG rankings may point to source-specific emphasis

## What should not be inferred

- Bar length alone does not prove biological importance.
- A top-ranked gene or pathway is not automatically the most mechanistically relevant.
- Default bar colors are often presentational and should not be overinterpreted.
- Top-N charts intentionally compress the tail of the distribution and therefore are not full-population views.

## Example interpretation

If the compound detail `Top KEGG Pathways` chart shows a few pathways with much higher supporting-row counts than the rest, a cautious interpretation is:

> The selected compound is linked more densely to those KEGG pathways in the current integrated evidence graph, which may justify pathway-level follow-up.

An overclaim would be:

> Those are the pathways the compound definitely degrades through in vivo.

## Limitations

- Bar charts emphasize ranking clarity over relational detail and therefore hide many-to-many structure.
- The meaning of a count differs across charts and must be read from the surrounding title, subtitle, or tooltip.
- Guided bar charts often summarize only the leading entities in scope, while tables preserve the fuller paginated result set.

## Related Pages

- [Visualizations Overview](index.md)
- [Guided Analysis Overview](../guided-analysis/index.md)
- [Interpretation Boundaries](interpretation-boundaries.md)
