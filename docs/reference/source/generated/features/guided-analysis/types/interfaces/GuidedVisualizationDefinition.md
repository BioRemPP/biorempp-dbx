[**BioRemPPDBX Source Reference**](../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../README.md) / [features/guided-analysis/types](../README.md) / GuidedVisualizationDefinition

# Interface: GuidedVisualizationDefinition

Defined in: [src/features/guided-analysis/types.ts:107](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/guided-analysis/types.ts#L107)

Visualization definition declared by a guided query.

## Properties

### data\_key

> **data\_key**: `string`

Defined in: [src/features/guided-analysis/types.ts:117](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/guided-analysis/types.ts#L117)

Key used to resolve the visualization data from execution results.

***

### id

> **id**: `string`

Defined in: [src/features/guided-analysis/types.ts:109](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/guided-analysis/types.ts#L109)

Stable visualization identifier.

***

### subtitle?

> `optional` **subtitle?**: `string`

Defined in: [src/features/guided-analysis/types.ts:115](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/guided-analysis/types.ts#L115)

Optional subtitle shown below the chart title.

***

### title

> **title**: `string`

Defined in: [src/features/guided-analysis/types.ts:113](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/guided-analysis/types.ts#L113)

Primary chart title shown in the UI.

***

### type

> **type**: [`GuidedVisualizationType`](../type-aliases/GuidedVisualizationType.md)

Defined in: [src/features/guided-analysis/types.ts:111](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/guided-analysis/types.ts#L111)

Visualization renderer used by the client.
