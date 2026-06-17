[**BioRemPPDBX Source Reference**](../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../README.md) / [features/compounds/types](../README.md) / CompoundOverviewResponse

# Interface: CompoundOverviewResponse

Defined in: [src/features/compounds/types.ts:125](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/compounds/types.ts#L125)

Quantitative overview payload returned by compound detail endpoints.

## Properties

### cpd

> **cpd**: `string`

Defined in: [src/features/compounds/types.ts:127](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/compounds/types.ts#L127)

Compound identifier requested by the client.

***

### ko\_bar

> **ko\_bar**: [`KoBarDatum`](KoBarDatum.md)[]

Defined in: [src/features/compounds/types.ts:138](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/compounds/types.ts#L138)

KO distribution used by the overview bar chart.

***

### limits

> **limits**: `object`

Defined in: [src/features/compounds/types.ts:129](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/compounds/types.ts#L129)

Requested limits used to shape top-ranked overview sections.

#### top\_ko

> **top\_ko**: `number`

Maximum number of KO rows returned in `ko_bar`.

#### top\_pathways

> **top\_pathways**: `number`

Maximum number of pathway rows returned per source section.

***

### metric\_basis

> **metric\_basis**: `object`

Defined in: [src/features/compounds/types.ts:146](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/compounds/types.ts#L146)

Metric descriptions explaining how overview aggregates were derived.

#### ko\_bar

> **ko\_bar**: `string`

Basis used to compute KO bar counts.

#### pathway\_coverage\_weight

> **pathway\_coverage\_weight**: `string`

Basis used to compute pathway coverage weights.

#### pathways\_top\_hadeg

> **pathways\_top\_hadeg**: `string`

Basis used to compute HADEG top pathway counts.

#### pathways\_top\_kegg

> **pathways\_top\_kegg**: `string`

Basis used to compute KEGG top pathway counts.

***

### pathway\_coverage

> **pathway\_coverage**: [`PathwayCoverageMatrix`](PathwayCoverageMatrix.md)

Defined in: [src/features/compounds/types.ts:144](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/compounds/types.ts#L144)

Cross-source pathway coverage matrix.

***

### pathways\_top\_hadeg

> **pathways\_top\_hadeg**: [`PathwayTopDatum`](PathwayTopDatum.md)[]

Defined in: [src/features/compounds/types.ts:142](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/compounds/types.ts#L142)

Top HADEG pathways linked to the compound.

***

### pathways\_top\_kegg

> **pathways\_top\_kegg**: [`PathwayTopDatum`](PathwayTopDatum.md)[]

Defined in: [src/features/compounds/types.ts:140](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/compounds/types.ts#L140)

Top KEGG pathways linked to the compound.

***

### summary

> **summary**: [`CompoundOverviewSummary`](CompoundOverviewSummary.md)

Defined in: [src/features/compounds/types.ts:136](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/compounds/types.ts#L136)

Aggregate counts and summary metrics for the compound.

***

### toxicity\_heatmap

> **toxicity\_heatmap**: [`ToxicityHeatmapDatum`](../../../toxicity/types/interfaces/ToxicityHeatmapDatum.md)[]

Defined in: [src/features/compounds/types.ts:157](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/compounds/types.ts#L157)

Endpoint-level toxicity values used by the overview heatmap.
