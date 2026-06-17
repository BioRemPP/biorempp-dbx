[**BioRemPPDBX Source Reference**](../../../README.md)

***

[BioRemPPDBX Source Reference](../../../README.md) / [utils/basePath](../README.md) / withBasePath

# Function: withBasePath()

> **withBasePath**(`pathname`, `basePath`): `string`

Defined in: [src/utils/basePath.ts:75](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/utils/basePath.ts#L75)

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
