[**BioRemPPDBX Source Reference**](../../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../../README.md) / [features/compounds/utils/overviewAdapters](../README.md) / toPathwayTopItems

# Function: toPathwayTopItems()

> **toPathwayTopItems**(`rows`): `HorizontalBarItem`[]

Defined in: [src/features/compounds/utils/overviewAdapters.ts:37](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/compounds/utils/overviewAdapters.ts#L37)

Converts top-pathway rows into horizontal bar chart items.

## Parameters

### rows

[`PathwayTopDatum`](../../../types/interfaces/PathwayTopDatum.md)[]

Ranked pathway rows returned by the compound overview payload.

## Returns

`HorizontalBarItem`[]

Bar items ready for the shared horizontal bar chart.
