[**BioRemPPDBX Source Reference**](../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../README.md) / [features/compounds/api](../README.md) / getCompoundToxicityProfile

# Function: getCompoundToxicityProfile()

> **getCompoundToxicityProfile**(`cpd`, `pagination?`): `Promise`\<[`PaginatedResponse`](../../../../shared/types/interfaces/PaginatedResponse.md)\<[`ToxicityEndpoint`](../../../toxicity/types/interfaces/ToxicityEndpoint.md)\>\>

Defined in: [src/features/compounds/api.ts:155](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/compounds/api.ts#L155)

Fetches endpoint-level toxicity rows for a compound detail page.

## Parameters

### cpd

`string`

Compound identifier.

### pagination?

[`PaginationParams`](../../../../shared/types/interfaces/PaginationParams.md) = `...`

Requested page and page size.

## Returns

`Promise`\<[`PaginatedResponse`](../../../../shared/types/interfaces/PaginatedResponse.md)\<[`ToxicityEndpoint`](../../../toxicity/types/interfaces/ToxicityEndpoint.md)\>\>

A paginated list of toxicity endpoints linked to the compound.

## Throws

Error When the backend request fails.

## Remarks

This endpoint exposes one row per endpoint measurement rather than the compact toxicity summary
that appears in compound explorer rows.
