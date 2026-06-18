[**BioRemPPDBX Source Reference**](../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../README.md) / [features/guided-analysis/types](../README.md) / GuidedCatalogResponse

# Interface: GuidedCatalogResponse

Defined in: [src/features/guided-analysis/types.ts:245](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/guided-analysis/types.ts#L245)

Catalog payload returned by guided analysis definition endpoints.

## Properties

### categories

> **categories**: [`GuidedCategory`](GuidedCategory.md)[]

Defined in: [src/features/guided-analysis/types.ts:251](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/guided-analysis/types.ts#L251)

Available guided analysis categories.

***

### generated\_at

> **generated\_at**: `string` \| `null`

Defined in: [src/features/guided-analysis/types.ts:255](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/guided-analysis/types.ts#L255)

Catalog generation timestamp when available.

***

### queries

> **queries**: [`GuidedQueryDefinition`](GuidedQueryDefinition.md)[]

Defined in: [src/features/guided-analysis/types.ts:253](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/guided-analysis/types.ts#L253)

Available guided analysis queries.

***

### title

> **title**: `string`

Defined in: [src/features/guided-analysis/types.ts:249](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/guided-analysis/types.ts#L249)

Catalog title shown in the guided analysis landing view.

***

### version

> **version**: `string`

Defined in: [src/features/guided-analysis/types.ts:247](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/guided-analysis/types.ts#L247)

Catalog version string.
