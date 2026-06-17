[**BioRemPPDBX Source Reference**](../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../README.md) / [features/toxicity/types](../README.md) / ToxicityFilters

# Interface: ToxicityFilters

Defined in: [src/features/toxicity/types.ts:48](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/toxicity/types.ts#L48)

Filter parameters accepted by toxicity explorer endpoints.

## Properties

### compoundclass?

> `optional` **compoundclass?**: `string`

Defined in: [src/features/toxicity/types.ts:54](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/toxicity/types.ts#L54)

Compound class filter applied to linked compounds.

***

### endpoint?

> `optional` **endpoint?**: `string`

Defined in: [src/features/toxicity/types.ts:50](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/toxicity/types.ts#L50)

Exact endpoint identifier filter.

***

### label?

> `optional` **label?**: `string`

Defined in: [src/features/toxicity/types.ts:52](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/toxicity/types.ts#L52)

Exact endpoint label filter.

***

### search?

> `optional` **search?**: `string`

Defined in: [src/features/toxicity/types.ts:60](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/toxicity/types.ts#L60)

Free-text search term forwarded to the backend.

***

### value\_max?

> `optional` **value\_max?**: `number`

Defined in: [src/features/toxicity/types.ts:58](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/toxicity/types.ts#L58)

Inclusive upper bound for numeric toxicity values.

***

### value\_min?

> `optional` **value\_min?**: `number`

Defined in: [src/features/toxicity/types.ts:56](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/toxicity/types.ts#L56)

Inclusive lower bound for numeric toxicity values.
