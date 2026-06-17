# Distribution Plots

The current Database Explorer uses two compact distribution-oriented summaries: boxplots in Guided Analysis UC8 and donut charts in pathway and compound-class detail pages. They answer different questions, but both help users read how values are distributed rather than only how they rank.

## Where it appears

- Guided Analysis UC8:
  boxplot of toxicity values per top-ranked gene
- Pathway detail:
  donut chart for EC-class composition
- Compound-class detail:
  donut chart for EC-class composition

The relevant components are `src/shared/visualization/charts/BoxplotChart.tsx` and `src/shared/visualization/charts/DonutChart.tsx`.

## Data represented

- Boxplot:
  distribution of endpoint toxicity values associated with compounds linked to each gene
- Donut chart:
  composition of counts across EC enzyme classes

These are different analytical summaries:

- the boxplot describes spread, central tendency, and tails
- the donut chart describes part-to-whole composition

## Axes and encodings

### Boxplot

- X-axis:
  one group per gene
- Y-axis:
  toxicity score
- Box:
  interquartile range from `Q1` to `Q3`
- Center line:
  median
- Whiskers:
  minimum and maximum
- Overlay points:
  sampled underlying compound values used to give point-level context

### Donut chart

- No Cartesian axes are used
- Slice angle and arc length represent the relative size of each EC-class count
- The center shows the total count
- The legend-style list below the ring shows slice count and approximate percentage

## How to read the chart

### Boxplot

1. Compare medians to see which groups sit higher overall.
2. Compare box height to assess how broad the middle 50% of values is.
3. Inspect whiskers and overlay points to see whether a signal is broad or driven by extremes.
4. In UC8, remember that the chart is page-scoped and therefore aligned to the current table page rather than the full ranked universe.

### Donut chart

1. Use the center total to anchor how much evidence is in scope.
2. Compare slice proportions through the list values, not only through the ring shape.
3. Read the chart as composition, not as order or direction.

## What patterns may suggest

- a boxplot with high median and narrow spread may suggest consistently elevated predicted toxicity within that gene group
- a boxplot with a moderate median but extreme upper-tail points may suggest a gene linked to a few very high-scoring compounds
- a donut chart dominated by one EC class may suggest compositional concentration within that pathway or compound class
- a more even donut may suggest broader enzyme-class diversity

## What should not be inferred

- Boxplots do not prove toxicity mechanisms or biological causality.
- Donut slices do not imply pathway completeness or catalytic dominance.
- Percentages in the donut chart do not indicate abundance or environmental prevalence.
- Page-scoped boxplots should not be read as complete-release distributions.

## Example interpretation

If UC8 shows a gene with a wide box and several high-end overlay points, a cautious interpretation is:

> The gene is associated with a heterogeneous set of compound toxicity values under the selected endpoint, including a higher-value upper tail that may deserve follow-up.

If a pathway detail donut chart is dominated by one EC class, a cautious interpretation is:

> The currently linked EC annotations are concentrated in that class within the present database scope.

## Limitations

- The current live Database Explorer does not expose density plots, histograms, or violin plots as first-class user-facing charts.
- Donut charts are effective for compact composition summaries but are not ideal for reading very small differences between many categories.
- Boxplots compress individual observations into summary statistics and therefore should be paired with the table or overlay points when possible.

## Related Pages

- [Visualizations Overview](index.md)
- [Guided Analysis UC8](../guided-analysis/uc8-genes-linked-toxic-compounds.md)
- [Pathways Explorer](../explorers/pathways.md)
- [Compound Classes Explorer](../explorers/compound-classes.md)
