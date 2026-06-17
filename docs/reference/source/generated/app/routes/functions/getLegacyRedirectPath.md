[**BioRemPPDBX Source Reference**](../../../README.md)

***

[BioRemPPDBX Source Reference](../../../README.md) / [app/routes](../README.md) / getLegacyRedirectPath

# Function: getLegacyRedirectPath()

> **getLegacyRedirectPath**(`pathname`): `string` \| `null`

Defined in: [src/app/routes.ts:196](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/app/routes.ts#L196)

Resolves redirect targets for deprecated client-side paths.

## Parameters

### pathname

`string`

Browser pathname to inspect.

## Returns

`string` \| `null`

The replacement application path, or `null` when no legacy redirect applies.

## Remarks

The returned value is already resolved under the configured deployment base path.
