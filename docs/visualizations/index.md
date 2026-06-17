# Visualizations

This section explains how to read the main chart families currently exposed by the BioRemPP Database Explorer. It is documentation about the visual layer of the application, not a separate analytical route. In the current app, the legacy client path `/visualizations` is only a redirect alias for `/guided-analysis`.

--8<-- "includes/app-release.md"

## Purpose

The BioRemPP Database Explorer uses compact, code-native visual summaries to support exploratory analysis over a curated, compound-centric database resource. These charts are intentionally lightweight and are designed to:

- summarize ranked relationships without hiding the underlying table context
- expose predictive toxicity patterns across grouped endpoint domains
- help users compare compounds, pathways, genes, and compound classes under a shared interface
- support hypothesis generation before downstream validation

!!! warning "Interpretation Boundary"
    Visual outputs summarize integrated evidence and database-derived indicators. They do not constitute experimental validation, confirmed pathway activity, real-world toxicity measurement, or regulatory compliance assessment.

## Current Visualization Families

| Visualization family | Main current surfaces | Backing components |
| --- | --- | --- |
| Heatmaps | Compound detail, gene detail, pathway detail, compound-class detail, Guided Analysis UC2 and UC6 | `ToxicityHeatmapOverview`, `PathwayToxicityHeatmap`, `GuidedToxicityHeatmapMatrix` |
| Scatterplots | Guided Analysis UC3 | `RiskPotentialScatterChart` |
| Rankings and bar charts | Compound, pathway, compound-class, and guided ranking views | `HorizontalBarChart` |
| Distribution plots | Guided Analysis UC8 and EC-class detail summaries | `BoxplotChart`, `DonutChart` |
| Legends and tooltips | Shared across all chart families | `ChartLegend`, `HeatmapLegend`, `ChartTooltip` |

The shared visualization shell is built around `ChartCard` and standardized empty/error states in `src/shared/visualization`.

## Where Visualizations Appear

- Compound detail overview:
  KO coverage bars, top KEGG pathways, top HADEG pathways, and endpoint toxicity heatmap
- Gene detail overview:
  compound-by-endpoint toxicity heatmap
- Pathway detail:
  KO distribution bars, gene distribution bars, EC-class donut, and compound-by-endpoint toxicity heatmap
- Compound-class detail:
  KO distribution bars, gene distribution bars, EC-class donut, and compound-by-endpoint toxicity heatmap
- Guided Analysis:
  ranked bars, toxicity matrices, risk-versus-potential scatter, and toxicity boxplots depending on the selected use case

## Data Represented

Current charts mostly represent one of four data families:

- annotation breadth counts such as `ko_count`, `gene_count`, `compound_count`, and `pathway_count`
- predictive toxicity values from `toxicity_endpoint`
- backend-derived risk buckets such as `low_risk`, `medium_risk`, and `high_risk`
- grouped categorical summaries such as EC-class composition or compound class membership

## How to Use This Section

- [Heatmaps](heatmaps.md) explains grouped toxicity matrices and the different row/column conventions used across pages.
- [Scatterplots](scatterplots.md) explains the guided risk-versus-potential chart.
- [Rankings and Bar Charts](rankings-bar-charts.md) explains ranked bar-based summaries.
- [Distribution Plots](distribution-plots.md) explains boxplots and compact donut summaries.
- [Legends and Tooltips](legends-tooltips.md) explains what the labels and hover text encode.
- [Interpretation Boundaries](interpretation-boundaries.md) explains what these charts should and should not be used to claim.

## Related Pages

- [Guided Analysis Overview](../guided-analysis/index.md)
- [Guided Analysis Output Interpretation](../guided-analysis/output-interpretation.md)
- [Explorers Overview](../explorers/index.md)
