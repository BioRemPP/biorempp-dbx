[**BioRemPPDBX Source Reference**](../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../README.md) / [features/guided-analysis/types](../README.md) / GuidedScatterPoint

# Interface: GuidedScatterPoint

Defined in: [src/features/guided-analysis/types.ts:304](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/guided-analysis/types.ts#L304)

Point rendered by guided scatter-quadrant visualizations.

## Properties

### compoundclass

> **compoundclass**: `string` \| `null`

Defined in: [src/features/guided-analysis/types.ts:310](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/guided-analysis/types.ts#L310)

Compound class label when available.

***

### compoundname

> **compoundname**: `string` \| `null`

Defined in: [src/features/guided-analysis/types.ts:308](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/guided-analysis/types.ts#L308)

Compound display name when available.

***

### cpd

> **cpd**: `string`

Defined in: [src/features/guided-analysis/types.ts:306](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/guided-analysis/types.ts#L306)

Compound identifier represented by the point.

***

### gene\_count

> **gene\_count**: `number`

Defined in: [src/features/guided-analysis/types.ts:312](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/guided-analysis/types.ts#L312)

Number of genes linked to the compound.

***

### ko\_count

> **ko\_count**: `number`

Defined in: [src/features/guided-analysis/types.ts:314](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/guided-analysis/types.ts#L314)

Number of KO identifiers linked to the compound.

***

### pathway\_count

> **pathway\_count**: `number`

Defined in: [src/features/guided-analysis/types.ts:316](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/guided-analysis/types.ts#L316)

Number of pathways linked to the compound.

***

### quadrant

> **quadrant**: keyof [`GuidedQuadrantCounts`](GuidedQuadrantCounts.md)

Defined in: [src/features/guided-analysis/types.ts:322](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/guided-analysis/types.ts#L322)

Quadrant assignment derived by the backend.

***

### toxicity\_risk\_mean

> **toxicity\_risk\_mean**: `number` \| `null`

Defined in: [src/features/guided-analysis/types.ts:318](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/guided-analysis/types.ts#L318)

Mean toxicity risk score across supported endpoints.

***

### y\_value

> **y\_value**: `number`

Defined in: [src/features/guided-analysis/types.ts:320](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/guided-analysis/types.ts#L320)

Metric value plotted on the y axis.
