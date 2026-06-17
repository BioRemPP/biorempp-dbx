[**BioRemPPDBX Source Reference**](../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../README.md) / [features/guided-analysis/types](../README.md) / GuidedBoxplotGroup

# Interface: GuidedBoxplotGroup

Defined in: [src/features/guided-analysis/types.ts:362](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/guided-analysis/types.ts#L362)

Single boxplot group returned by guided query execution.

## Properties

### count

> **count**: `number`

Defined in: [src/features/guided-analysis/types.ts:368](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/guided-analysis/types.ts#L368)

Number of observations included in the group.

***

### id

> **id**: `string`

Defined in: [src/features/guided-analysis/types.ts:364](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/guided-analysis/types.ts#L364)

Stable group identifier.

***

### label

> **label**: `string`

Defined in: [src/features/guided-analysis/types.ts:366](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/guided-analysis/types.ts#L366)

Human-readable group label.

***

### max

> **max**: `number`

Defined in: [src/features/guided-analysis/types.ts:378](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/guided-analysis/types.ts#L378)

Maximum value included in the group.

***

### median

> **median**: `number`

Defined in: [src/features/guided-analysis/types.ts:374](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/guided-analysis/types.ts#L374)

Median value.

***

### min

> **min**: `number`

Defined in: [src/features/guided-analysis/types.ts:370](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/guided-analysis/types.ts#L370)

Minimum value included in the group.

***

### points?

> `optional` **points?**: [`GuidedBoxplotPoint`](GuidedBoxplotPoint.md)[]

Defined in: [src/features/guided-analysis/types.ts:380](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/guided-analysis/types.ts#L380)

Optional raw points exposed for drill-down or overlays.

***

### q1

> **q1**: `number`

Defined in: [src/features/guided-analysis/types.ts:372](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/guided-analysis/types.ts#L372)

First quartile value.

***

### q3

> **q3**: `number`

Defined in: [src/features/guided-analysis/types.ts:376](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/guided-analysis/types.ts#L376)

Third quartile value.
