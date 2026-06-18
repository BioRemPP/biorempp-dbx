[**BioRemPPDBX Source Reference**](../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../README.md) / [features/compounds/api](../README.md) / getCompoundPathways

# Function: getCompoundPathways()

> **getCompoundPathways**(`cpd`, `pagination?`): `Promise`\<[`PaginatedResponse`](../../../../shared/types/interfaces/PaginatedResponse.md)\<[`CompoundPathwayCardRow`](../../types/interfaces/CompoundPathwayCardRow.md)\>\>

Defined in: [src/features/compounds/api.ts:131](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/compounds/api.ts#L131)

Fetches pathway associations for a compound detail page.

## Parameters

### cpd

`string`

Compound identifier.

### pagination?

[`PaginationParams`](../../../../shared/types/interfaces/PaginationParams.md) = `...`

Requested page and page size.

## Returns

`Promise`\<[`PaginatedResponse`](../../../../shared/types/interfaces/PaginatedResponse.md)\<[`CompoundPathwayCardRow`](../../types/interfaces/CompoundPathwayCardRow.md)\>\>

A paginated list of pathway association cards.

## Throws

Error When the backend request fails.

## Remarks

The default page size is `200`, which reflects the broader cardinality usually seen in pathway
associations compared with the explorer tables.
