[**BioRemPPDBX Source Reference**](../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../README.md) / [features/meta/api](../README.md) / getUniqueGenes

# Function: getUniqueGenes()

> **getUniqueGenes**(): `Promise`\<`string`[]\>

Defined in: [src/features/meta/api.ts:80](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/meta/api.ts#L80)

Fetches the unique gene identifiers exposed by the metadata endpoints.

## Returns

`Promise`\<`string`[]\>

A list of unique gene values.

## Throws

Error When the backend request fails.

## Remarks

The backend currently returns flat string values, not the richer gene summary structures used by
the explorer API.
