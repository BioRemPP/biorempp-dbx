[**BioRemPPDBX Source Reference**](../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../README.md) / [shared/api/client](../README.md) / fetchJson

# Function: fetchJson()

> **fetchJson**\<`T`\>(`url`): `Promise`\<`T`\>

Defined in: [src/shared/api/client.ts:82](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/shared/api/client.ts#L82)

Fetches JSON from an internal application route and throws on non-success responses.

## Type Parameters

### T

`T`

Expected JSON payload shape.

## Parameters

### url

`string`

Application-relative or API-relative URL.

## Returns

`Promise`\<`T`\>

The parsed JSON response body.

## Throws

Error When the HTTP response is not successful.

## Remarks

Error messages prefer the raw response body when one is available, which helps feature-level UIs
surface backend validation or failure text without duplicating fetch logic in every module.
