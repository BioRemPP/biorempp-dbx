[**BioRemPPDBX Source Reference**](../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../README.md) / [features/pathways/types](../README.md) / PathwayOverviewSummary

# Interface: PathwayOverviewSummary

Defined in: [src/features/pathways/types.ts:37](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/pathways/types.ts#L37)

Quantitative summary returned by pathway overview endpoints.

## Properties

### compound\_count

> **compound\_count**: `number`

Defined in: [src/features/pathways/types.ts:47](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/pathways/types.ts#L47)

Number of distinct compounds linked to the pathway.

***

### gene\_count

> **gene\_count**: `number`

Defined in: [src/features/pathways/types.ts:45](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/pathways/types.ts#L45)

Number of distinct genes linked to the pathway.

***

### ko\_count

> **ko\_count**: `number`

Defined in: [src/features/pathways/types.ts:43](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/pathways/types.ts#L43)

Number of distinct KO identifiers linked to the pathway.

***

### ko\_overlap\_pct

> **ko\_overlap\_pct**: `number` \| `null`

Defined in: [src/features/pathways/types.ts:53](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/pathways/types.ts#L53)

Percentage overlap used by the backend to summarize KO coverage across sources.

***

### pathway

> **pathway**: `string`

Defined in: [src/features/pathways/types.ts:39](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/pathways/types.ts#L39)

Pathway currently being summarized.

***

### reaction\_ec\_count

> **reaction\_ec\_count**: `number`

Defined in: [src/features/pathways/types.ts:49](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/pathways/types.ts#L49)

Number of distinct reaction EC classes linked to the pathway.

***

### selected\_source

> **selected\_source**: `string`

Defined in: [src/features/pathways/types.ts:41](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/pathways/types.ts#L41)

Source selected to resolve the detail view.

***

### source\_count

> **source\_count**: `number`

Defined in: [src/features/pathways/types.ts:51](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/pathways/types.ts#L51)

Number of available source catalogs for the same pathway name.
