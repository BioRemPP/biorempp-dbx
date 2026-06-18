[**BioRemPPDBX Source Reference**](../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../README.md) / [features/compounds/api](../README.md) / getCompoundOverview

# Function: getCompoundOverview()

> **getCompoundOverview**(`cpd`, `options?`): `Promise`\<[`CompoundOverviewResponse`](../../types/interfaces/CompoundOverviewResponse.md)\>

Defined in: [src/features/compounds/api.ts:83](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/compounds/api.ts#L83)

Fetches the quantitative overview payload for a compound detail page.

## Parameters

### cpd

`string`

Compound identifier.

### options?

Optional limits for top-ranked overview sections.

#### top_ko?

`number`

#### top_pathways?

`number`

## Returns

`Promise`\<[`CompoundOverviewResponse`](../../types/interfaces/CompoundOverviewResponse.md)\>

The compound overview payload.

## Throws

Error When the backend request fails.

## Remarks

`top_ko` and `top_pathways` are omitted from the query string when the caller leaves them
undefined, allowing the backend defaults to remain authoritative.
