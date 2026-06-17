[**BioRemPPDBX Source Reference**](../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../README.md) / [features/compounds/types](../README.md) / CompoundOverviewSummary

# Interface: CompoundOverviewSummary

Defined in: [src/features/compounds/types.ts:49](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/compounds/types.ts#L49)

Reduced summary embedded in compound overview payloads.

## Properties

### compoundclass

> **compoundclass**: `string` \| `null`

Defined in: [src/features/compounds/types.ts:55](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/compounds/types.ts#L55)

Compound class label when available.

***

### compoundname

> **compoundname**: `string` \| `null`

Defined in: [src/features/compounds/types.ts:53](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/compounds/types.ts#L53)

Preferred compound name when available.

***

### cpd

> **cpd**: `string`

Defined in: [src/features/compounds/types.ts:51](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/compounds/types.ts#L51)

Compound identifier requested by the client.

***

### gene\_count

> **gene\_count**: `number`

Defined in: [src/features/compounds/types.ts:61](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/compounds/types.ts#L61)

Number of genes linked to the compound.

***

### high\_risk\_endpoint\_count

> **high\_risk\_endpoint\_count**: `number`

Defined in: [src/features/compounds/types.ts:67](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/compounds/types.ts#L67)

Number of linked endpoints currently classified as high risk.

***

### ko\_count

> **ko\_count**: `number`

Defined in: [src/features/compounds/types.ts:59](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/compounds/types.ts#L59)

Number of KO identifiers linked to the compound.

***

### pathway\_count

> **pathway\_count**: `number`

Defined in: [src/features/compounds/types.ts:63](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/compounds/types.ts#L63)

Number of pathways linked to the compound.

***

### reference\_count

> **reference\_count**: `number`

Defined in: [src/features/compounds/types.ts:57](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/compounds/types.ts#L57)

Number of reference records linked to the compound.

***

### toxicity\_risk\_mean

> **toxicity\_risk\_mean**: `number` \| `null`

Defined in: [src/features/compounds/types.ts:65](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/compounds/types.ts#L65)

Mean toxicity risk score across supported endpoints.
