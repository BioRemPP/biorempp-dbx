[**BioRemPPDBX Source Reference**](../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../README.md) / [features/genes/api](../README.md) / getGeneByKo

# Function: getGeneByKo()

> **getGeneByKo**(`ko`): `Promise`\<[`GeneDetailSummary`](../../types/interfaces/GeneDetailSummary.md) \| `null`\>

Defined in: [src/features/genes/api.ts:56](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/genes/api.ts#L56)

Fetches the summary record for a single KO identifier.

## Parameters

### ko

`string`

KO identifier.

## Returns

`Promise`\<[`GeneDetailSummary`](../../types/interfaces/GeneDetailSummary.md) \| `null`\>

The gene summary, or `null` when the backend reports no matching gene.

## Throws

Error When the backend request fails.

## Remarks

The function targets the KO-oriented detail route and returns the detail summary contract rather
than the lighter explorer row type.
