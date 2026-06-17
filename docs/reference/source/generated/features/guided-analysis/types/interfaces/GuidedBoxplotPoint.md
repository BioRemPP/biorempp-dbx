[**BioRemPPDBX Source Reference**](../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../README.md) / [features/guided-analysis/types](../README.md) / GuidedBoxplotPoint

# Interface: GuidedBoxplotPoint

Defined in: [src/features/guided-analysis/types.ts:386](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/guided-analysis/types.ts#L386)

Raw point optionally included in a guided boxplot group.

## Properties

### compoundname?

> `optional` **compoundname?**: `string` \| `null`

Defined in: [src/features/guided-analysis/types.ts:390](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/guided-analysis/types.ts#L390)

Compound display name when available.

***

### cpd

> **cpd**: `string`

Defined in: [src/features/guided-analysis/types.ts:388](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/guided-analysis/types.ts#L388)

Compound identifier represented by the point.

***

### endpoint?

> `optional` **endpoint?**: `string`

Defined in: [src/features/guided-analysis/types.ts:392](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/guided-analysis/types.ts#L392)

Endpoint associated with the toxicity value when relevant.

***

### toxicity\_value

> **toxicity\_value**: `number`

Defined in: [src/features/guided-analysis/types.ts:394](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/guided-analysis/types.ts#L394)

Numeric toxicity value represented by the point.
