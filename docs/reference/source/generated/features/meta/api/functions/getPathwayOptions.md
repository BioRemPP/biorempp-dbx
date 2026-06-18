[**BioRemPPDBX Source Reference**](../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../README.md) / [features/meta/api](../README.md) / getPathwayOptions

# Function: getPathwayOptions()

> **getPathwayOptions**(): `Promise`\<[`PathwayOption`](../../types/interfaces/PathwayOption.md)[]\>

Defined in: [src/features/meta/api.ts:104](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/meta/api.ts#L104)

Fetches grouped pathway options for selectors that display pathway source metadata.

## Returns

`Promise`\<[`PathwayOption`](../../types/interfaces/PathwayOption.md)[]\>

A list of grouped pathway options.

## Throws

Error When the backend request fails.

## Remarks

This response preserves the grouped source metadata required by selectors that cannot rely on a
flat pathway list alone.
