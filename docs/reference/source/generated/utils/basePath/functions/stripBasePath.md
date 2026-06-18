[**BioRemPPDBX Source Reference**](../../../README.md)

***

[BioRemPPDBX Source Reference](../../../README.md) / [utils/basePath](../README.md) / stripBasePath

# Function: stripBasePath()

> **stripBasePath**(`pathname`, `basePath`): `string`

Defined in: [src/utils/basePath.ts:35](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/utils/basePath.ts#L35)

Removes a normalized deployment base path from a pathname.

## Parameters

### pathname

`string`

Browser pathname or application-relative path to normalize.

### basePath

`string`

Configured application base path.

## Returns

`string`

The pathname without the deployment base path prefix.

## Remarks

Repeated prefixes are stripped defensively to tolerate paths that were prefixed more than once.
