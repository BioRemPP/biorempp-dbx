# Compound Classes Explorer

## Purpose

The Compound Classes Explorer provides a class-level aggregation layer above individual compounds. It is designed for comparing groups such as aromatic, chlorinated, or nitrogen-containing compounds before moving into compound-specific detail.

This view is implemented by `src/features/compound-classes/pages/CompoundClassExplorer.tsx` and resolves detail routes through `/compound-classes/detail/{compoundclass}`.

## Route and API Surface

- View route: `/compound-classes`
- Detail route: `/compound-classes/detail/{compoundclass}`
- List endpoint: `GET /api/compound-classes`
- Detail endpoint used by the current UI: `GET /api/compound-classes/detail/overview`

## Main entities displayed

The explorer displays one aggregate row per compound class. Each row summarizes:

- number of compounds assigned to the class
- number of distinct KOs linked to class members
- number of distinct genes linked to class members
- number of distinct pathway annotations linked to class members

This makes the explorer useful for class-level prioritization before moving into pathway, gene, or compound detail pages.

## Search behavior

- Free-text search is case-insensitive and targets the compound-class label.
- Search is committed when the search action runs.
- Results are paginated in batches of `50`.
- Current server ordering is `compound_count DESC, compoundclass ASC`.

## Filtering behavior

The current UI keeps this explorer intentionally simple:

- `Search`: free-text filtering by class label

No separate dropdown or numeric filters are currently exposed for this explorer page.

## Table columns

| Column | Meaning |
| --- | --- |
| `Compound Class` | Curated class label used as the detail route key |
| `Compound Count` | Number of compounds assigned to the class |
| `KO Count` | Number of distinct KO identifiers linked to class members |
| `Gene Count` | Number of distinct genes linked to class members |
| `Pathway Annotations` | Number of distinct source-plus-pathway annotations linked to class members |

## Detail page structure

Selecting a class row opens a detail workspace with:

- header:
  class label and back navigation
- summary strip:
  `KOs`, `Genes`, `Compounds`, `Reactions`, `Sources`, and `Toxicity Coverage`
- chart row:
  `KO Distribution`, `Gene Distribution`, and `EC Number Overview`
- grouped toxicity matrix:
  compound-by-endpoint heatmap across the compounds in the selected class

Unlike the compound detail page, this workspace is fully chart-driven and does not currently include a dedicated member-compounds table.

## Linked entities

The class detail view links the selected class to:

- member compounds
- KO identifiers
- gene symbols
- EC classes
- pathway annotations and represented source catalogs
- toxicity endpoint rows for compounds in the class

## Visual summaries

| Visual summary | What it shows |
| --- | --- |
| Summary strip | Aggregate class counts plus toxicity coverage |
| KO Distribution | Top KOs ranked by number of class compounds they touch |
| Gene Distribution | Top genes ranked by number of class compounds they touch |
| EC Number Overview | Donut summary of EC-class composition within the class |
| Toxicity heatmap | Compound-by-endpoint matrix for class members with grouped toxicity headers |

## Example workflow

1. Open `/compound-classes`.
2. Search for a class of interest such as `Aromatic`.
3. Open the class row to review class-wide KO, gene, and EC distributions.
4. Use `Toxicity Coverage` to judge how much of the class has linked ToxCSM rows.
5. Move to the Compounds Explorer to inspect individual class members in more detail.

## Interpretation guidance

- Class-level counts summarize breadth across distinct compounds in the selected class. They do not represent abundance, prevalence, or environmental dominance.
- `Pathway Annotations` counts distinct source-plus-pathway combinations, so repeated pathway labels from different sources remain analytically distinguishable.
- `Toxicity Coverage` is the percentage of class compounds that currently have toxicity endpoint rows, not a class-wide risk score.
- KO and gene distributions are useful for identifying recurrent linked annotations within a chemical class. They do not confirm shared biological behavior for every compound in that class.

## Limitations

- The current explorer exposes only free-text class search.
- The detail page emphasizes charts and heatmaps; it does not currently list all member compounds in a dedicated table.
- Toxicity coverage varies by class because ToxCSM rows are not available uniformly for every compound.
- Compound classes reflect the current curation taxonomy of the integrated database and should not be treated as exhaustive chemical ontologies.
- Class-level associations remain database-derived and require downstream validation.

## Related pages

- [Explorers Overview](index.md)
- [Compounds Explorer](compounds.md)
- [Pathways Explorer](pathways.md)
- [Genes and KEGG Orthologs Explorer](genes-kos.md)
- [Database Schemas](../database-schema.md)
