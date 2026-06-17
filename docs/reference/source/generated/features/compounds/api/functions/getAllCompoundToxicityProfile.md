[**BioRemPPDBX Source Reference**](../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../README.md) / [features/compounds/api](../README.md) / getAllCompoundToxicityProfile

# Function: getAllCompoundToxicityProfile()

> **getAllCompoundToxicityProfile**(`cpd`, `pageSize?`): `Promise`\<[`ToxicityEndpoint`](../../../toxicity/types/interfaces/ToxicityEndpoint.md)[]\>

Defined in: [src/features/compounds/api.ts:179](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/compounds/api.ts#L179)

Fetches all endpoint-level toxicity rows for a compound detail page.

## Parameters

### cpd

`string`

Compound identifier.

### pageSize?

`number` = `100`

Requested page size for the paginated backend calls.

## Returns

`Promise`\<[`ToxicityEndpoint`](../../../toxicity/types/interfaces/ToxicityEndpoint.md)[]\>

The concatenated list of toxicity endpoints linked to the compound.

## Throws

Error When any backend request fails.

## Remarks

The first page is loaded eagerly to discover `totalPages`. Remaining pages are then fetched in
parallel and concatenated in page order so downstream UI metrics always see the complete dataset.
