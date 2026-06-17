# Genes and KEGG Orthologs Explorer

## Purpose

The Genes and KEGG Orthologs Explorer organizes the integrated database around KO-centric gene records. It is the main view for asking which compounds, pathway annotations, and toxicity-covered compounds are linked to a specific KO or gene symbol.

This view is implemented by `src/features/genes/pages/GeneExplorer.tsx` and resolves detail routes through `/genes/{ko}`.

## Route and API Surface

- View route: `/genes`
- Detail route: `/genes/{ko}`
- List endpoint: `GET /api/genes`
- Detail endpoints used by the current UI:
  - `GET /api/genes/:ko`
  - `GET /api/genes/:ko/overview`
  - `GET /api/genes/:ko/compounds`
  - `GET /api/genes/:ko/metadata`

## Main entities displayed

The explorer displays one row per KO-centric gene summary from `gene_summary`. Each row includes:

- KO identifier
- preferred gene symbol and gene name when available
- number of linked compounds
- number of linked pathways
- compact list of enzyme-activity labels

This makes the explorer suitable for moving from a KO or gene of interest toward the compounds and toxicity context connected to that record.

## Search behavior

- Free-text search is case-insensitive and targets gene symbol, gene name, and KO identifier.
- Search is committed when the search action runs.
- Results are paginated in batches of `50`.
- Current server ordering is `compound_count DESC, ko ASC`, which prioritizes genes linked to more compounds.

## Filtering behavior

The current UI intentionally keeps this explorer narrow and exposes:

- `Min Compound Count`: inclusive lower bound for linked compounds
- `Max Compound Count`: inclusive upper bound for linked compounds

The backend also supports an exact `genesymbol` filter, but the current explorer UI relies on the broader free-text search field instead of a separate gene-symbol dropdown.

## Table columns

| Column | Meaning |
| --- | --- |
| `KO` | Canonical KEGG Ortholog identifier used for routing |
| `Gene Symbol` | Preferred short gene label when available |
| `Gene Name` | Preferred full gene name when available |
| `Compound Count` | Number of linked compounds |
| `Pathway Count` | Number of linked pathway annotations |
| `Enzyme Activities` | Distinct activity labels; the UI shows up to two inline and summarizes overflow as `+n more` |

## Detail page structure

Selecting a gene row opens a detail workspace with three tabs.

- `Overview` tab:
  metric cards for linked compounds, toxicity-covered compounds, excluded compounds without ToxCSM coverage, endpoint count, and toxicity coverage percentage
- `Associated Compounds` tab:
  paginated compound table with drill-down to compound detail views
- `Metadata` tab:
  KO, gene symbol and name, EC numbers, ChEBI IDs, SMILES strings, reaction IDs, source badges, and quantitative coverage metrics

The overview tab renders a compound-by-endpoint toxicity heatmap. The compounds table is the main cross-link surface into the compound explorer workflow.

## Linked entities

The gene detail view links the selected KO record to:

- compounds
- compound classes
- pathway annotations across KEGG, HADEG, and BioRemPP pathway-class terms
- EC numbers
- ChEBI identifiers
- SMILES strings
- reaction IDs
- toxicity-covered compounds and their endpoint rows

## Visual summaries

| Visual summary | What it shows |
| --- | --- |
| Overview metric strip | Counts for linked compounds, toxicity-covered compounds, excluded compounds, endpoint count, and toxicity coverage |
| Toxicity heatmap | Compound-by-endpoint matrix grouped into toxicity domains such as ecotoxicity, nuclear receptors, stress response, and organ or irritation categories |

## Example workflow

1. Open `/genes`.
2. Search by KO, gene symbol, or gene name.
3. Apply a compound-count threshold to keep the result set focused on broader or narrower gene-linked coverage.
4. Open a gene row to inspect the toxicity coverage of its linked compounds.
5. Move to the `Associated Compounds` tab and open a compound detail page for compound-level pathway and metadata review.

## Interpretation guidance

- A gene row represents an orthology-level aggregation centered on the KO identifier. It should not be interpreted as strain-specific functional confirmation.
- `Compound Count` indicates how many compounds are linked to the KO in the current integrated database, not how often the KO occurs in environmental samples.
- `Pathway Count` summarizes linked annotations, not pathway flux or pathway completeness.
- `Excluded (No ToxCSM)` is useful when reading the heatmap because the visualization only covers compounds with available toxicity rows.
- Metadata identifiers such as EC, ChEBI, SMILES, and reaction IDs support interoperability and follow-up analysis, not biological validation on their own.

## Limitations

- The current explorer UI exposes only compound-count numeric filters in addition to search.
- The detail page does not currently render a dedicated pathway table even though pathway counts and pathway-source totals are available in metadata.
- Toxicity heatmaps are limited by ToxCSM coverage. Compounds without toxicity rows are counted but not visualized in the matrix itself.
- KO-centric aggregation does not capture taxonomy, expression, protein abundance, or reaction kinetics.
- Gene-linked relationships remain database-derived and require downstream validation.

## Related pages

- [Explorers Overview](index.md)
- [Compounds Explorer](compounds.md)
- [Pathways Explorer](pathways.md)
- [Toxicity Explorer](toxicity.md)
- [API Reference Overview](../api/index.md)
