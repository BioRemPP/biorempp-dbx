[**BioRemPPDBX Source Reference**](../../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../../README.md) / [features/pathways/utils/overviewAdapters](../README.md) / toPathwayKoBarItems

# Function: toPathwayKoBarItems()

> **toPathwayKoBarItems**(`rows`): `HorizontalBarItem`[]

Defined in: [src/features/pathways/utils/overviewAdapters.ts:31](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/pathways/utils/overviewAdapters.ts#L31)

Converts pathway KO distribution rows into horizontal bar chart items.

## Parameters

### rows

[`PathwayKoDistributionDatum`](../../../types/interfaces/PathwayKoDistributionDatum.md)[]

KO distribution rows returned by the pathway overview payload.

## Returns

`HorizontalBarItem`[]

Bar items ready for the shared horizontal bar chart.
