[**BioRemPPDBX Source Reference**](../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../README.md) / [features/toxicity/types](../README.md) / ToxicityHeatmapDatum

# Interface: ToxicityHeatmapDatum

Defined in: [src/features/toxicity/types.ts:14](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/toxicity/types.ts#L14)

Endpoint-level toxicity value rendered in heatmap-style views.

## Properties

### endpoint

> **endpoint**: `string`

Defined in: [src/features/toxicity/types.ts:16](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/toxicity/types.ts#L16)

Toxicity endpoint identifier used as the row or column key.

***

### label

> **label**: `string` \| `null`

Defined in: [src/features/toxicity/types.ts:18](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/toxicity/types.ts#L18)

Optional human-readable endpoint label returned by the backend.

***

### risk\_bucket

> **risk\_bucket**: [`ToxicityRiskBucket`](../type-aliases/ToxicityRiskBucket.md)

Defined in: [src/features/toxicity/types.ts:22](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/toxicity/types.ts#L22)

Risk bucket derived by the backend for the current endpoint value.

***

### value

> **value**: `number` \| `null`

Defined in: [src/features/toxicity/types.ts:20](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/toxicity/types.ts#L20)

Numeric toxicity value associated with the endpoint for the current compound.
