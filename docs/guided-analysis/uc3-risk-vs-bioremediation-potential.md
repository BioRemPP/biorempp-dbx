# UC3 - Risk versus Bioremediation Potential

This page documents the query shown in the current UI as `Risk vs Bioremediation Potential` (`uc3_risk_vs_bioremediation_potential`). It uses the `uc_risk_potential_scatter` executor to compare annotation-derived potential against predictive toxicity.

## Scientific Question

Which compounds combine higher annotation-derived bioremediation potential with higher predicted toxicological risk?

## Query Logic

- Dataset entry point: `compound_summary`
- X-axis metric: `gene_count`
- Y-axis metric:
  `toxicity_risk_mean` or a selected endpoint value
- Point size: `pathway_count`
- Point color: compound class
- Threshold basis:
  current executor configuration uses `p75_filtered_scope`
- Default context:
  `endpoint_group=all`, `endpoint=mean`, `x_scale=log10p1`, `focus_cluster=false`

If `Focus Cluster (Gene p95)` is enabled, the executor first removes the extreme upper tail of `gene_count` within the filtered point cloud and then recomputes the percentile thresholds on the reduced set. The table contains only compounds from the top-right quadrant.

## Filters and Parameters

| Parameter | Effect |
| --- | --- |
| `endpoint_group` | Restricts the toxicity domain used for Y-axis selection |
| `endpoint` | Chooses the Y-axis toxicity metric, including synthetic `mean` when available |
| `x_scale` | Switches between `linear` and `log10(gene_count + 1)` |
| `compoundclass` | Restricts the point set to one class |
| `gene_count` | Optional x-dimension scope window |
| `y_value` | Optional y-dimension scope window |
| `pathway_count` | Optional size-related scope window |
| `focus_cluster` | Removes very high-gene-count outliers using the filtered `p95` cutoff |
| `search` | Narrows by compound name or CPD |

## Returned Entities

The ranked table returns only compounds in the top-right quadrant, with:

- `rank`
- `cpd`
- `compoundname`
- `compoundclass`
- `gene_count`
- `y_value`
- `pathway_count`

Selecting a row opens the corresponding compound detail page.

## Visualizations

- Scatter quadrant plot:
  all plotted compounds that passed the current filters
- Ranked table:
  only the top-right quadrant compounds, ordered by higher risk first and then higher `gene_count`

## Interpretation

- The top-right quadrant indicates compounds that are simultaneously high on the selected risk metric and high on the annotation-derived potential metric within the current scope.
- Quadrant membership is relative, not absolute, because both threshold lines are percentile-based.
- The chart is especially useful for separating high-potential/lower-risk candidates from high-potential/higher-risk candidates during exploratory triage.

## Limitations

- `gene_count` is a proxy for annotation-derived potential, not a measurement of degradation efficiency.
- Changing endpoint context, filters, or `focus_cluster` can move a compound between quadrants.
- The plot does not reveal toxicological mechanism or remediation performance.

## Suggested Downstream Validation

1. Inspect top-right compounds in the compound detail view.
2. Cross-check whether the same compounds remain prominent under alternative endpoint contexts.
3. Validate both the bioremediation hypothesis and the toxicological concern with orthogonal evidence before prioritizing them operationally.

## Related Pages

- [Guided Analysis Overview](index.md)
- [Filters and Parameters](filters-and-parameters.md)
- [Compounds Explorer](../explorers/compounds.md)
- [Toxicity Explorer](../explorers/toxicity.md)
