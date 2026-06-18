[**BioRemPPDBX Source Reference**](../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../README.md) / [features/genes/api](../README.md) / getGeneAssociatedCompounds

# Function: getGeneAssociatedCompounds()

> **getGeneAssociatedCompounds**(`ko`, `pagination?`): `Promise`\<[`PaginatedResponse`](../../../../shared/types/interfaces/PaginatedResponse.md)\<[`GeneAssociatedCompoundRow`](../../types/interfaces/GeneAssociatedCompoundRow.md)\>\>

Defined in: [src/features/genes/api.ts:83](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/genes/api.ts#L83)

Fetches compounds associated with a gene detail page.

## Parameters

### ko

`string`

KO identifier.

### pagination?

[`PaginationParams`](../../../../shared/types/interfaces/PaginationParams.md) = `...`

Requested page and page size.

## Returns

`Promise`\<[`PaginatedResponse`](../../../../shared/types/interfaces/PaginatedResponse.md)\<[`GeneAssociatedCompoundRow`](../../types/interfaces/GeneAssociatedCompoundRow.md)\>\>

A paginated list of compounds associated with the gene.

## Throws

Error When the backend request fails.

## Remarks

The default page size is `25`, which keeps the associated-compounds card compact while still
surfacing a meaningful slice of the linked compound set.
