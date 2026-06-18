[**BioRemPPDBX Source Reference**](../../../README.md)

***

[BioRemPPDBX Source Reference](../../../README.md) / [shared/types](../README.md) / PaginatedResponse

# Interface: PaginatedResponse\<T\>

Defined in: [src/shared/types.ts:21](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/shared/types.ts#L21)

Standard paginated response shape returned by explorer-style endpoints.

## Type Parameters

### T

`T`

Row payload type contained in the `data` array.

## Properties

### data

> **data**: `T`[]

Defined in: [src/shared/types.ts:23](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/shared/types.ts#L23)

Page rows returned by the backend for the current request.

***

### page

> **page**: `number`

Defined in: [src/shared/types.ts:27](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/shared/types.ts#L27)

One-based page number returned in the response.

***

### pageSize

> **pageSize**: `number`

Defined in: [src/shared/types.ts:29](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/shared/types.ts#L29)

Maximum number of records returned per page.

***

### total

> **total**: `number`

Defined in: [src/shared/types.ts:25](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/shared/types.ts#L25)

Total number of records available for the current filter scope.

***

### totalPages

> **totalPages**: `number`

Defined in: [src/shared/types.ts:31](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/shared/types.ts#L31)

Total number of available pages for the current filter scope.
