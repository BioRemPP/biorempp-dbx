[**BioRemPPDBX Source Reference**](../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../README.md) / [features/compounds/types](../README.md) / PathwayCoverageMatrix

# Interface: PathwayCoverageMatrix

Defined in: [src/features/compounds/types.ts:113](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/compounds/types.ts#L113)

Coverage matrix returned by compound overview endpoints.

## Properties

### cells

> **cells**: [`PathwayCoverageCell`](PathwayCoverageCell.md)[]

Defined in: [src/features/compounds/types.ts:119](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/compounds/types.ts#L119)

Sparse matrix cells combining source and pathway values.

***

### pathways

> **pathways**: `string`[]

Defined in: [src/features/compounds/types.ts:117](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/compounds/types.ts#L117)

Ordered pathway labels used by the matrix.

***

### sources

> **sources**: `string`[]

Defined in: [src/features/compounds/types.ts:115](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/compounds/types.ts#L115)

Ordered source labels used by the matrix.
