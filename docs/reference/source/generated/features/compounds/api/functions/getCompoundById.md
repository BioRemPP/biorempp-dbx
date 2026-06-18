[**BioRemPPDBX Source Reference**](../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../README.md) / [features/compounds/api](../README.md) / getCompoundById

# Function: getCompoundById()

> **getCompoundById**(`cpd`): `Promise`\<[`CompoundSummary`](../../types/interfaces/CompoundSummary.md) \| `null`\>

Defined in: [src/features/compounds/api.ts:56](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/compounds/api.ts#L56)

Fetches the summary record for a single compound.

## Parameters

### cpd

`string`

Compound identifier.

## Returns

`Promise`\<[`CompoundSummary`](../../types/interfaces/CompoundSummary.md) \| `null`\>

The compound summary, or `null` when the backend reports no matching compound.

## Throws

Error When the backend request fails.

## Remarks

The identifier is encoded into the path segment exactly as supplied by the caller.
