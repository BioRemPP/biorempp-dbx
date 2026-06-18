[**BioRemPPDBX Source Reference**](../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../README.md) / [features/guided-analysis/types](../README.md) / GuidedHeatmapMatrixCell

# Interface: GuidedHeatmapMatrixCell

Defined in: [src/features/guided-analysis/types.ts:442](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/guided-analysis/types.ts#L442)

Sparse cell used by guided heatmap matrix visualizations.

## Properties

### cpd?

> `optional` **cpd?**: `string`

Defined in: [src/features/guided-analysis/types.ts:446](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/guided-analysis/types.ts#L446)

Optional compound identifier when the matrix is compound-oriented.

***

### endpoint

> **endpoint**: `string`

Defined in: [src/features/guided-analysis/types.ts:448](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/guided-analysis/types.ts#L448)

Toxicity endpoint identifier associated with the cell.

***

### label

> **label**: `string` \| `null`

Defined in: [src/features/guided-analysis/types.ts:450](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/guided-analysis/types.ts#L450)

Optional human-readable endpoint label.

***

### risk\_bucket

> **risk\_bucket**: `string`

Defined in: [src/features/guided-analysis/types.ts:454](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/guided-analysis/types.ts#L454)

Backend-derived categorical risk bucket string.

***

### row\_id?

> `optional` **row\_id?**: `string`

Defined in: [src/features/guided-analysis/types.ts:444](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/guided-analysis/types.ts#L444)

Optional row identifier when the matrix uses explicit rows.

***

### value

> **value**: `number` \| `null`

Defined in: [src/features/guided-analysis/types.ts:452](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/guided-analysis/types.ts#L452)

Numeric toxicity value associated with the cell.
