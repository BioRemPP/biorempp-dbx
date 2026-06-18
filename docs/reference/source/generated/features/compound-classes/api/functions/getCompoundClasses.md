[**BioRemPPDBX Source Reference**](../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../README.md) / [features/compound-classes/api](../README.md) / getCompoundClasses

# Function: getCompoundClasses()

> **getCompoundClasses**(`filters?`, `pagination?`): `Promise`\<[`PaginatedResponse`](../../../../shared/types/interfaces/PaginatedResponse.md)\<[`CompoundClassSummary`](../../types/interfaces/CompoundClassSummary.md)\>\>

Defined in: [src/features/compound-classes/api.ts:29](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/compound-classes/api.ts#L29)

Fetches a paginated list of compound classes.

## Parameters

### filters?

[`CompoundClassFilters`](../../types/interfaces/CompoundClassFilters.md) = `{}`

Compound class filters forwarded to the backend.

### pagination?

[`PaginationParams`](../../../../shared/types/interfaces/PaginationParams.md) = `...`

Requested page and page size.

## Returns

`Promise`\<[`PaginatedResponse`](../../../../shared/types/interfaces/PaginatedResponse.md)\<[`CompoundClassSummary`](../../types/interfaces/CompoundClassSummary.md)\>\>

A paginated compound class response.

## Throws

Error When the backend request fails.

## Remarks

The default request loads the first page with `50` rows, matching the standard explorer page
size used by the class table.
