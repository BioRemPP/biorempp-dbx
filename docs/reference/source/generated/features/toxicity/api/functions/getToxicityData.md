[**BioRemPPDBX Source Reference**](../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../README.md) / [features/toxicity/api](../README.md) / getToxicityData

# Function: getToxicityData()

> **getToxicityData**(`filters?`, `pagination?`): `Promise`\<[`PaginatedResponse`](../../../../shared/types/interfaces/PaginatedResponse.md)\<[`ToxicityEndpoint`](../../types/interfaces/ToxicityEndpoint.md)\>\>

Defined in: [src/features/toxicity/api.ts:65](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/toxicity/api.ts#L65)

Fetches a paginated list of toxicity endpoint rows.

## Parameters

### filters?

[`ToxicityFilters`](../../types/interfaces/ToxicityFilters.md) = `{}`

Toxicity filters forwarded to the backend.

### pagination?

[`PaginationParams`](../../../../shared/types/interfaces/PaginationParams.md) = `...`

Requested page and page size.

## Returns

`Promise`\<[`PaginatedResponse`](../../../../shared/types/interfaces/PaginatedResponse.md)\<[`ToxicityEndpoint`](../../types/interfaces/ToxicityEndpoint.md)\>\>

A paginated toxicity response.

## Throws

Error When the backend request fails.

## Remarks

The default request loads the first page with `50` rows, matching the standard explorer page
size used by the toxicity table.
