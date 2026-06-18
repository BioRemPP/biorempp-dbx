[**BioRemPPDBX Source Reference**](../../../README.md)

***

[BioRemPPDBX Source Reference](../../../README.md) / [app/routes](../README.md) / getLegacyRedirectPath

# Function: getLegacyRedirectPath()

> **getLegacyRedirectPath**(`pathname`): `string` \| `null`

Defined in: [src/app/routes.ts:196](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/app/routes.ts#L196)

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
