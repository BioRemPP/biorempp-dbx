# UC8 - Genes Linked to Toxic Compounds

This page documents `Genes Linked to Toxic Compounds` (`uc8_genes_linked_toxic_compounds`). It uses the `uc_gene_toxic_compounds_endpoint` executor to rank genes by the number of distinct compounds above the selected toxicity threshold.

## Scientific Question

Which genes are associated with compounds above the selected toxicity threshold under the active endpoint context?

## Query Logic

- Main relation table: `compound_gene_map`
- Support tables:
  `compound_gene_card`, `compound_summary`, and `toxicity_endpoint`
- Grouping unit: `genesymbol`
- Toxicity aggregation:
  endpoint-specific distributions per gene
- Ranking order:
  `toxic_compound_count DESC`, then `max_prediction DESC`, then `genesymbol ASC`
- Default context:
  `endpoint_group=all`, `endpoint=avian`, `y_value.min=0`

For each gene, the executor computes:

- `toxic_compound_count`
- `compound_count`
- `ko_count`
- `median_toxicity`
- `p90_toxicity`
- `max_prediction`

## Filters and Parameters

| Parameter | Effect |
| --- | --- |
| `search` | Narrows by gene symbol or gene name |
| `endpoint_group` | Restricts the toxicity domain |
| `endpoint` | Chooses the endpoint used for scoring and distribution summaries |
| `y_value` | Defines the toxicity threshold window |
| `compound_count` | Inclusive total-compound window per gene |
| `toxic_compound_count` | Inclusive toxic-compound window per gene |
| `ko_count` | Inclusive KO-coverage window |

## Returned Entities

The table returns one row per ranked gene with:

- `rank`
- `genesymbol`
- `gene_name`
- `toxic_compound_count`
- `compound_count`
- `median_toxicity`
- `p90_toxicity`
- `ko_count`
- `max_prediction`

Selecting a row opens the gene detail page. If a row does not already expose a KO, the client can resolve it from the gene symbol before routing.

## Visualizations

- Boxplot:
  toxicity distribution per top-ranked gene under the selected endpoint
- Horizontal bar chart:
  genes ranked by `toxic_compound_count`
- Ranked table:
  paginated gene comparison under the same endpoint context

In the current client, the UC8 bar chart and boxplot are page-scoped so they stay aligned with the genes visible on the current table page.

## Interpretation

- Higher `toxic_compound_count` indicates stronger exploratory linkage to compounds above the selected predictive threshold.
- `median_toxicity` and `p90_toxicity` help distinguish broad moderate-risk association from a pattern driven by extreme upper-tail values.
- The page-scoped boxplot is particularly useful for comparing the currently visible leading genes rather than the entire ranked universe at once.

## Limitations

- Rankings are highly sensitive to endpoint selection and threshold choice.
- Gene-to-toxic-compound association does not establish causal toxicological mechanism or biodegradation effect.
- Because the charts are page-scoped in the client, changing the table page also changes the visual comparison set.

## Suggested Downstream Validation

1. Inspect the gene detail page and linked compounds.
2. Review the compounds driving the upper-tail toxicity values in the compound or toxicity explorers.
3. Validate any mechanistic interpretation with external datasets or experiments before drawing biological conclusions.

## Related Pages

- [Guided Analysis Overview](index.md)
- [Filters and Parameters](filters-and-parameters.md)
- [Genes and KEGG Orthologs Explorer](../explorers/genes-kos.md)
- [Toxicity Explorer](../explorers/toxicity.md)
