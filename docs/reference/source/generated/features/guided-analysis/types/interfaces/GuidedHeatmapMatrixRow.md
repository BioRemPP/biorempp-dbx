[**BioRemPPDBX Source Reference**](../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../README.md) / [features/guided-analysis/types](../README.md) / GuidedHeatmapMatrixRow

# Interface: GuidedHeatmapMatrixRow

Defined in: [src/features/guided-analysis/types.ts:428](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/guided-analysis/types.ts#L428)

Row descriptor used by guided heatmap matrix visualizations.

## Properties

### id

> **id**: `string`

Defined in: [src/features/guided-analysis/types.ts:430](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/guided-analysis/types.ts#L430)

Stable row identifier used by matrix cells.

***

### label

> **label**: `string`

Defined in: [src/features/guided-analysis/types.ts:432](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/guided-analysis/types.ts#L432)

Primary row label shown in the UI.

***

### meta?

> `optional` **meta?**: `Record`\<`string`, `unknown`\>

Defined in: [src/features/guided-analysis/types.ts:436](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/guided-analysis/types.ts#L436)

Additional row metadata preserved for custom renderers.

***

### secondary\_label?

> `optional` **secondary\_label?**: `string` \| `null`

Defined in: [src/features/guided-analysis/types.ts:434](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/guided-analysis/types.ts#L434)

Optional secondary row label.
