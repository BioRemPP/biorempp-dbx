[**BioRemPPDBX Source Reference**](../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../README.md) / [features/guided-analysis/api](../README.md) / executeGuidedQuery

# Function: executeGuidedQuery()

> **executeGuidedQuery**(`queryId`, `payload?`): `Promise`\<[`GuidedExecutionResponse`](../../types/interfaces/GuidedExecutionResponse.md)\>

Defined in: [src/features/guided-analysis/api.ts:76](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/guided-analysis/api.ts#L76)

Executes a guided analysis query.

## Parameters

### queryId

`string`

Guided query identifier.

### payload?

[`GuidedExecuteRequest`](../../types/interfaces/GuidedExecuteRequest.md) = `{}`

Execution payload containing filters and pagination options.

## Returns

`Promise`\<[`GuidedExecutionResponse`](../../types/interfaces/GuidedExecutionResponse.md)\>

The guided analysis execution response.

## Throws

Error When the backend request fails.

## Remarks

This wrapper performs a `POST` request directly because the endpoint requires a JSON body. The
shared [fetchJson](../../../../shared/api/client/functions/fetchJson.md) helper is not used here because the request method and headers differ
from the default GET-based wrappers in the other feature modules.
