# Legends and Tooltips

Legends and tooltips provide most of the disambiguation layer for the current chart system. Because the Database Explorer favors lightweight, code-native charts over heavy interactive plotting frameworks, these elements carry a large share of the explanatory burden.

## Where it appears

- Heatmaps:
  grouped endpoint headers, gradient legends, and cell-level hover text
- Guided scatterplot:
  compound-class legend and point-level hover text
- Ranked bar charts:
  row-level tooltip text on each ranked item
- Donut charts:
  inline slice list with counts and percentages
- Compound toxicity overview:
  custom discrete risk legend plus a prediction gradient legend and footer note

## Data represented

Current legend and tooltip systems communicate:

- color-category mappings
- low-to-high gradient scales
- exact endpoint labels after formatting
- count semantics that are compressed in short chart titles
- full compound, pathway, or gene identifiers when the rendered label is truncated

The main shared components are `ChartLegend`, `HeatmapLegend`, and `ChartTooltip`.

## Axes and encodings

This page is about explanatory encodings rather than primary chart axes.

- `ChartLegend` maps categorical colors to labels
- `HeatmapLegend` can combine discrete swatches and a continuous gradient
- `ChartTooltip` exposes detail through the browser `title` attribute
- grouped endpoint headers act like a structural legend for toxicity domains

## How to read the chart

1. Read the legend before comparing colors across categories.
2. Use the gradient labels to determine whether a heatmap runs from low to high or from risk bucket to risk bucket.
3. Hover a cell, bar, or point when the visible label is abbreviated or truncated.
4. In scatterplots, use the legend to decode compound class before trying to interpret class clustering.
5. In compound toxicity overview, treat the `Prediction` row and the `Risk` legend as complementary rather than interchangeable.

## What patterns may suggest

- repeated colors in the scatter legend can show whether one compound class dominates the current scope
- grouped headers in heatmaps can reveal whether a signal concentrates in one toxicity domain
- tooltip text can reveal whether a high-level count represents distinct entities, supporting rows, or thresholded compounds

## What should not be inferred

- Similar colors across different charts do not always encode the same semantics.
- A tooltip does not add validation; it only exposes more precise metadata.
- Browser-native title tooltips are simple and can vary in feel across devices, especially on touch interfaces.
- Truncated labels should not be interpreted without checking the tooltip or surrounding table context.

## Example interpretation

If a guided bar chart label is truncated but the tooltip reveals that the value represents `distinct KO-Pathway relations`, the correct interpretation is:

> The chart is ranking linked relation counts, not pathway completeness or reaction flux.

Similarly, if a heatmap legend shows `Low` to `High` for the gradient and separate discrete risk swatches, the correct reading is:

> The continuous color scale is encoding numeric prediction intensity, while the risk swatches describe the qualitative bucket system used in other contexts.

## Limitations

- The current tooltip system is intentionally lightweight and uses native browser behavior rather than rich pinned overlays.
- Some charts rely heavily on titles, subtitles, and tooltips because compact layouts would otherwise hide too much detail.
- Legend colors are stable within a chart, but not guaranteed to be globally standardized across every chart family.

## Related Pages

- [Visualizations Overview](index.md)
- [Heatmaps](heatmaps.md)
- [Scatterplots](scatterplots.md)
- [Interpretation Boundaries](interpretation-boundaries.md)
