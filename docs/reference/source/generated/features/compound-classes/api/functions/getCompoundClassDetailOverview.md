[**BioRemPPDBX Source Reference**](../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../README.md) / [features/compound-classes/api](../README.md) / getCompoundClassDetailOverview

# Function: getCompoundClassDetailOverview()

> **getCompoundClassDetailOverview**(`compoundclass`): `Promise`\<[`CompoundClassDetailOverviewResponse`](../../types/interfaces/CompoundClassDetailOverviewResponse.md)\>

Defined in: [src/features/compound-classes/api.ts:53](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/compound-classes/api.ts#L53)

Fetches the overview dataset for a single compound class detail page.

## Parameters

### compoundclass

`string`

Compound class name used by the detail endpoint.

## Returns

`Promise`\<[`CompoundClassDetailOverviewResponse`](../../types/interfaces/CompoundClassDetailOverviewResponse.md)\>

The aggregated overview payload for the requested compound class.

## Throws

Error When the backend request fails.

## Remarks

The class name is forwarded as a query parameter because the backend detail overview endpoint is
query-driven rather than path-parameter-driven.
