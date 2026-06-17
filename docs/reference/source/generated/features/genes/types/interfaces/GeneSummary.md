[**BioRemPPDBX Source Reference**](../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../README.md) / [features/genes/types](../README.md) / GeneSummary

# Interface: GeneSummary

Defined in: [src/features/genes/types.ts:11](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/genes/types.ts#L11)

Summary row returned by gene explorer endpoints.

## Properties

### compound\_count

> **compound\_count**: `number`

Defined in: [src/features/genes/types.ts:19](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/genes/types.ts#L19)

Number of linked compounds.

***

### enzyme\_activities

> **enzyme\_activities**: `string`[]

Defined in: [src/features/genes/types.ts:23](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/genes/types.ts#L23)

Distinct enzyme activity labels linked to the gene.

***

### genename

> **genename**: `string` \| `null`

Defined in: [src/features/genes/types.ts:17](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/genes/types.ts#L17)

Preferred gene name when available.

***

### genesymbol

> **genesymbol**: `string` \| `null`

Defined in: [src/features/genes/types.ts:15](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/genes/types.ts#L15)

Preferred gene symbol when available.

***

### ko

> **ko**: `string`

Defined in: [src/features/genes/types.ts:13](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/genes/types.ts#L13)

KO identifier used as the canonical gene route key.

***

### pathway\_count

> **pathway\_count**: `number`

Defined in: [src/features/genes/types.ts:21](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/genes/types.ts#L21)

Number of linked pathways.

***

### updated\_at

> **updated\_at**: `string`

Defined in: [src/features/genes/types.ts:25](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/genes/types.ts#L25)

ISO-like timestamp indicating when the row was last refreshed.
