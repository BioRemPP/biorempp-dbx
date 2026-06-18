[**BioRemPPDBX Source Reference**](../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../README.md) / [features/compounds/types](../README.md) / PathwayCoverageCell

# Interface: PathwayCoverageCell

Defined in: [src/features/compounds/types.ts:99](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/compounds/types.ts#L99)

Cell used to render compound pathway coverage matrices.

## Properties

### pathway

> **pathway**: `string`

Defined in: [src/features/compounds/types.ts:103](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/compounds/types.ts#L103)

Pathway name represented by the matrix row or column.

***

### present

> **present**: `number`

Defined in: [src/features/compounds/types.ts:105](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/compounds/types.ts#L105)

Presence flag used by the UI to mark whether the pathway is linked.

***

### source

> **source**: `string`

Defined in: [src/features/compounds/types.ts:101](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/compounds/types.ts#L101)

Source catalog represented by the matrix row or column.

***

### weight

> **weight**: `number`

Defined in: [src/features/compounds/types.ts:107](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/compounds/types.ts#L107)

Backend-derived weight used to rank or emphasize coverage.
