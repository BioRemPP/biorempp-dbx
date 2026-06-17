# Interpretation Boundaries

This page defines the main scientific boundaries for reading charts in the BioRemPP Database Explorer. It adapts the interpretation discipline of the earlier Web Service documentation to a database-first environment in which charts summarize pre-integrated evidence rather than uploaded sample analyses.

## Where it appears

These boundaries apply across all chart-driven surfaces:

- compound detail overview
- gene detail overview
- pathway detail
- compound-class detail
- Guided Analysis

## Data represented

Current visualizations primarily encode:

- curated counts of linked compounds, genes, pathways, KOs, reactions, or references
- predictive toxicity values and backend-derived risk buckets
- grouped endpoint families for navigational interpretation
- scoped rankings after user-applied filters

These are analytically useful signals, but they are not direct experimental observations of biological activity or environmental outcome.

## Axes and encodings

The visual encodings in the current app compress complex relationships into simplified forms:

- bar length compresses relational counts
- heatmap color compresses predictive intensity
- scatter position compresses multi-variable prioritization into two main axes plus size and color
- boxplot summaries compress many observations into quartiles and whiskers
- donut slices compress part-to-whole composition

That compression is useful for exploration, but it removes mechanistic and contextual detail.

## How to read the chart

1. Start with the active query or detail-view context.
2. Confirm the filters, source scope, and threshold settings.
3. Read the chart together with its table, summary cards, or metadata.
4. Use the chart to identify candidate relationships or patterns.
5. Use detail pages, literature, or experiments for downstream validation.

## What patterns may suggest

- broader annotation breadth
- concentrated predictive toxicity signals
- source-specific pathway emphasis
- candidate gene or pathway hubs
- compositional skew in EC-class coverage

These are valid exploratory interpretations when kept within the current filtered database scope.

## What should not be inferred

- No chart proves biodegradation or remediation efficacy.
- No predictive toxicity heatmap or scatterplot confirms real-world toxicological outcome.
- No regulatory-reference chart substitutes for formal regulatory review.
- No ranking metric should be treated as a universal biological score.
- Missing rows or cells should not be read as proof of absence.
- Differences between two charts may reflect different scope definitions rather than contradictory biology.

## Example interpretation

Correct:

> Under the current endpoint and threshold settings, this pathway is associated with a larger number of compounds above the selected predictive toxicity threshold, which may justify follow-up review.

Incorrect:

> This pathway is toxic.

Correct:

> This compound ranks highly by KO coverage in the integrated dataset and may be a useful hypothesis-generation target.

Incorrect:

> This compound is confirmed to have superior bioremediation performance.

## Limitations

- The Explorer operates on a release-specific integrated database snapshot, so future releases may change chart populations and rankings.
- Many chart values are sensitive to endpoint selection, source scope, threshold windows, or Top-N truncation.
- Some guided visuals, especially UC8 boxplots and bars, are intentionally page-scoped in the client and therefore do not depict the entire ranked population at once.

## Suggested downstream validation

1. Inspect the underlying entity detail page or guided result table.
2. Confirm the exact metric and scope used to generate the chart.
3. Compare the result against orthogonal sources such as source-specific pathway context or regulatory annotations.
4. Use experimental or literature-backed evidence before making biological, toxicological, or regulatory claims.

## Related Pages

- [Visualizations Overview](index.md)
- [Guided Analysis Output Interpretation](../guided-analysis/output-interpretation.md)
- [Guided Analysis Filters and Parameters](../guided-analysis/filters-and-parameters.md)
- [Toxicity Explorer](../explorers/toxicity.md)
