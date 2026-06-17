[**BioRemPPDBX Source Reference**](../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../README.md) / [features/genes/types](../README.md) / GeneDetailSummary

# Interface: GeneDetailSummary

Defined in: [src/features/genes/types.ts:31](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/genes/types.ts#L31)

Aggregate summary returned by gene detail endpoints.

## Properties

### compound\_class\_count

> **compound\_class\_count**: `number`

Defined in: [src/features/genes/types.ts:45](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/genes/types.ts#L45)

Number of distinct compound classes represented by linked compounds.

***

### compound\_count

> **compound\_count**: `number`

Defined in: [src/features/genes/types.ts:39](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/genes/types.ts#L39)

Number of linked compounds.

***

### enzyme\_activities

> **enzyme\_activities**: `string`[]

Defined in: [src/features/genes/types.ts:43](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/genes/types.ts#L43)

Distinct enzyme activity labels linked to the gene.

***

### genename

> **genename**: `string` \| `null`

Defined in: [src/features/genes/types.ts:37](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/genes/types.ts#L37)

Preferred gene name when available.

***

### genesymbol

> **genesymbol**: `string` \| `null`

Defined in: [src/features/genes/types.ts:35](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/genes/types.ts#L35)

Preferred gene symbol when available.

***

### ko

> **ko**: `string`

Defined in: [src/features/genes/types.ts:33](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/genes/types.ts#L33)

KO identifier used as the detail route key.

***

### pathway\_count

> **pathway\_count**: `number`

Defined in: [src/features/genes/types.ts:41](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/genes/types.ts#L41)

Number of linked pathways.

***

### reference\_agency\_count

> **reference\_agency\_count**: `number`

Defined in: [src/features/genes/types.ts:47](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/genes/types.ts#L47)

Number of distinct reference agencies represented by linked compounds.

***

### toxicity\_coverage\_pct

> **toxicity\_coverage\_pct**: `number` \| `null`

Defined in: [src/features/genes/types.ts:49](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/genes/types.ts#L49)

Percentage of linked compounds with toxicity coverage.

***

### updated\_at

> **updated\_at**: `string`

Defined in: [src/features/genes/types.ts:51](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/genes/types.ts#L51)

ISO-like timestamp indicating when the aggregate row was last refreshed.
