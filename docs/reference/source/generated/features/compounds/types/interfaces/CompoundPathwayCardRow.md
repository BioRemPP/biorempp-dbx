[**BioRemPPDBX Source Reference**](../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../README.md) / [features/compounds/types](../README.md) / CompoundPathwayCardRow

# Interface: CompoundPathwayCardRow

Defined in: [src/features/compounds/types.ts:311](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/compounds/types.ts#L311)

Pathway association row returned by compound detail endpoints.

## Properties

### cpd

> **cpd**: `string`

Defined in: [src/features/compounds/types.ts:313](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/compounds/types.ts#L313)

Compound identifier requested by the client.

***

### pathway

> **pathway**: `string`

Defined in: [src/features/compounds/types.ts:317](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/compounds/types.ts#L317)

Pathway name linked to the compound.

***

### source

> **source**: `string`

Defined in: [src/features/compounds/types.ts:315](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/compounds/types.ts#L315)

Source catalog that contributed the pathway association.

***

### supporting\_rows

> **supporting\_rows**: `number`

Defined in: [src/features/compounds/types.ts:319](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/compounds/types.ts#L319)

Number of supporting rows contributing to the association.

***

### updated\_at

> **updated\_at**: `string`

Defined in: [src/features/compounds/types.ts:321](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/compounds/types.ts#L321)

ISO-like timestamp indicating when the row was last refreshed.
