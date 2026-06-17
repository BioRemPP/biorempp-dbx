# UC7 - Most Connected Genes

This page documents `Most Connected Genes` (`uc7_genes_most_connected`). The query uses the `uc_gene_connectivity_ranking` executor to rank genes by the number of distinct compounds linked to each gene symbol.

## Scientific Question

Which genes are associated with the largest number of compounds in the current BioRemPP integrated scope?

## Query Logic

- Main relation table: `compound_gene_map`
- Support table: `compound_gene_card`
- Grouping unit: `genesymbol`
- Primary metric: `COUNT(DISTINCT cpd)` as `compound_count`
- Complementary metric: `COUNT(DISTINCT ko)` as `ko_count`
- Ranking order:
  `compound_count DESC`, then `genesymbol ASC`

The executor also resolves a representative `ko` and `gene_name` when available so the ranking can route into the gene detail page.

## Filters and Parameters

| Parameter | Effect |
| --- | --- |
| `search` | Narrows the scope by gene symbol or gene name |
| `compound_count` | Inclusive compound-connectivity window |
| `ko_count` | Inclusive KO-coverage window |

## Returned Entities

The table returns one row per gene symbol with:

- `rank`
- `genesymbol`
- `gene_name`
- `compound_count`
- `ko_count`

The client uses the row KO for drill-down and opens the corresponding gene detail page.

## Visualizations

- Horizontal bar chart:
  top genes by distinct linked compounds
- Ranked table:
  paginated gene comparison

## Interpretation

- Higher `compound_count` suggests greater annotation centrality across the compound landscape.
- `ko_count` provides a complementary view of whether the same gene context also spans broader KO coverage.
- This use case is best used to identify gene-level hubs for follow-up inspection in pathway and compound detail views.

## Limitations

- Connectivity does not measure gene expression, enzyme abundance, or catalytic importance.
- A highly connected gene may reflect curation density or identifier reuse rather than biological centrality.
- The ranking collapses potentially heterogeneous compound contexts into one summary row per gene symbol.

## Suggested Downstream Validation

1. Open the gene detail page to inspect linked compounds and pathways.
2. Compare the same gene against toxic-compound associations in UC8.
3. Use experimental or literature evidence before inferring mechanistic dominance from connectivity alone.

## Related Pages

- [Guided Analysis Overview](index.md)
- [Genes and KEGG Orthologs Explorer](../explorers/genes-kos.md)
- [UC8 - Genes Linked to Toxic Compounds](uc8-genes-linked-toxic-compounds.md)
