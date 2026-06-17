# UC4 - Compounds Regulated by Agency

This page documents `Regulated Compounds by Agency` (`uc4_regulated_by_agency`), which uses the `uc_regulated_by_agency` executor to inspect compounds linked to curated regulatory-reference labels such as EPA, ATSDR, and IARC categories.

## Scientific Question

Which compounds are annotated under selected regulatory-reference agency lists in the integrated BioRemPP database?

## Query Logic

- Dataset entry point: `compound_summary`
- Joined reference table: `compound_reference_map`
- Default agency scope:
  all available agencies
- Ranking order:
  `reference_count DESC`, then `cpd ASC`
- Summary cards distinguish compounds in the broader filtered scope from compounds that actually match the selected agency context

If a specific agency is selected, only compounds linked to that agency remain in the ranked table. If no agency is selected, the table summarizes all compounds with at least one reference-agency mapping.

## Filters and Parameters

| Parameter | Effect |
| --- | --- |
| `reference_ag` | Restricts the analysis to one regulatory-reference label |
| `search` | Narrows by compound name or CPD |
| `compoundclass` | Restricts the compound subset by class |
| `gene_count` | Optional annotation-breadth filter |
| `pathway_count` | Optional pathway-context filter |

## Returned Entities

The table returns one row per matched compound with:

- `rank`
- `cpd`
- `compoundname`
- `compoundclass`
- `matched_references`
- `reference_count`
- `gene_count`
- `pathway_count`

Selecting a row opens the corresponding compound detail page.

## Visualizations

- Horizontal bar chart:
  distinct compound counts by agency in the active scope
- Ranked table:
  compounds matched to the selected or aggregate agency context

## Interpretation

- Agency membership indicates curated reference presence in the database, not direct hazard severity.
- `reference_count` is best read as annotation density across reference mappings.
- This use case is useful for prioritization when regulatory attention is one dimension of a broader exploratory review.

## Limitations

- Regulatory-reference presence does not guarantee current jurisdictional status.
- Differences in `reference_count` may reflect curation structure rather than a meaningful regulatory ranking.
- The view does not resolve temporal updates or methodological differences across source frameworks.

## Suggested Downstream Validation

1. Review the exact agency labels attached to the compound in the table and compound detail page.
2. Confirm the current legal or regulatory status in the original source framework.
3. Combine regulatory context with toxicity and pathway evidence rather than interpreting the agency flag in isolation.

## Related Pages

- [Guided Analysis Overview](index.md)
- [Compounds Explorer](../explorers/compounds.md)
- [Toxicity Explorer](../explorers/toxicity.md)
