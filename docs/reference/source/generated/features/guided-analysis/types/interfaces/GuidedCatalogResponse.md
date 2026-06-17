[**BioRemPPDBX Source Reference**](../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../README.md) / [features/guided-analysis/types](../README.md) / GuidedCatalogResponse

# Interface: GuidedCatalogResponse

Defined in: [src/features/guided-analysis/types.ts:245](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/guided-analysis/types.ts#L245)

Catalog payload returned by guided analysis definition endpoints.

## Properties

### categories

> **categories**: [`GuidedCategory`](GuidedCategory.md)[]

Defined in: [src/features/guided-analysis/types.ts:251](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/guided-analysis/types.ts#L251)

Available guided analysis categories.

***

### generated\_at

> **generated\_at**: `string` \| `null`

Defined in: [src/features/guided-analysis/types.ts:255](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/guided-analysis/types.ts#L255)

Catalog generation timestamp when available.

***

### queries

> **queries**: [`GuidedQueryDefinition`](GuidedQueryDefinition.md)[]

Defined in: [src/features/guided-analysis/types.ts:253](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/guided-analysis/types.ts#L253)

Available guided analysis queries.

***

### title

> **title**: `string`

Defined in: [src/features/guided-analysis/types.ts:249](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/guided-analysis/types.ts#L249)

Catalog title shown in the guided analysis landing view.

***

### version

> **version**: `string`

Defined in: [src/features/guided-analysis/types.ts:247](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/guided-analysis/types.ts#L247)

Catalog version string.
