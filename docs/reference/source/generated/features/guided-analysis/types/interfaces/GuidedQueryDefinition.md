[**BioRemPPDBX Source Reference**](../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../README.md) / [features/guided-analysis/types](../README.md) / GuidedQueryDefinition

# Interface: GuidedQueryDefinition

Defined in: [src/features/guided-analysis/types.ts:209](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/guided-analysis/types.ts#L209)

Guided query definition returned by the catalog endpoint.

## Properties

### category

> **category**: `string`

Defined in: [src/features/guided-analysis/types.ts:213](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/guided-analysis/types.ts#L213)

Category identifier grouping the query in the catalog.

***

### dataset

> **dataset**: `string`

Defined in: [src/features/guided-analysis/types.ts:221](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/guided-analysis/types.ts#L221)

Dataset identifier used by the backend executor.

***

### defaults

> **defaults**: `Record`\<`string`, `unknown`\>

Defined in: [src/features/guided-analysis/types.ts:225](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/guided-analysis/types.ts#L225)

Default filter and option values applied before execution.

***

### description

> **description**: `string`

Defined in: [src/features/guided-analysis/types.ts:219](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/guided-analysis/types.ts#L219)

Narrative description of what the query investigates.

***

### executor

> **executor**: `string`

Defined in: [src/features/guided-analysis/types.ts:223](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/guided-analysis/types.ts#L223)

Executor identifier used by the backend to run the query.

***

### executor\_config

> **executor\_config**: `Record`\<`string`, `unknown`\>

Defined in: [src/features/guided-analysis/types.ts:227](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/guided-analysis/types.ts#L227)

Executor-specific configuration forwarded to the backend.

***

### filters

> **filters**: [`GuidedFilterDefinition`](GuidedFilterDefinition.md)[]

Defined in: [src/features/guided-analysis/types.ts:229](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/guided-analysis/types.ts#L229)

Filter controls available for the query.

***

### id

> **id**: `string`

Defined in: [src/features/guided-analysis/types.ts:211](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/guided-analysis/types.ts#L211)

Stable query identifier used in route state and API requests.

***

### methods\_modal

> **methods\_modal**: [`GuidedMethodsModal`](GuidedMethodsModal.md)

Defined in: [src/features/guided-analysis/types.ts:233](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/guided-analysis/types.ts#L233)

Methods modal content shown in the guided analysis UI.

***

### question

> **question**: `string`

Defined in: [src/features/guided-analysis/types.ts:217](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/guided-analysis/types.ts#L217)

User-facing question phrased by the query.

***

### summary\_cards

> **summary\_cards**: [`GuidedSummaryCardDefinition`](GuidedSummaryCardDefinition.md)[]

Defined in: [src/features/guided-analysis/types.ts:235](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/guided-analysis/types.ts#L235)

Summary cards configured for the query.

***

### table

> **table**: [`GuidedTableDefinition`](GuidedTableDefinition.md) \| `null`

Defined in: [src/features/guided-analysis/types.ts:239](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/guided-analysis/types.ts#L239)

Table definition configured for the query, when present.

***

### title

> **title**: `string`

Defined in: [src/features/guided-analysis/types.ts:215](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/guided-analysis/types.ts#L215)

Display title shown to users.

***

### use\_case\_description

> **use\_case\_description**: [`GuidedUseCaseDescription`](GuidedUseCaseDescription.md)

Defined in: [src/features/guided-analysis/types.ts:231](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/guided-analysis/types.ts#L231)

Use-case narrative shown in the guided analysis UI.

***

### visualizations

> **visualizations**: [`GuidedVisualizationDefinition`](GuidedVisualizationDefinition.md)[]

Defined in: [src/features/guided-analysis/types.ts:237](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/guided-analysis/types.ts#L237)

Visualization definitions configured for the query.
