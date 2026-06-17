[**BioRemPPDBX Source Reference**](../../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../../README.md) / [features/pathways/utils/overviewAdapters](../README.md) / toPathwayGeneBarItems

# Function: toPathwayGeneBarItems()

> **toPathwayGeneBarItems**(`rows`): `HorizontalBarItem`[]

Defined in: [src/features/pathways/utils/overviewAdapters.ts:47](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/pathways/utils/overviewAdapters.ts#L47)

Converts pathway gene distribution rows into horizontal bar chart items.

## Parameters

### rows

[`PathwayGeneDistributionDatum`](../../../types/interfaces/PathwayGeneDistributionDatum.md)[]

Gene distribution rows returned by the pathway overview payload.

## Returns

`HorizontalBarItem`[]

Bar items ready for the shared horizontal bar chart.
