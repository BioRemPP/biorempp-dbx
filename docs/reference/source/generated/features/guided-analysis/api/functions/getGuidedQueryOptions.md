[**BioRemPPDBX Source Reference**](../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../README.md) / [features/guided-analysis/api](../README.md) / getGuidedQueryOptions

# Function: getGuidedQueryOptions()

> **getGuidedQueryOptions**(`queryId`, `selectedFilters?`): `Promise`\<[`GuidedQueryOptionsResponse`](../../types/interfaces/GuidedQueryOptionsResponse.md)\>

Defined in: [src/features/guided-analysis/api.ts:56](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/guided-analysis/api.ts#L56)

Fetches filter options for a guided analysis query.

## Parameters

### queryId

`string`

Guided query identifier.

### selectedFilters?

`Record`\<`string`, `unknown`\> = `{}`

Current filter state serialized as request parameters.

## Returns

`Promise`\<[`GuidedQueryOptionsResponse`](../../types/interfaces/GuidedQueryOptionsResponse.md)\>

The available options for the requested guided query.

## Throws

Error When the backend request fails.

## Remarks

The `selectedFilters` object is serialized into the query string so dependent-select filters can
be recomputed server-side without issuing a workflow execution request.
