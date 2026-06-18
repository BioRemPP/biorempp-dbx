[**BioRemPPDBX Source Reference**](../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../README.md) / [features/guided-analysis/types](../README.md) / GuidedVisualizationResult

# Interface: GuidedVisualizationResult

Defined in: [src/features/guided-analysis/types.ts:507](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/guided-analysis/types.ts#L507)

Resolved visualization entry returned by guided query execution.

## Properties

### data

> **data**: [`GuidedVisualizationData`](../type-aliases/GuidedVisualizationData.md)

Defined in: [src/features/guided-analysis/types.ts:519](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/guided-analysis/types.ts#L519)

Visualization payload consumed by the corresponding renderer.

***

### data\_key

> **data\_key**: `string`

Defined in: [src/features/guided-analysis/types.ts:517](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/guided-analysis/types.ts#L517)

Key used to associate the resolved data with the definition.

***

### id

> **id**: `string`

Defined in: [src/features/guided-analysis/types.ts:509](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/guided-analysis/types.ts#L509)

Visualization identifier matching the query definition.

***

### subtitle

> **subtitle**: `string` \| `null`

Defined in: [src/features/guided-analysis/types.ts:515](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/guided-analysis/types.ts#L515)

Optional subtitle shown below the title.

***

### title

> **title**: `string`

Defined in: [src/features/guided-analysis/types.ts:513](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/guided-analysis/types.ts#L513)

Primary chart title shown in the UI.

***

### type

> **type**: [`GuidedVisualizationType`](../type-aliases/GuidedVisualizationType.md)

Defined in: [src/features/guided-analysis/types.ts:511](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/guided-analysis/types.ts#L511)

Visualization renderer used by the client.
