[**BioRemPPDBX Source Reference**](../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../README.md) / [features/guided-analysis/types](../README.md) / GuidedQueryOptionsResponse

# Interface: GuidedQueryOptionsResponse

Defined in: [src/features/guided-analysis/types.ts:275](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/guided-analysis/types.ts#L275)

Options payload returned for a specific guided query.

## Properties

### options

> **options**: `Record`\<`string`, [`GuidedFilterOption`](GuidedFilterOption.md)[]\>

Defined in: [src/features/guided-analysis/types.ts:279](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/guided-analysis/types.ts#L279)

Map of filter identifiers to their available options.

***

### query\_id

> **query\_id**: `string`

Defined in: [src/features/guided-analysis/types.ts:277](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/guided-analysis/types.ts#L277)

Guided query identifier that owns the returned option sets.
