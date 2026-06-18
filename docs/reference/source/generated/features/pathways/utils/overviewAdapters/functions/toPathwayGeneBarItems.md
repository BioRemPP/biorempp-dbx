[**BioRemPPDBX Source Reference**](../../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../../README.md) / [features/pathways/utils/overviewAdapters](../README.md) / toPathwayGeneBarItems

# Function: toPathwayGeneBarItems()

> **toPathwayGeneBarItems**(`rows`): `HorizontalBarItem`[]

Defined in: [src/features/pathways/utils/overviewAdapters.ts:47](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/pathways/utils/overviewAdapters.ts#L47)

Converts pathway gene distribution rows into horizontal bar chart items.

## Parameters

### rows

[`PathwayGeneDistributionDatum`](../../../types/interfaces/PathwayGeneDistributionDatum.md)[]

Gene distribution rows returned by the pathway overview payload.

## Returns

`HorizontalBarItem`[]

Bar items ready for the shared horizontal bar chart.
