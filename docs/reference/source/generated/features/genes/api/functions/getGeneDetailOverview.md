[**BioRemPPDBX Source Reference**](../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../README.md) / [features/genes/api](../README.md) / getGeneDetailOverview

# Function: getGeneDetailOverview()

> **getGeneDetailOverview**(`ko`): `Promise`\<[`GeneDetailOverviewResponse`](../../types/interfaces/GeneDetailOverviewResponse.md)\>

Defined in: [src/features/genes/api.ts:67](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/genes/api.ts#L67)

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
