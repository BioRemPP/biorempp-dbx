[**BioRemPPDBX Source Reference**](../../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../../README.md) / [features/compounds/utils/overviewAdapters](../README.md) / toPathwayTopItems

# Function: toPathwayTopItems()

> **toPathwayTopItems**(`rows`): `HorizontalBarItem`[]

Defined in: [src/features/compounds/utils/overviewAdapters.ts:37](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/compounds/utils/overviewAdapters.ts#L37)

Converts top-pathway rows into horizontal bar chart items.

## Parameters

### rows

[`PathwayTopDatum`](../../../types/interfaces/PathwayTopDatum.md)[]

Ranked pathway rows returned by the compound overview payload.

## Returns

`HorizontalBarItem`[]

Bar items ready for the shared horizontal bar chart.
