[**BioRemPPDBX Source Reference**](../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../README.md) / [features/compounds/api](../README.md) / getCompounds

# Function: getCompounds()

> **getCompounds**(`filters?`, `pagination?`): `Promise`\<[`PaginatedResponse`](../../../../shared/types/interfaces/PaginatedResponse.md)\<[`CompoundSummary`](../../types/interfaces/CompoundSummary.md)\>\>

Defined in: [src/features/compounds/api.ts:33](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/compounds/api.ts#L33)

Fetches a paginated list of compounds.

## Parameters

### filters?

[`CompoundFilters`](../../types/interfaces/CompoundFilters.md) = `{}`

Compound filters forwarded to the backend.

### pagination?

[`PaginationParams`](../../../../shared/types/interfaces/PaginationParams.md) = `...`

Requested page and page size.

## Returns

`Promise`\<[`PaginatedResponse`](../../../../shared/types/interfaces/PaginatedResponse.md)\<[`CompoundSummary`](../../types/interfaces/CompoundSummary.md)\>\>

A paginated compound response.

## Throws

Error When the backend request fails.

## Remarks

The default request loads the first page with `50` rows, matching the standard explorer page
size used by the compound table.
