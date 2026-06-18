[**BioRemPPDBX Source Reference**](../../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../../README.md) / [features/compounds/utils/overviewAdapters](../README.md) / toPathwayCoverageHeatmap

# Function: toPathwayCoverageHeatmap()

> **toPathwayCoverageHeatmap**(`matrix`): `object`

Defined in: [src/features/compounds/utils/overviewAdapters.ts:53](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/compounds/utils/overviewAdapters.ts#L53)

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
