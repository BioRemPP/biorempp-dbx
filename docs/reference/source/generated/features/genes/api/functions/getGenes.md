[**BioRemPPDBX Source Reference**](../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../README.md) / [features/genes/api](../README.md) / getGenes

# Function: getGenes()

> **getGenes**(`filters?`, `pagination?`): `Promise`\<[`PaginatedResponse`](../../../../shared/types/interfaces/PaginatedResponse.md)\<[`GeneSummary`](../../types/interfaces/GeneSummary.md)\>\>

Defined in: [src/features/genes/api.ts:32](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/genes/api.ts#L32)

Fetches a paginated list of genes.

## Parameters

### filters?

[`GeneFilters`](../../types/interfaces/GeneFilters.md) = `{}`

Gene filters forwarded to the backend.

### pagination?

[`PaginationParams`](../../../../shared/types/interfaces/PaginationParams.md) = `...`

Requested page and page size.

## Returns

`Promise`\<[`PaginatedResponse`](../../../../shared/types/interfaces/PaginatedResponse.md)\<[`GeneSummary`](../../types/interfaces/GeneSummary.md)\>\>

A paginated gene response.

## Throws

Error When the backend request fails.

## Remarks

The default request loads the first page with `50` rows, matching the standard explorer page
size used by the gene table.
