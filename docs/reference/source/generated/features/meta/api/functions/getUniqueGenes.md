[**BioRemPPDBX Source Reference**](../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../README.md) / [features/meta/api](../README.md) / getUniqueGenes

# Function: getUniqueGenes()

> **getUniqueGenes**(): `Promise`\<`string`[]\>

Defined in: [src/features/meta/api.ts:80](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/meta/api.ts#L80)

Fetches the unique gene identifiers exposed by the metadata endpoints.

## Returns

`Promise`\<`string`[]\>

A list of unique gene values.

## Throws

Error When the backend request fails.

## Remarks

The backend currently returns flat string values, not the richer gene summary structures used by
the explorer API.
