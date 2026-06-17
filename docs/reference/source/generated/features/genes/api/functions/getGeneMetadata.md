[**BioRemPPDBX Source Reference**](../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../README.md) / [features/genes/api](../README.md) / getGeneMetadata

# Function: getGeneMetadata()

> **getGeneMetadata**(`ko`): `Promise`\<[`GeneMetadata`](../../types/interfaces/GeneMetadata.md)\>

Defined in: [src/features/genes/api.ts:102](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/genes/api.ts#L102)

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
