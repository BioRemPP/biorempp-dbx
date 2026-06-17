# Compounds Explorer

## Purpose

The Compounds Explorer is the main compound-centric entry point into the BioRemPP Database Explorer. It supports browsing, filtering, and prioritizing compounds by integrated evidence spanning genes, pathway annotations, regulatory references, and toxicity coverage.

This view is implemented by `src/features/compounds/pages/CompoundExplorer.tsx` and resolves compound detail routes through `/compounds/{cpd}`.

## Route and API Surface

- View route: `/compounds`
- Detail route: `/compounds/{cpd}`
- List endpoint: `GET /api/compounds`
- Detail endpoints used by the current UI:
  - `GET /api/compounds/:cpd`
  - `GET /api/compounds/:cpd/overview`
  - `GET /api/compounds/:cpd/metadata`
  - `GET /api/compounds/:cpd/genes`
  - `GET /api/compounds/:cpd/toxicity-profile`
  - `GET /api/compounds/:cpd/kegg-image`

## Main entities displayed

The explorer displays one summary row per compound from `compound_summary`. Each row condenses:

- compound identity (`cpd`, preferred name, compound class)
- integrated functional breadth (`ko_count`, `gene_count`, `pathway_count`)
- regulatory coverage (`reference_count`)
- toxicity rollups (`toxicity_risk_mean`, `high_risk_endpoint_count`)

The table is designed to let users identify compounds with broad linked evidence before opening the dedicated detail workspace.

## Search behavior

- Free-text search is case-insensitive and targets compound name and compound ID.
- Search is committed only when the user runs the search action.
- Results are paginated in batches of `50`.
- Current server ordering is `gene_count DESC, cpd ASC`, so compounds with broader linked gene coverage appear first by default.

## Filtering behavior

The current UI exposes metadata-backed exact filters plus inclusive numeric thresholds.

- `Compound Class`: exact class match from `/api/meta/compound-classes`
- `Pathway Source`: exact source match using grouped pathway metadata
- `Pathway`: exact pathway match; when a source is selected, the pathway list is narrowed to that source
- `Gene`: exact gene symbol match from `/api/meta/genes`
- `Reference AG`: exact reference-agency match from `/api/meta/reference-ags`
- `Min KO Count` / `Max KO Count`: inclusive KO thresholds
- `Min Gene Count` / `Max Gene Count`: inclusive gene thresholds

Changing the pathway source may clear an incompatible pathway selection. Clearing filters resets the search term and returns to the unfiltered first page.

## Table columns

| Column | Meaning |
| --- | --- |
| `Compound ID` | Canonical compound identifier used for routing and API lookup |
| `Name` | Preferred compound name when available |
| `Class` | Curated compound-class label |
| `KO Count` | Number of linked KO identifiers |
| `Gene Count` | Number of linked genes |
| `Pathway Annotations` | Number of linked pathway annotations across the integrated pathway cards |
| `Toxicity Risk Mean` | Mean risk score derived from available toxicity endpoint rows |
| `High Risk Endpoints` | Count of linked endpoints currently classified as high risk |
| `References` | Count of linked regulatory-reference records; the row tooltip preserves the reference label string |

## Detail page structure

Selecting a row opens a compound detail workspace with three major areas.

- Header context:
  compound name, compound ID, KEGG structure thumbnail when available, and a quantitative overview grid
- `Overview` tab:
  `KO Coverage (Real Relations)`, `Top KEGG Pathways`, `Top HADEG Pathways`, and a grouped toxicity endpoint heatmap
- `Associated Genes` tab:
  paginated table of linked genes with `KO`, `Gene Symbol`, `Gene Name`, `Enzyme Activity`, and `EC`
- `Metadata` tab:
  identifiers and interoperability fields such as KEGG compound ID, ChEBI, SMILES, and source badges

The current UI summarizes pathway context through overview charts. It does not currently render a dedicated pathway-association table even though the backend exposes a pathway detail endpoint.

## Linked entities

The compound detail workspace links the selected compound to:

- KO identifiers
- gene symbols and gene names
- KEGG and HADEG pathway annotations
- reference-agency annotations
- toxicity endpoints and labels
- external chemical identifiers such as ChEBI and SMILES

## Visual summaries

| Visual summary | What it shows |
| --- | --- |
| Quantitative Overview | Compact counts for KO, gene, pathway, EC, enzyme activity, toxicity endpoints, and cross-reference coverage |
| KO Coverage (Real Relations) | Ranked KO-to-pathway relation counts for the selected compound |
| Top KEGG Pathways | Highest-support KEGG pathway annotations linked to the compound |
| Top HADEG Pathways | Highest-support HADEG pathway annotations linked to the compound |
| Toxicity Endpoints heatmap | Endpoint-level predictions grouped into toxicity domains with separate prediction and risk rows |

## Example workflow

1. Open `/compounds`.
2. Filter by `Compound Class` or `Reference AG` to narrow the candidate set.
3. Optionally choose a `Pathway Source` first, then a pathway, to keep the pathway list manageable.
4. Search for a known compound name or ID if a specific target is already known.
5. Open a compound row to compare KO coverage, source-specific pathway rankings, and toxicity endpoint patterns.
6. Use the `Associated Genes` tab to identify linked KO records for follow-up inspection in the Gene / KO Explorer.

## Interpretation guidance

- `KO Count` and `Gene Count` summarize linked annotation breadth, not abundance, expression, or catalytic activity.
- `Pathway Annotations` indicates how many pathway records are linked to the compound across curated sources. It should not be interpreted as pathway completeness or degradation certainty.
- `Toxicity Risk Mean` and `High Risk Endpoints` support prioritization and comparative inspection. They do not confirm toxicological behavior under real environmental exposure conditions.
- The overview ranking charts order linked relations by support counts inside the current database build. They do not estimate reaction rates or remediation efficacy.
- The KEGG structure thumbnail is an interoperability aid tied to the compound identifier, not evidence of experimental validation.

## Limitations

- Free-text search covers compound name and ID only. Gene and pathway constraints must be applied through the dedicated filters.
- Pathway filtering uses exact values from the current metadata catalog rather than fuzzy matching.
- The detail page currently exposes linked genes and metadata directly, while pathway associations remain summarized in charts rather than rendered as a dedicated table.
- Toxicity coverage is uneven across compounds. A missing toxicity profile should not be interpreted as low risk.
- Compound associations are database-derived and intended for exploratory analysis. Downstream validation remains necessary.

## Related pages

- [Explorers Overview](index.md)
- [Genes and KEGG Orthologs Explorer](genes-kos.md)
- [Pathways Explorer](pathways.md)
- [Toxicity Explorer](toxicity.md)
- [API Reference Overview](../api/index.md)
