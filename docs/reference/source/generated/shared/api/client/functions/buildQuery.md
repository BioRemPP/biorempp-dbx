[**BioRemPPDBX Source Reference**](../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../README.md) / [shared/api/client](../README.md) / buildQuery

# Function: buildQuery()

> **buildQuery**(`params`): `string`

Defined in: [src/shared/api/client.ts:58](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/shared/api/client.ts#L58)

Serializes query parameters while omitting empty values.

## Parameters

### params

`Record`\<`string`, `unknown`\>

Query parameter values keyed by parameter name.

## Returns

`string`

A leading-`?` query string or an empty string when no values are present.

## Remarks

`undefined`, `null`, and empty-string values are omitted from the serialized output.
All remaining values are stringified with `String(...)` before they are added to the URL.
