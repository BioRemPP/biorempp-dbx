[**BioRemPPDBX Source Reference**](../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../README.md) / [features/compounds/api](../README.md) / getCompoundById

# Function: getCompoundById()

> **getCompoundById**(`cpd`): `Promise`\<[`CompoundSummary`](../../types/interfaces/CompoundSummary.md) \| `null`\>

Defined in: [src/features/compounds/api.ts:56](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/compounds/api.ts#L56)

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
