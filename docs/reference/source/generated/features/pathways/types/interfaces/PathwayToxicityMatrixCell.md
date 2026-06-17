[**BioRemPPDBX Source Reference**](../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../README.md) / [features/pathways/types](../README.md) / PathwayToxicityMatrixCell

# Interface: PathwayToxicityMatrixCell

Defined in: [src/features/pathways/types.ts:99](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/pathways/types.ts#L99)

Matrix cell representing one compound-endpoint toxicity value.

## Properties

### cpd

> **cpd**: `string`

Defined in: [src/features/pathways/types.ts:101](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/pathways/types.ts#L101)

Compound identifier associated with the current cell.

***

### endpoint

> **endpoint**: `string`

Defined in: [src/features/pathways/types.ts:103](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/pathways/types.ts#L103)

Toxicity endpoint identifier associated with the current cell.

***

### label

> **label**: `string` \| `null`

Defined in: [src/features/pathways/types.ts:105](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/pathways/types.ts#L105)

Optional human-readable endpoint label.

***

### risk\_bucket

> **risk\_bucket**: [`ToxicityRiskBucket`](../../../toxicity/types/type-aliases/ToxicityRiskBucket.md)

Defined in: [src/features/pathways/types.ts:109](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/pathways/types.ts#L109)

Backend-derived categorical risk bucket for the numeric value.

***

### value

> **value**: `number` \| `null`

Defined in: [src/features/pathways/types.ts:107](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/pathways/types.ts#L107)

Numeric toxicity value returned for the compound-endpoint pair.
