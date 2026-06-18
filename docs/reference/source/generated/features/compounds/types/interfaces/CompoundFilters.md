[**BioRemPPDBX Source Reference**](../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../README.md) / [features/compounds/types](../README.md) / CompoundFilters

# Interface: CompoundFilters

Defined in: [src/features/compounds/types.ts:259](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/compounds/types.ts#L259)

Filter parameters accepted by compound explorer endpoints.

## Properties

### compoundclass?

> `optional` **compoundclass?**: `string`

Defined in: [src/features/compounds/types.ts:261](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/compounds/types.ts#L261)

Compound class filter.

***

### gene?

> `optional` **gene?**: `string`

Defined in: [src/features/compounds/types.ts:269](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/compounds/types.ts#L269)

Exact gene symbol or identifier filter.

***

### gene\_count\_max?

> `optional` **gene\_count\_max?**: `number`

Defined in: [src/features/compounds/types.ts:277](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/compounds/types.ts#L277)

Inclusive upper bound for gene counts.

***

### gene\_count\_min?

> `optional` **gene\_count\_min?**: `number`

Defined in: [src/features/compounds/types.ts:275](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/compounds/types.ts#L275)

Inclusive lower bound for gene counts.

***

### ko\_count\_max?

> `optional` **ko\_count\_max?**: `number`

Defined in: [src/features/compounds/types.ts:273](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/compounds/types.ts#L273)

Inclusive upper bound for KO counts.

***

### ko\_count\_min?

> `optional` **ko\_count\_min?**: `number`

Defined in: [src/features/compounds/types.ts:271](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/compounds/types.ts#L271)

Inclusive lower bound for KO counts.

***

### pathway?

> `optional` **pathway?**: `string`

Defined in: [src/features/compounds/types.ts:267](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/compounds/types.ts#L267)

Exact pathway filter.

***

### pathway\_source?

> `optional` **pathway\_source?**: `string`

Defined in: [src/features/compounds/types.ts:265](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/compounds/types.ts#L265)

Pathway source filter.

***

### reference\_ag?

> `optional` **reference\_ag?**: `string`

Defined in: [src/features/compounds/types.ts:263](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/compounds/types.ts#L263)

Reference agency filter.

***

### search?

> `optional` **search?**: `string`

Defined in: [src/features/compounds/types.ts:279](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/compounds/types.ts#L279)

Free-text search term forwarded to the backend.
