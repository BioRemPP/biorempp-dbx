[**BioRemPPDBX Source Reference**](../../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../../README.md) / [features/compounds/utils/overviewAdapters](../README.md) / toKoBarItems

# Function: toKoBarItems()

> **toKoBarItems**(`rows`): `HorizontalBarItem`[]

Defined in: [src/features/compounds/utils/overviewAdapters.ts:21](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/compounds/utils/overviewAdapters.ts#L21)

Converts KO distribution rows into horizontal bar chart items.

## Parameters

### rows

[`KoBarDatum`](../../../types/interfaces/KoBarDatum.md)[]

KO distribution rows returned by the compound overview payload.

## Returns

`HorizontalBarItem`[]

Bar items ready for the shared horizontal bar chart.
