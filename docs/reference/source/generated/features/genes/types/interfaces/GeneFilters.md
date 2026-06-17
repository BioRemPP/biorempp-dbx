[**BioRemPPDBX Source Reference**](../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../README.md) / [features/genes/types](../README.md) / GeneFilters

# Interface: GeneFilters

Defined in: [src/features/genes/types.ts:215](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/genes/types.ts#L215)

Filter parameters accepted by gene explorer endpoints.

## Properties

### compound\_count\_max?

> `optional` **compound\_count\_max?**: `number`

Defined in: [src/features/genes/types.ts:221](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/genes/types.ts#L221)

Inclusive upper bound for linked compound counts.

***

### compound\_count\_min?

> `optional` **compound\_count\_min?**: `number`

Defined in: [src/features/genes/types.ts:219](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/genes/types.ts#L219)

Inclusive lower bound for linked compound counts.

***

### genesymbol?

> `optional` **genesymbol?**: `string`

Defined in: [src/features/genes/types.ts:217](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/genes/types.ts#L217)

Exact gene symbol filter.

***

### search?

> `optional` **search?**: `string`

Defined in: [src/features/genes/types.ts:223](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/genes/types.ts#L223)

Free-text search term forwarded to the backend.
