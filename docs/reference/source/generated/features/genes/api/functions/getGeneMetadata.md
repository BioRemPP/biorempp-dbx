[**BioRemPPDBX Source Reference**](../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../README.md) / [features/genes/api](../README.md) / getGeneMetadata

# Function: getGeneMetadata()

> **getGeneMetadata**(`ko`): `Promise`\<[`GeneMetadata`](../../types/interfaces/GeneMetadata.md)\>

Defined in: [src/features/genes/api.ts:102](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/genes/api.ts#L102)

Fetches metadata and cross-reference details for a gene.

## Parameters

### ko

`string`

KO identifier.

## Returns

`Promise`\<[`GeneMetadata`](../../types/interfaces/GeneMetadata.md)\>

The gene metadata payload returned by the backend.

## Throws

Error When the backend request fails.
