[**BioRemPPDBX Source Reference**](../../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../../README.md) / [features/pathways/utils/overviewAdapters](../README.md) / toPathwayEcDonutSlices

# Function: toPathwayEcDonutSlices()

> **toPathwayEcDonutSlices**(`rows`): `DonutSlice`[]

Defined in: [src/features/pathways/utils/overviewAdapters.ts:63](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/pathways/utils/overviewAdapters.ts#L63)

Converts pathway EC class rows into donut-chart slices.

## Parameters

### rows

[`PathwayEcClassDistributionDatum`](../../../types/interfaces/PathwayEcClassDistributionDatum.md)[]

EC class distribution rows returned by the pathway overview payload.

## Returns

`DonutSlice`[]

Donut slices ready for the shared donut chart component.
