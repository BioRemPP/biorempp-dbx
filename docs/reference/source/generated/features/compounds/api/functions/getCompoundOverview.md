[**BioRemPPDBX Source Reference**](../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../README.md) / [features/compounds/api](../README.md) / getCompoundOverview

# Function: getCompoundOverview()

> **getCompoundOverview**(`cpd`, `options?`): `Promise`\<[`CompoundOverviewResponse`](../../types/interfaces/CompoundOverviewResponse.md)\>

Defined in: [src/features/compounds/api.ts:83](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/compounds/api.ts#L83)

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
