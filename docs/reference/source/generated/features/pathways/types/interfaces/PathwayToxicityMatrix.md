[**BioRemPPDBX Source Reference**](../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../README.md) / [features/pathways/types](../README.md) / PathwayToxicityMatrix

# Interface: PathwayToxicityMatrix

Defined in: [src/features/pathways/types.ts:115](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/pathways/types.ts#L115)

Heatmap payload used by pathway and gene detail views.

## Properties

### cells

> **cells**: [`PathwayToxicityMatrixCell`](PathwayToxicityMatrixCell.md)[]

Defined in: [src/features/pathways/types.ts:121](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/pathways/types.ts#L121)

Sparse matrix cells containing compound-endpoint toxicity values.

***

### compounds

> **compounds**: [`PathwayToxicityMatrixCompound`](PathwayToxicityMatrixCompound.md)[]

Defined in: [src/features/pathways/types.ts:117](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/pathways/types.ts#L117)

Ordered compound headers used to render matrix columns.

***

### endpoints

> **endpoints**: `string`[]

Defined in: [src/features/pathways/types.ts:119](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/pathways/types.ts#L119)

Ordered toxicity endpoints used to render matrix rows.
