[**BioRemPPDBX Source Reference**](../../../README.md)

***

[BioRemPPDBX Source Reference](../../../README.md) / [utils/basePath](../README.md) / getClientBasePath

# Function: getClientBasePath()

> **getClientBasePath**(): `string`

Defined in: [src/utils/basePath.ts:100](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/utils/basePath.ts#L100)

Resolves the client-side base path from Vite environment configuration.

## Returns

`string`

The normalized base path derived from `VITE_BIOREMPP_URL_BASE_PATH` or `BASE_URL`.

## Remarks

`VITE_BIOREMPP_URL_BASE_PATH` takes precedence over Vite's `BASE_URL` when both are present.
