[**BioRemPPDBX Source Reference**](../../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../../README.md) / [features/toxicity/utils/endpointGroups](../README.md) / ToxicityFacetEndpoint

# Interface: ToxicityFacetEndpoint

Defined in: [src/features/toxicity/utils/endpointGroups.ts:22](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/toxicity/utils/endpointGroups.ts#L22)

Endpoint row normalized for grouped toxicity facet rendering.

## Properties

### endpoint

> **endpoint**: `string`

Defined in: [src/features/toxicity/utils/endpointGroups.ts:24](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/toxicity/utils/endpointGroups.ts#L24)

Raw endpoint identifier preserved from the backend payload.

***

### fullLabel

> **fullLabel**: `string`

Defined in: [src/features/toxicity/utils/endpointGroups.ts:28](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/toxicity/utils/endpointGroups.ts#L28)

Human-readable endpoint label derived for display.

***

### predictionValue

> **predictionValue**: `number` \| `null`

Defined in: [src/features/toxicity/utils/endpointGroups.ts:30](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/toxicity/utils/endpointGroups.ts#L30)

Numeric toxicity prediction value for the endpoint.

***

### riskBucket

> **riskBucket**: [`ToxicityRiskBucket`](../../../types/type-aliases/ToxicityRiskBucket.md)

Defined in: [src/features/toxicity/utils/endpointGroups.ts:32](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/toxicity/utils/endpointGroups.ts#L32)

Risk bucket assigned to the endpoint value.

***

### riskLabel

> **riskLabel**: `string` \| `null`

Defined in: [src/features/toxicity/utils/endpointGroups.ts:34](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/toxicity/utils/endpointGroups.ts#L34)

Optional backend-provided label associated with the risk bucket.

***

### shortLabel

> **shortLabel**: `string`

Defined in: [src/features/toxicity/utils/endpointGroups.ts:26](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/toxicity/utils/endpointGroups.ts#L26)

Short label used in compact facet layouts.
