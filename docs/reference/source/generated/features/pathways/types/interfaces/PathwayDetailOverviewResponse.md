[**BioRemPPDBX Source Reference**](../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../README.md) / [features/pathways/types](../README.md) / PathwayDetailOverviewResponse

# Interface: PathwayDetailOverviewResponse

Defined in: [src/features/pathways/types.ts:127](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/pathways/types.ts#L127)

Full overview payload returned by pathway detail endpoints.

## Properties

### available\_sources

> **available\_sources**: `string`[]

Defined in: [src/features/pathways/types.ts:131](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/pathways/types.ts#L131)

Source catalogs available for the requested pathway.

***

### ec\_class\_distribution

> **ec\_class\_distribution**: [`PathwayEcClassDistributionDatum`](PathwayEcClassDistributionDatum.md)[]

Defined in: [src/features/pathways/types.ts:141](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/pathways/types.ts#L141)

EC class distribution used by pathway detail visualizations.

***

### gene\_distribution

> **gene\_distribution**: [`PathwayGeneDistributionDatum`](PathwayGeneDistributionDatum.md)[]

Defined in: [src/features/pathways/types.ts:139](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/pathways/types.ts#L139)

Gene distribution used by pathway detail visualizations.

***

### ko\_distribution

> **ko\_distribution**: [`PathwayKoDistributionDatum`](PathwayKoDistributionDatum.md)[]

Defined in: [src/features/pathways/types.ts:137](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/pathways/types.ts#L137)

KO distribution used by pathway detail visualizations.

***

### pathway

> **pathway**: `string`

Defined in: [src/features/pathways/types.ts:129](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/pathways/types.ts#L129)

Pathway requested by the client.

***

### selected\_source

> **selected\_source**: `string`

Defined in: [src/features/pathways/types.ts:133](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/pathways/types.ts#L133)

Source currently selected for the response payload.

***

### summary

> **summary**: [`PathwayOverviewSummary`](PathwayOverviewSummary.md)

Defined in: [src/features/pathways/types.ts:135](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/pathways/types.ts#L135)

Aggregate counts and coverage metrics for the pathway.

***

### toxicity\_matrix

> **toxicity\_matrix**: [`PathwayToxicityMatrix`](PathwayToxicityMatrix.md)

Defined in: [src/features/pathways/types.ts:143](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/pathways/types.ts#L143)

Toxicity matrix spanning compounds and toxicity endpoints.
