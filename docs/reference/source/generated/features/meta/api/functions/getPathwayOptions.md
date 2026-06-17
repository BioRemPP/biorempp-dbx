[**BioRemPPDBX Source Reference**](../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../README.md) / [features/meta/api](../README.md) / getPathwayOptions

# Function: getPathwayOptions()

> **getPathwayOptions**(): `Promise`\<[`PathwayOption`](../../types/interfaces/PathwayOption.md)[]\>

Defined in: [src/features/meta/api.ts:104](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/meta/api.ts#L104)

Fetches grouped pathway options for selectors that display pathway source metadata.

## Returns

`Promise`\<[`PathwayOption`](../../types/interfaces/PathwayOption.md)[]\>

A list of grouped pathway options.

## Throws

Error When the backend request fails.

## Remarks

This response preserves the grouped source metadata required by selectors that cannot rely on a
flat pathway list alone.
