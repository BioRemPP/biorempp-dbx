[**BioRemPPDBX Source Reference**](../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../README.md) / [features/compound-classes/types](../README.md) / CompoundClassSummary

# Interface: CompoundClassSummary

Defined in: [src/features/compound-classes/types.ts:16](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/compound-classes/types.ts#L16)

Summary row returned by compound class explorer endpoints.

## Properties

### compound\_count

> **compound\_count**: `number`

Defined in: [src/features/compound-classes/types.ts:20](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/compound-classes/types.ts#L20)

Number of compounds assigned to the class.

***

### compoundclass

> **compoundclass**: `string`

Defined in: [src/features/compound-classes/types.ts:18](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/compound-classes/types.ts#L18)

Compound class label used as the canonical route key.

***

### gene\_count

> **gene\_count**: `number`

Defined in: [src/features/compound-classes/types.ts:24](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/compound-classes/types.ts#L24)

Number of distinct genes linked to the class.

***

### ko\_count

> **ko\_count**: `number`

Defined in: [src/features/compound-classes/types.ts:22](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/compound-classes/types.ts#L22)

Number of distinct KO identifiers linked to the class.

***

### pathway\_count

> **pathway\_count**: `number`

Defined in: [src/features/compound-classes/types.ts:26](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/compound-classes/types.ts#L26)

Number of distinct pathways linked to the class.

***

### updated\_at

> **updated\_at**: `string` \| `null`

Defined in: [src/features/compound-classes/types.ts:28](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/compound-classes/types.ts#L28)

ISO-like timestamp indicating when the aggregate row was last refreshed.
