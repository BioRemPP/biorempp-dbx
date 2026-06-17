# UC1 - Top Bioremediation-Linked Compounds

This page documents the guided query exposed in the current UI as `Top Bioremediation Compounds` (`uc1_top_bioremediation_compounds`). It is backed by the `uc_ranked_metric` executor and ranks compounds by annotation breadth within the integrated database.

## Scientific Question

Which BioRemPP compounds show broader functional annotation coverage based on distinct KEGG Orthology associations?

## Query Logic

- Dataset entry point: `compound_summary`
- Primary ranking metric: `ko_count`
- Default ordering: `ko_count DESC`, then `cpd ASC`
- Scope filters: compound search, compound class, KO count, gene count, and pathway count
- Summary cards: `Compounds in Scope` and `Ranked Metric`

In practice, this use case asks which compounds accumulate broader curated KO coverage after the current filters are applied.

## Filters and Parameters

| Parameter | Effect |
| --- | --- |
| `search` | Narrows the scope by compound name or CPD |
| `compoundclass` | Restricts the ranking to one curated compound class |
| `ko_count` | Inclusive annotation-breadth window for the ranking metric itself |
| `gene_count` | Optional complementary functional-breadth window |
| `pathway_count` | Optional pathway-annotation window |

## Returned Entities

The result table returns one row per compound with:

- `rank`
- `cpd`
- `compoundname`
- `compoundclass`
- `ko_count`
- `gene_count`
- `pathway_count`

Selecting a row opens the corresponding compound detail page.

## Visualizations

- Horizontal bar chart:
  top `10` compounds by `ko_count`
- Ranked table:
  paginated compound list for detailed comparison

## Interpretation

- Higher ranks indicate broader annotation-derived functional coverage in the current scope.
- Compounds that rank highly in both `ko_count` and complementary fields such as `gene_count` or `pathway_count` may be useful starting points for exploratory prioritization.
- The result is best interpreted as a map of integrated evidence density, not a direct measure of biochemical performance.

## Limitations

- `ko_count` measures annotation breadth, not experimentally validated biodegradation activity.
- Rank changes can reflect curation density or identifier coverage as much as biological relevance.
- The query does not capture pathway directionality, environmental conditions, or kinetic evidence.

## Suggested Downstream Validation

1. Open the compound detail page and inspect linked pathways and genes.
2. Compare the compound against pathway-centric results in UC5 or UC6.
3. Use literature review or experimental assays to test whether broad annotation coverage corresponds to relevant degradation behavior.

## Related Pages

- [Guided Analysis Overview](index.md)
- [Compounds Explorer](../explorers/compounds.md)
- [Output Interpretation](output-interpretation.md)
