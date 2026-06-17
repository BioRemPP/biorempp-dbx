[**BioRemPPDBX Source Reference**](../../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../../README.md) / [features/compounds/utils/overviewAdapters](../README.md) / toKoBarItems

# Function: toKoBarItems()

> **toKoBarItems**(`rows`): `HorizontalBarItem`[]

Defined in: [src/features/compounds/utils/overviewAdapters.ts:21](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/compounds/utils/overviewAdapters.ts#L21)

Converts KO distribution rows into horizontal bar chart items.

## Parameters

### rows

[`KoBarDatum`](../../../types/interfaces/KoBarDatum.md)[]

KO distribution rows returned by the compound overview payload.

## Returns

`HorizontalBarItem`[]

Bar items ready for the shared horizontal bar chart.
