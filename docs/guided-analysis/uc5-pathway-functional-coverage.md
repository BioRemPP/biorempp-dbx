# UC5 - Pathway Functional Coverage

This page documents `Pathways with Highest Functional Coverage` (`uc5_pathways_functional_coverage`). The query uses the `uc_pathway_functional_coverage` executor to rank pathways by distinct KO coverage in the integrated pathway-relation layer.

## Scientific Question

Which pathways have the highest number of associated KOs within the selected source and pathway scope?

## Query Logic

- Main relation table: `compound_ko_pathway_rel`
- Grouping unit: `pathway`
- Primary metric: `COUNT(DISTINCT ko)` as `ko_count`
- Complementary metric: `COUNT(DISTINCT cpd)` as `compound_count`
- Default source context:
  `all`
- Ranking order:
  `ko_count DESC`, then `pathway ASC`

When `source=all`, the current UI shows pathway rows with `source=Mixed`. In route navigation this mixed label is treated as a general pathway drill-down rather than a source-specific route.

## Filters and Parameters

| Parameter | Effect |
| --- | --- |
| `source` | Restricts the relation scope to `KEGG`, `HADEG`, `COMPOUND_PATHWAY`, or all sources |
| `pathway` | Free-text pathway-name filter |
| `ko_count` | Inclusive KO-coverage window |
| `compound_count` | Inclusive compound-coverage window |

## Returned Entities

The table returns one row per pathway with:

- `rank`
- `pathway`
- `source`
- `ko_count`
- `compound_count`

Selecting a row opens the corresponding pathway detail view.

## Visualizations

- Horizontal bar chart:
  top-ranked pathways by distinct KO count
- Ranked table:
  pathway-level comparison in the active source context

## Interpretation

- Higher `ko_count` suggests broader annotation-derived functional coverage for the pathway in the current scope.
- `compound_count` helps distinguish pathways with broad compound association from pathways dominated by KO breadth alone.
- Source selection matters. A pathway may rank differently in `KEGG`, `HADEG`, and the combined view because the underlying relation catalog differs.

## Limitations

- `ko_count` does not measure pathway flux, completeness under environmental conditions, or confirmed degradation performance.
- The combined `Mixed` view compresses source differences and should be interpreted cautiously.
- A pathway can rank highly because of curation density and relation coverage, not necessarily because of stronger real-world relevance.

## Suggested Downstream Validation

1. Open the pathway detail page to inspect the linked KO and source context.
2. Compare the same pathway across source-specific explorer views.
3. Use pathway literature or experimental evidence before inferring mechanistic importance.

## Related Pages

- [Guided Analysis Overview](index.md)
- [Pathways Explorer](../explorers/pathways.md)
- [Output Interpretation](output-interpretation.md)
