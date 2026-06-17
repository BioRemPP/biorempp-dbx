# UC6 - Pathways Linked to Toxic Compounds

This page documents the query exposed in the current UI as `Pathways Associated with Toxic Compounds` (`uc6_pathways_toxic_compounds`). It uses the `uc_pathways_toxic_compounds` executor to summarize pathway contexts linked to compounds above a selected predictive-toxicity threshold.

## Scientific Question

Which pathways are linked to compounds with high predicted toxicity under the selected endpoint context?

## Query Logic

- Main relation table: `compound_ko_pathway_rel`
- Toxicity join: `toxicity_endpoint`
- Aggregation unit: pathway
- Default context:
  `source=all`, `risk_mode=endpoint`, `endpoint_group=all`, `endpoint=avian`, `y_value.min=0.5`
- Ranking order:
  `toxic_compound_count DESC`, then `max_prediction DESC`, then `pathway ASC`

For each pathway, the executor computes:

- `compound_count`
- `toxic_compound_count`
- `toxic_ratio`
- `max_prediction`

Only pathways with at least one compound above the active toxicity threshold remain in the ranked result.

## Filters and Parameters

| Parameter | Effect |
| --- | --- |
| `source` | Restricts pathway relations to one source or keeps the combined view |
| `pathway` | Free-text pathway-name filter |
| `risk_mode` | Chooses single-endpoint or endpoint-group peak scoring |
| `endpoint_group` | Restricts the endpoint domain |
| `endpoint` | Chooses the endpoint when the context requires one |
| `y_value` | Defines the toxicity threshold window |
| `compound_count` | Inclusive total-compound window per pathway |
| `toxic_compound_count` | Inclusive toxic-compound window per pathway |

## Returned Entities

The table returns one row per pathway with:

- `rank`
- `pathway`
- `source`
- `toxic_compound_count`
- `compound_count`
- `toxic_ratio`
- `max_prediction`

Selecting a row opens the corresponding pathway detail view.

## Visualizations

- Horizontal bar chart:
  pathways ranked by `toxic_compound_count`
- Heatmap matrix:
  pathways versus grouped toxicity endpoints using aggregated pathway-level endpoint values
- Ranked table:
  pathway comparison under the same threshold context

## Interpretation

- Higher `toxic_compound_count` indicates a stronger exploratory association between the pathway and compounds above the selected predictive threshold.
- `toxic_ratio` helps distinguish large pathways with many linked compounds from pathways where toxicity is concentrated in a higher fraction of the associated compounds.
- The heatmap is most useful for comparing pathway profiles across endpoint groups, not for assigning causal mechanism.

## Limitations

- The result is directly dependent on endpoint selection, endpoint grouping, and toxicity threshold choice.
- Pathway-level aggregation does not imply that the pathway causes toxicity or mediates toxicodynamics.
- Toxicity values remain predictive indicators without exposure or dose-response context.

## Suggested Downstream Validation

1. Inspect the selected pathway in the pathway detail page.
2. Compare the compounds driving the pathway signal in the compound or toxicity explorers.
3. Validate the biological and toxicological interpretation with literature or experiments before using the pathway as an operational priority target.

## Related Pages

- [Guided Analysis Overview](index.md)
- [Filters and Parameters](filters-and-parameters.md)
- [Pathways Explorer](../explorers/pathways.md)
- [Toxicity Explorer](../explorers/toxicity.md)
