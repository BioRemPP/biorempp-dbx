[**BioRemPPDBX Source Reference**](../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../README.md) / [features/guided-analysis/utils](../README.md) / getGuidedQueryPageSize

# Function: getGuidedQueryPageSize()

> **getGuidedQueryPageSize**(`query`): `number`

Defined in: [src/features/guided-analysis/utils.ts:91](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/guided-analysis/utils.ts#L91)

Resolves the default result page size declared by a guided query.

## Parameters

### query

[`GuidedQueryDefinition`](../../types/interfaces/GuidedQueryDefinition.md) \| `null`

Guided query definition whose default page size should be read.

## Returns

`number`

A positive page size capped to the range supported by the client.

## Remarks

The function falls back to `10` when the query is missing or when `defaults.page_size` is absent, non-numeric,
or not greater than zero. Valid values are truncated to integers and clamped to the inclusive range `1..200`.
