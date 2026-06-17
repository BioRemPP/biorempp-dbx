[**BioRemPPDBX Source Reference**](../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../README.md) / [features/compounds/api](../README.md) / getCompoundGenes

# Function: getCompoundGenes()

> **getCompoundGenes**(`cpd`, `pagination?`): `Promise`\<[`PaginatedResponse`](../../../../shared/types/interfaces/PaginatedResponse.md)\<[`CompoundGeneCardRow`](../../types/interfaces/CompoundGeneCardRow.md)\>\>

Defined in: [src/features/compounds/api.ts:107](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/compounds/api.ts#L107)

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
