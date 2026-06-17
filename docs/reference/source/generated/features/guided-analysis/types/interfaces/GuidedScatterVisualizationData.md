[**BioRemPPDBX Source Reference**](../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../README.md) / [features/guided-analysis/types](../README.md) / GuidedScatterVisualizationData

# Interface: GuidedScatterVisualizationData

Defined in: [src/features/guided-analysis/types.ts:328](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/guided-analysis/types.ts#L328)

Scatter visualization payload returned by guided query execution.

## Properties

### endpoint

> **endpoint**: `string`

Defined in: [src/features/guided-analysis/types.ts:342](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/guided-analysis/types.ts#L342)

Endpoint used to derive the y axis metric.

***

### points

> **points**: [`GuidedScatterPoint`](GuidedScatterPoint.md)[]

Defined in: [src/features/guided-analysis/types.ts:330](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/guided-analysis/types.ts#L330)

Points rendered by the scatter view.

***

### threshold\_basis

> **threshold\_basis**: `string`

Defined in: [src/features/guided-analysis/types.ts:346](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/guided-analysis/types.ts#L346)

Backend explanation for how thresholds were chosen.

***

### x\_field

> **x\_field**: `string`

Defined in: [src/features/guided-analysis/types.ts:336](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/guided-analysis/types.ts#L336)

Source field name used for the x axis metric.

***

### x\_scale

> **x\_scale**: `"log10p1"` \| `"linear"`

Defined in: [src/features/guided-analysis/types.ts:344](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/guided-analysis/types.ts#L344)

Scale mode applied to the x axis.

***

### x\_threshold

> **x\_threshold**: `number`

Defined in: [src/features/guided-analysis/types.ts:332](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/guided-analysis/types.ts#L332)

Threshold applied to the x axis.

***

### y\_field

> **y\_field**: `string`

Defined in: [src/features/guided-analysis/types.ts:338](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/guided-analysis/types.ts#L338)

Source field name used for the y axis metric.

***

### y\_metric\_label

> **y\_metric\_label**: `string`

Defined in: [src/features/guided-analysis/types.ts:340](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/guided-analysis/types.ts#L340)

Human-readable label for the y axis metric.

***

### y\_threshold

> **y\_threshold**: `number`

Defined in: [src/features/guided-analysis/types.ts:334](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/guided-analysis/types.ts#L334)

Threshold applied to the y axis.
