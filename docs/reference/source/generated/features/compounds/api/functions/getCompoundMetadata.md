[**BioRemPPDBX Source Reference**](../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../README.md) / [features/compounds/api](../README.md) / getCompoundMetadata

# Function: getCompoundMetadata()

> **getCompoundMetadata**(`cpd`): `Promise`\<[`CompoundMetadata`](../../types/interfaces/CompoundMetadata.md)\>

Defined in: [src/features/compounds/api.ts:67](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/compounds/api.ts#L67)

Fetches metadata for a single compound detail page.

## Parameters

### cpd

`string`

Compound identifier.

## Returns

`Promise`\<[`CompoundMetadata`](../../types/interfaces/CompoundMetadata.md)\>

The compound metadata payload returned by the backend.

## Throws

Error When the backend request fails.
