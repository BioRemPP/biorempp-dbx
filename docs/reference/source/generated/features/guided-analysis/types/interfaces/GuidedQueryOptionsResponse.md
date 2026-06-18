[**BioRemPPDBX Source Reference**](../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../README.md) / [features/guided-analysis/types](../README.md) / GuidedQueryOptionsResponse

# Interface: GuidedQueryOptionsResponse

Defined in: [src/features/guided-analysis/types.ts:275](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/guided-analysis/types.ts#L275)

Options payload returned for a specific guided query.

## Properties

### options

> **options**: `Record`\<`string`, [`GuidedFilterOption`](GuidedFilterOption.md)[]\>

Defined in: [src/features/guided-analysis/types.ts:279](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/guided-analysis/types.ts#L279)

Map of filter identifiers to their available options.

***

### query\_id

> **query\_id**: `string`

Defined in: [src/features/guided-analysis/types.ts:277](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/guided-analysis/types.ts#L277)

Guided query identifier that owns the returned option sets.
