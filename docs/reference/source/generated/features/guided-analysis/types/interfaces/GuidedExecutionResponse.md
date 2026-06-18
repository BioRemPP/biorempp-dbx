[**BioRemPPDBX Source Reference**](../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../README.md) / [features/guided-analysis/types](../README.md) / GuidedExecutionResponse

# Interface: GuidedExecutionResponse

Defined in: [src/features/guided-analysis/types.ts:585](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/guided-analysis/types.ts#L585)

Full guided query execution payload returned by the backend.

## Properties

### filters\_applied

> **filters\_applied**: `Record`\<`string`, `unknown`\>

Defined in: [src/features/guided-analysis/types.ts:595](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/guided-analysis/types.ts#L595)

Normalized filters applied by the backend.

***

### meta

> **meta**: [`GuidedExecutionMeta`](GuidedExecutionMeta.md)

Defined in: [src/features/guided-analysis/types.ts:587](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/guided-analysis/types.ts#L587)

Execution metadata for pagination, thresholds, and timing.

***

### summary\_cards

> **summary\_cards**: [`GuidedSummaryCardResult`](GuidedSummaryCardResult.md)[]

Defined in: [src/features/guided-analysis/types.ts:589](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/guided-analysis/types.ts#L589)

Resolved summary cards for the current execution.

***

### table

> **table**: [`GuidedTableResult`](GuidedTableResult.md) \| `null`

Defined in: [src/features/guided-analysis/types.ts:593](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/guided-analysis/types.ts#L593)

Paginated table result when the query defines a table.

***

### visualizations

> **visualizations**: [`GuidedVisualizationResult`](GuidedVisualizationResult.md)[]

Defined in: [src/features/guided-analysis/types.ts:591](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/guided-analysis/types.ts#L591)

Resolved visualizations for the current execution.
