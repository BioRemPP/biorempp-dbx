[**BioRemPPDBX Source Reference**](../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../README.md) / [features/genes/api](../README.md) / getGeneDetailOverview

# Function: getGeneDetailOverview()

> **getGeneDetailOverview**(`ko`): `Promise`\<[`GeneDetailOverviewResponse`](../../types/interfaces/GeneDetailOverviewResponse.md)\>

Defined in: [src/features/genes/api.ts:67](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/genes/api.ts#L67)

Fetches the overview payload for a gene detail page.

## Parameters

### ko

`string`

KO identifier.

## Returns

`Promise`\<[`GeneDetailOverviewResponse`](../../types/interfaces/GeneDetailOverviewResponse.md)\>

The aggregated overview payload for the requested gene.

## Throws

Error When the backend request fails.
