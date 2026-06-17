# Filters and Parameters

Guided Analysis uses declarative filters defined per query YAML and executed server-side. This page summarizes the filter vocabulary that is currently implemented and how parameter changes alter scope, ranking, and visualization outputs.

## Common Behavior

The filter panel is rendered by `GuidedFiltersPanel.tsx` and `GuidedFiltersBar.tsx`, but the effective parameter semantics come from the selected query definition and the backend engine.

- Query changes restore the defaults declared in the new query YAML.
- `Reset` restores the defaults of the currently selected query.
- Filter changes automatically trigger a new guided execution.
- Pagination is scope-aware and resets to the first page when filters change the query scope.
- Server-side execution receives only declared filter ids; unknown or non-whitelisted filters are rejected by the backend.
- Current bundled use cases all use a default `page_size` of `10`.

## Filter Control Types

| Control type | Current use | Behavior |
| --- | --- | --- |
| `search` | Compound, pathway, or gene text search | Free-text input updated directly in the current scope |
| `select` | Source, compound class, agency, risk mode, x-axis scale, endpoint group | Dropdown with an empty `All` option in the current UI |
| `dependent_select` | Toxicity endpoint | Option list is recomputed from the selected upstream context, especially `endpoint_group` |
| `number_range` | KO, gene, pathway, compound, toxic-compound, and toxicity-value thresholds | Inclusive `min` and `max` window when present |
| `toggle` | `Focus Cluster (Gene p95)` in UC3 | Boolean switch that enables scope-shaping logic |

## Option Providers

Three provider strategies are active in the current catalog.

| Provider | Current examples | Source |
| --- | --- | --- |
| `meta_endpoint` | Compound class, regulatory agency | Shared `/api/meta/*` endpoints |
| `static` | Source, risk mode, endpoint group, x-axis scale | Inline options declared in the query YAML |
| `query_derived` | Endpoint options | Derived from `toxicity_endpoint` and constrained by the current endpoint group |

## Common Parameter Families

### Search parameters

- `search` can target compounds by name or CPD, pathways by name, or genes by symbol/name, depending on the query.

### Annotation-breadth thresholds

- `ko_count`
- `gene_count`
- `pathway_count`
- `compound_count`
- `toxic_compound_count`

These values are used as inclusive numeric windows and should be interpreted as scope-defining constraints, not fixed scientific cutoffs.

### Toxicity-context parameters

- `risk_mode`
  `endpoint` versus `group_peak`
- `endpoint_group`
  `all`, `ecotoxicity`, `genotoxicity_carcinogenicity`, `nuclear_receptors`, `stress_response`, `organ_irritation`, `other`
- `endpoint`
  populated dynamically from the available endpoints within the selected group
- `y_value`
  used as a toxicity score window or threshold, depending on the use case

### Structure and ranking parameters

- `source`
  pathway-source scope for UC5 and UC6 with `all`, `KEGG`, `HADEG`, or `COMPOUND_PATHWAY`
- `reference_ag`
  regulatory-source filter for UC4
- `x_scale`
  `log10p1` or `linear` in UC3
- `focus_cluster`
  optional UC3 toggle that removes the extreme upper tail of `gene_count` using the filtered `p95` cutoff

## Dependent Endpoint Behavior

Endpoint filters deserve special attention because they are recalculated dynamically.

- The option list comes from the `toxicity_endpoint` table, not from a hardcoded frontend list.
- If `endpoint_group` changes, the available `endpoint` options change with it.
- In UC3, the endpoint selector can also expose a synthetic `mean` option when the group is `all`.
- If a previously selected endpoint becomes invalid under the new context, the client sanitizes the state and falls back to a valid option.

## Query-Specific Parameter Map

| Use case | Main parameters |
| --- | --- |
| UC1 | `search`, `compoundclass`, `ko_count`, `gene_count`, `pathway_count` |
| UC2 | `risk_mode`, `endpoint_group`, `endpoint`, `compoundclass`, `y_value`, `gene_count`, `pathway_count`, `search` |
| UC3 | `endpoint_group`, `endpoint`, `x_scale`, `compoundclass`, `gene_count`, `y_value`, `pathway_count`, `focus_cluster`, `search` |
| UC4 | `reference_ag`, `search`, `compoundclass`, `gene_count`, `pathway_count` |
| UC5 | `source`, `pathway`, `ko_count`, `compound_count` |
| UC6 | `source`, `pathway`, `risk_mode`, `endpoint_group`, `endpoint`, `y_value`, `compound_count`, `toxic_compound_count` |
| UC7 | `search`, `compound_count`, `ko_count` |
| UC8 | `search`, `endpoint_group`, `endpoint`, `y_value`, `compound_count`, `toxic_compound_count`, `ko_count` |

## Refresh and Failure Behavior

- During re-execution, the previous result set can remain visible while the page displays `Refreshing results...`.
- Dependent option failures do not block execution; the page shows a warning and keeps the existing controls available.
- Query options are loaded independently from execution so the filter UI can remain responsive even when the main query is stable.

## Interpretation Guidance

- Treat filters as scope declarations. Changing them changes the population, not just the formatting.
- Thresholds in guided analysis are analytical aids for exploratory comparison. They are not universal biological or toxicological boundaries.
- When comparing runs, always report the active endpoint context, source scope, and threshold windows because these parameters materially alter rankings.

## Related Pages

- [Guided Analysis Overview](index.md)
- [Output Interpretation](output-interpretation.md)
- [UC3 - Risk versus Bioremediation Potential](uc3-risk-vs-bioremediation-potential.md)
- [UC6 - Pathways Linked to Toxic Compounds](uc6-pathways-linked-toxic-compounds.md)
- [UC8 - Genes Linked to Toxic Compounds](uc8-genes-linked-toxic-compounds.md)
