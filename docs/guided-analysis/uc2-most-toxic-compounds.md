# UC2 - Most Toxic Compounds

This page documents `Most Toxic Compounds` (`uc2_most_toxic_compounds`), which uses the `uc_most_toxic_compounds` executor to rank compounds by predictive toxicity signals under an explicitly selected endpoint context.

## Scientific Question

Which compounds present the highest predicted toxicological risk under the selected endpoint or endpoint-group context?

## Query Logic

- Dataset entry point: `compound_summary`
- Joined predictive table: `toxicity_endpoint`
- Two operating modes:
  `Single Endpoint` and `Endpoint Group Peak (MAX)`
- Default context:
  `risk_mode=endpoint`, `endpoint_group=all`, `endpoint=avian`
- Ranking order:
  `y_value DESC`, then `gene_count DESC`, then `cpd ASC`
- Compounds with no available toxicity value for the selected context are excluded from the ranking and counted in `Excluded (Null Endpoint)`

In `Single Endpoint` mode, the ranking uses one chosen endpoint value. In `Endpoint Group Peak` mode, the ranking uses the maximum predicted value observed within the selected endpoint group for each compound.

## Filters and Parameters

| Parameter | Effect |
| --- | --- |
| `risk_mode` | Chooses single-endpoint versus group-peak ranking |
| `endpoint_group` | Restricts the selectable endpoint domain |
| `endpoint` | Chooses the actual endpoint when the mode requires one |
| `compoundclass` | Restricts the compound subset |
| `y_value` | Inclusive window for prediction values |
| `gene_count` | Optional functional-context filter |
| `pathway_count` | Optional pathway-context filter |
| `search` | Narrows by compound name or CPD |

## Returned Entities

The result table returns one row per ranked compound with:

- `rank`
- `cpd`
- `compoundname`
- `compoundclass`
- `y_value`
- `endpoint_used`
- `gene_count`
- `pathway_count`

Selecting a row opens the corresponding compound detail page.

## Visualizations

- Toxicity heatmap matrix:
  top-ranked compounds against the active endpoint scope
- Ranked table:
  compound-level comparison under the same risk context

The heatmap preserves endpoint-level values and is intended for comparative inspection, not for absolute hazard classification.

## Interpretation

- Higher-ranked compounds indicate stronger predictive toxicity signals within the current endpoint context.
- Switching between `Single Endpoint` and `Endpoint Group Peak` can materially change the ranking because the score basis changes.
- Compounds with similar `y_value` but different `gene_count` or `pathway_count` may deserve different follow-up priorities.

## Limitations

- Toxicity values are predictive and database-derived, not experimentally confirmed outcomes.
- Rankings are sensitive to endpoint choice, group definition, and numeric threshold windows.
- The query does not encode dose, exposure scenario, or organism-specific real-world context.

## Suggested Downstream Validation

1. Review the compound in the [Toxicity Explorer](../explorers/toxicity.md) and the compound detail page.
2. Compare multiple endpoint contexts rather than relying on a single score.
3. Use validated toxicological datasets or experiments before drawing hazard conclusions.

## Related Pages

- [Guided Analysis Overview](index.md)
- [Filters and Parameters](filters-and-parameters.md)
- [Toxicity Explorer](../explorers/toxicity.md)
