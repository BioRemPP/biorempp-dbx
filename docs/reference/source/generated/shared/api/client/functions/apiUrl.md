[**BioRemPPDBX Source Reference**](../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../README.md) / [shared/api/client](../README.md) / apiUrl

# Function: apiUrl()

> **apiUrl**(`path`): `string`

Defined in: [src/shared/api/client.ts:37](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/shared/api/client.ts#L37)

Resolves an application or API-relative path under the configured client base path.

## Parameters

### path

`string`

Relative path or API route to resolve.

## Returns

`string`

A pathname that is safe to pass to `fetch`.

## Remarks

Routes under `/api` are always rewritten to the internal API base path so frontend calls work
both at root deployments and under institutional subpaths.
