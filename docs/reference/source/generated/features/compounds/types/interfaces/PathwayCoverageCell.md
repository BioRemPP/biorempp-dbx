[**BioRemPPDBX Source Reference**](../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../README.md) / [features/compounds/types](../README.md) / PathwayCoverageCell

# Interface: PathwayCoverageCell

Defined in: [src/features/compounds/types.ts:99](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/compounds/types.ts#L99)

Cell used to render compound pathway coverage matrices.

## Properties

### pathway

> **pathway**: `string`

Defined in: [src/features/compounds/types.ts:103](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/compounds/types.ts#L103)

Pathway name represented by the matrix row or column.

***

### present

> **present**: `number`

Defined in: [src/features/compounds/types.ts:105](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/compounds/types.ts#L105)

Presence flag used by the UI to mark whether the pathway is linked.

***

### source

> **source**: `string`

Defined in: [src/features/compounds/types.ts:101](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/compounds/types.ts#L101)

Source catalog represented by the matrix row or column.

***

### weight

> **weight**: `number`

Defined in: [src/features/compounds/types.ts:107](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/compounds/types.ts#L107)

Backend-derived weight used to rank or emphasize coverage.
