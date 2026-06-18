[**BioRemPPDBX Source Reference**](../../../README.md)

***

[BioRemPPDBX Source Reference](../../../README.md) / [utils/basePath](../README.md) / withBasePath

# Function: withBasePath()

> **withBasePath**(`pathname`, `basePath`): `string`

Defined in: [src/utils/basePath.ts:75](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/utils/basePath.ts#L75)

Prefixes a pathname with the configured deployment base path exactly once.

## Parameters

### pathname

`string`

Application-relative pathname to prefix.

### basePath

`string`

Configured application base path.

## Returns

`string`

The pathname resolved under the configured deployment base path.

## Remarks

The helper first strips any existing base-path prefix before reapplying it, which avoids
duplicating path segments when routes or assets are normalized more than once.
