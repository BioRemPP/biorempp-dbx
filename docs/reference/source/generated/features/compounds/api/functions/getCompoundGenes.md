[**BioRemPPDBX Source Reference**](../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../README.md) / [features/compounds/api](../README.md) / getCompoundGenes

# Function: getCompoundGenes()

> **getCompoundGenes**(`cpd`, `pagination?`): `Promise`\<[`PaginatedResponse`](../../../../shared/types/interfaces/PaginatedResponse.md)\<[`CompoundGeneCardRow`](../../types/interfaces/CompoundGeneCardRow.md)\>\>

Defined in: [src/features/compounds/api.ts:107](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/compounds/api.ts#L107)

Fetches gene associations for a compound detail page.

## Parameters

### cpd

`string`

Compound identifier.

### pagination?

[`PaginationParams`](../../../../shared/types/interfaces/PaginationParams.md) = `...`

Requested page and page size.

## Returns

`Promise`\<[`PaginatedResponse`](../../../../shared/types/interfaces/PaginatedResponse.md)\<[`CompoundGeneCardRow`](../../types/interfaces/CompoundGeneCardRow.md)\>\>

A paginated list of gene association cards.

## Throws

Error When the backend request fails.

## Remarks

The default page size is `100` because compound-gene associations are typically reviewed in
larger batches inside the detail card.
