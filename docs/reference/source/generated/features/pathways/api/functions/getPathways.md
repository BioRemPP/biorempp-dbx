[**BioRemPPDBX Source Reference**](../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../README.md) / [features/pathways/api](../README.md) / getPathways

# Function: getPathways()

> **getPathways**(`filters?`, `pagination?`): `Promise`\<[`PaginatedResponse`](../../../../shared/types/interfaces/PaginatedResponse.md)\<[`PathwaySummary`](../../types/interfaces/PathwaySummary.md)\>\>

Defined in: [src/features/pathways/api.ts:25](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/pathways/api.ts#L25)

Fetches a paginated list of pathways.

## Parameters

### filters?

[`PathwayFilters`](../../types/interfaces/PathwayFilters.md) = `{}`

Pathway filters forwarded to the backend.

### pagination?

[`PaginationParams`](../../../../shared/types/interfaces/PaginationParams.md) = `...`

Requested page and page size.

## Returns

`Promise`\<[`PaginatedResponse`](../../../../shared/types/interfaces/PaginatedResponse.md)\<[`PathwaySummary`](../../types/interfaces/PathwaySummary.md)\>\>

A paginated pathway response.

## Throws

Error When the backend request fails.

## Remarks

The default request loads the first page with `50` rows, matching the standard explorer page
size used by the pathway table.
