[**BioRemPPDBX Source Reference**](../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../README.md) / [features/guided-analysis/types](../README.md) / GuidedHeatmapMatrixVisualizationData

# Interface: GuidedHeatmapMatrixVisualizationData

Defined in: [src/features/guided-analysis/types.ts:460](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/guided-analysis/types.ts#L460)

Heatmap matrix payload returned by guided query execution.

## Properties

### cells

> **cells**: [`GuidedHeatmapMatrixCell`](GuidedHeatmapMatrixCell.md)[]

Defined in: [src/features/guided-analysis/types.ts:472](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/guided-analysis/types.ts#L472)

Sparse matrix cells containing toxicity values.

***

### compounds

> **compounds**: [`GuidedHeatmapMatrixCompound`](GuidedHeatmapMatrixCompound.md)[]

Defined in: [src/features/guided-analysis/types.ts:468](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/guided-analysis/types.ts#L468)

Ordered compound headers used to render matrix columns.

***

### endpoints

> **endpoints**: `string`[]

Defined in: [src/features/guided-analysis/types.ts:470](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/guided-analysis/types.ts#L470)

Ordered toxicity endpoints used to render matrix rows or sub-rows.

***

### row\_label?

> `optional` **row\_label?**: `string`

Defined in: [src/features/guided-analysis/types.ts:464](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/guided-analysis/types.ts#L464)

Singular label used for matrix rows when present.

***

### row\_label\_plural?

> `optional` **row\_label\_plural?**: `string`

Defined in: [src/features/guided-analysis/types.ts:466](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/guided-analysis/types.ts#L466)

Plural label used for matrix rows when present.

***

### rows?

> `optional` **rows?**: [`GuidedHeatmapMatrixRow`](GuidedHeatmapMatrixRow.md)[]

Defined in: [src/features/guided-analysis/types.ts:462](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/guided-analysis/types.ts#L462)

Optional explicit row descriptors used by the matrix.

***

### total\_compounds\_in\_scope?

> `optional` **total\_compounds\_in\_scope?**: `number`

Defined in: [src/features/guided-analysis/types.ts:476](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/guided-analysis/types.ts#L476)

Total number of compounds available before client-side slicing.

***

### total\_rows\_in\_scope?

> `optional` **total\_rows\_in\_scope?**: `number`

Defined in: [src/features/guided-analysis/types.ts:474](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/guided-analysis/types.ts#L474)

Total number of rows available before client-side slicing.
