[**BioRemPPDBX Source Reference**](../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../README.md) / [features/guided-analysis/types](../README.md) / GuidedHeatmapMatrixCompound

# Interface: GuidedHeatmapMatrixCompound

Defined in: [src/features/guided-analysis/types.ts:412](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/guided-analysis/types.ts#L412)

Compound header entry used by guided heatmap matrix visualizations.

## Properties

### compoundclass?

> `optional` **compoundclass?**: `string` \| `null`

Defined in: [src/features/guided-analysis/types.ts:418](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/guided-analysis/types.ts#L418)

Compound class label when available.

***

### compoundname

> **compoundname**: `string` \| `null`

Defined in: [src/features/guided-analysis/types.ts:416](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/guided-analysis/types.ts#L416)

Compound display name when available.

***

### cpd

> **cpd**: `string`

Defined in: [src/features/guided-analysis/types.ts:414](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/guided-analysis/types.ts#L414)

Compound identifier used as the matrix column key.

***

### endpoint\_used?

> `optional` **endpoint\_used?**: `string` \| `null`

Defined in: [src/features/guided-analysis/types.ts:422](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/guided-analysis/types.ts#L422)

Endpoint actually used to compute the secondary value when relevant.

***

### y\_value?

> `optional` **y\_value?**: `number` \| `null`

Defined in: [src/features/guided-analysis/types.ts:420](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/guided-analysis/types.ts#L420)

Optional secondary numeric value associated with the compound.
