[**BioRemPPDBX Source Reference**](../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../README.md) / [features/pathways/api](../README.md) / getPathwayDetailOverview

# Function: getPathwayDetailOverview()

> **getPathwayDetailOverview**(`pathway`, `options?`): `Promise`\<[`PathwayDetailOverviewResponse`](../../types/interfaces/PathwayDetailOverviewResponse.md)\>

Defined in: [src/features/pathways/api.ts:50](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/pathways/api.ts#L50)

Fetches the overview payload for a single pathway detail page.

## Parameters

### pathway

`string`

Pathway identifier or label expected by the backend.

### options?

Optional source scoping for pathway detail data.

#### source?

`string`

## Returns

`Promise`\<[`PathwayDetailOverviewResponse`](../../types/interfaces/PathwayDetailOverviewResponse.md)\>

The aggregated overview payload for the requested pathway.

## Throws

Error When the backend request fails.

## Remarks

The pathway name and optional source are forwarded as query parameters because the current
backend overview endpoint is query-driven even though the UI exposes path-based detail routes.
