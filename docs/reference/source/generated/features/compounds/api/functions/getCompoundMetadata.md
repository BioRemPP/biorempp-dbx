[**BioRemPPDBX Source Reference**](../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../README.md) / [features/compounds/api](../README.md) / getCompoundMetadata

# Function: getCompoundMetadata()

> **getCompoundMetadata**(`cpd`): `Promise`\<[`CompoundMetadata`](../../types/interfaces/CompoundMetadata.md)\>

Defined in: [src/features/compounds/api.ts:67](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/compounds/api.ts#L67)

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
