[**BioRemPPDBX Source Reference**](../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../README.md) / [features/guided-analysis/types](../README.md) / GuidedBoxplotVisualizationData

# Interface: GuidedBoxplotVisualizationData

Defined in: [src/features/guided-analysis/types.ts:400](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/guided-analysis/types.ts#L400)

Boxplot visualization payload returned by guided query execution.

## Properties

### empty\_message

> **empty\_message**: `string`

Defined in: [src/features/guided-analysis/types.ts:404](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/guided-analysis/types.ts#L404)

Message shown when the chart has no groups.

***

### groups

> **groups**: [`GuidedBoxplotGroup`](GuidedBoxplotGroup.md)[]

Defined in: [src/features/guided-analysis/types.ts:402](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/guided-analysis/types.ts#L402)

Ordered boxplot groups rendered by the chart.

***

### y\_label?

> `optional` **y\_label?**: `string`

Defined in: [src/features/guided-analysis/types.ts:406](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/guided-analysis/types.ts#L406)

Optional y-axis label supplied by the backend.
