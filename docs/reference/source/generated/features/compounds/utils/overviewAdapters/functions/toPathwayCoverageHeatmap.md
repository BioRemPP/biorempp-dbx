[**BioRemPPDBX Source Reference**](../../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../../README.md) / [features/compounds/utils/overviewAdapters](../README.md) / toPathwayCoverageHeatmap

# Function: toPathwayCoverageHeatmap()

> **toPathwayCoverageHeatmap**(`matrix`): `object`

Defined in: [src/features/compounds/utils/overviewAdapters.ts:53](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/compounds/utils/overviewAdapters.ts#L53)

Converts a pathway coverage matrix into categorical heatmap inputs.

## Parameters

### matrix

[`PathwayCoverageMatrix`](../../../types/interfaces/PathwayCoverageMatrix.md)

Cross-source pathway coverage matrix returned by the overview payload.

## Returns

`object`

Axis labels and heatmap cells ready for the shared categorical heatmap.

### cells

> **cells**: `HeatmapCell`[]

### xLabels

> **xLabels**: `string`[]

### yLabels

> **yLabels**: `string`[]
