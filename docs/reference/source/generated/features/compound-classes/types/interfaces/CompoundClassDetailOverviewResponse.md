[**BioRemPPDBX Source Reference**](../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../README.md) / [features/compound-classes/types](../README.md) / CompoundClassDetailOverviewResponse

# Interface: CompoundClassDetailOverviewResponse

Defined in: [src/features/compound-classes/types.ts:64](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/compound-classes/types.ts#L64)

Full overview payload returned by compound class detail endpoints.

## Properties

### compoundclass

> **compoundclass**: `string`

Defined in: [src/features/compound-classes/types.ts:66](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/compound-classes/types.ts#L66)

Compound class requested by the client.

***

### ec\_class\_distribution

> **ec\_class\_distribution**: [`PathwayEcClassDistributionDatum`](../../../pathways/types/interfaces/PathwayEcClassDistributionDatum.md)[]

Defined in: [src/features/compound-classes/types.ts:74](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/compound-classes/types.ts#L74)

EC class distribution reused by compound class overview charts.

***

### gene\_distribution

> **gene\_distribution**: [`PathwayGeneDistributionDatum`](../../../pathways/types/interfaces/PathwayGeneDistributionDatum.md)[]

Defined in: [src/features/compound-classes/types.ts:72](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/compound-classes/types.ts#L72)

Gene distribution reused by compound class overview charts.

***

### ko\_distribution

> **ko\_distribution**: [`PathwayKoDistributionDatum`](../../../pathways/types/interfaces/PathwayKoDistributionDatum.md)[]

Defined in: [src/features/compound-classes/types.ts:70](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/compound-classes/types.ts#L70)

KO distribution reused by compound class overview charts.

***

### summary

> **summary**: [`CompoundClassOverviewSummary`](CompoundClassOverviewSummary.md)

Defined in: [src/features/compound-classes/types.ts:68](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/compound-classes/types.ts#L68)

Aggregate counts and coverage metrics for the class.

***

### toxicity\_matrix

> **toxicity\_matrix**: [`PathwayToxicityMatrix`](../../../pathways/types/interfaces/PathwayToxicityMatrix.md)

Defined in: [src/features/compound-classes/types.ts:76](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/compound-classes/types.ts#L76)

Toxicity matrix reused by compound class overview charts.
