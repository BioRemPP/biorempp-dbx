# Scatterplots

The current Database Explorer exposes one primary scatter-based visualization: the `Risk vs Bioremediation Potential` chart used by Guided Analysis UC3.

## Where it appears

- Guided Analysis UC3:
  [Risk versus Bioremediation Potential](../guided-analysis/uc3-risk-vs-bioremediation-potential.md)

## Data represented

Each point represents one compound in the current filtered scope. The chart combines several variables at once:

- annotation-derived potential from `gene_count`
- predictive toxicity from `toxicity_risk_mean` or a selected endpoint value
- pathway breadth from `pathway_count`
- compound class as a color category

The current component is `src/features/guided-analysis/charts/RiskPotentialScatterChart.tsx`.

## Axes and encodings

- X-axis:
  `gene_count`, shown either as `linear` or `log10(gene_count + 1)`
- Y-axis:
  selected toxicity metric
- Point color:
  compound class
- Point size:
  `pathway_count`
- Red dashed threshold lines:
  filtered-scope percentile thresholds, currently `P75`
- Quadrant labels:
  textual guides such as `High Risk + High Potential`

## How to read the chart

1. Check the execution metadata above the chart to confirm the active endpoint context and threshold basis.
2. Read the X-axis as annotation-derived potential, not as measured degradation performance.
3. Read the Y-axis as predictive risk under the selected toxicity context.
4. Use the red dashed lines to separate the relative quadrants of the current scope.
5. Use the legend to map point colors to compound classes.
6. Click a point to open the corresponding compound detail page.

The guided table below the chart contains only compounds in the top-right quadrant, ordered by higher risk first and then higher `gene_count`.

## What patterns may suggest

- top-right clustering may suggest compounds that deserve closer review because they combine broader annotation coverage with stronger predicted risk
- bottom-right points may suggest higher annotation-derived potential with comparatively lower risk under the current metric
- large points may indicate compounds with broader linked pathway coverage
- class-color clustering can reveal whether certain compound classes dominate a given quadrant

## What should not be inferred

- Quadrant membership is not an absolute hazard class.
- High `gene_count` does not prove stronger biodegradation capacity.
- Point size does not indicate environmental abundance or kinetic rate.
- The scatterplot does not reveal causal toxicological mechanism.
- A compound moving between quadrants after a filter change does not indicate instability in the underlying data; it reflects that thresholds are context-relative.

## Example interpretation

If a compound sits in the top-right quadrant with a large point and a high Y value, a cautious interpretation is:

> This compound combines broader linked gene and pathway context with stronger predictive toxicity under the selected endpoint scope, so it may be a priority candidate for careful follow-up.

An overclaim would be:

> This compound has both the best bioremediation performance and confirmed high toxicity.

## Limitations

- The current scatterplot is specific to one guided use case and should not be generalized to all Explorer views.
- The `Focus Cluster (Gene p95)` option can remove upper-tail outliers before thresholds are recomputed.
- The chart depends on predictive toxicity coverage; compounds lacking the selected Y metric are excluded from the plotted set.

## Related Pages

- [Visualizations Overview](index.md)
- [Guided Analysis UC3](../guided-analysis/uc3-risk-vs-bioremediation-potential.md)
- [Interpretation Boundaries](interpretation-boundaries.md)
