[**BioRemPPDBX Source Reference**](../../../README.md)

***

[BioRemPPDBX Source Reference](../../../README.md) / [utils/basePath](../README.md) / normalizeBasePath

# Function: normalizeBasePath()

> **normalizeBasePath**(`value?`): `string`

Defined in: [src/utils/basePath.ts:21](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/utils/basePath.ts#L21)

Normalizes a configured base path into a canonical form with a leading and trailing slash.

## Parameters

### value?

`string` \| `null`

Raw base path value from configuration or runtime environment.

## Returns

`string`

The normalized base path, or `/` when no subpath is configured.

## Remarks

Non-root base paths are always returned in slash-wrapped form such as `/dbx/` so downstream
helpers can compose and compare prefixes without handling multiple representations.
