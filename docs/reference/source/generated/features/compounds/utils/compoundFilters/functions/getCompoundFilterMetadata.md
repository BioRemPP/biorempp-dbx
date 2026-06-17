[**BioRemPPDBX Source Reference**](../../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../../README.md) / [features/compounds/utils/compoundFilters](../README.md) / getCompoundFilterMetadata

# Function: getCompoundFilterMetadata()

> **getCompoundFilterMetadata**(`compounds`): `object`

Defined in: [src/features/compounds/utils/compoundFilters.ts:93](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/compounds/utils/compoundFilters.ts#L93)

Derives option metadata from an in-memory compound result set.

## Parameters

### compounds

[`CompoundSummary`](../../../types/interfaces/CompoundSummary.md)[]

Compound summaries used to infer available filter values.

## Returns

`object`

Sorted unique values for compound classes, reference agencies, genes, and pathways.

### compoundClasses

> **compoundClasses**: `string`[]

### genes

> **genes**: `string`[]

### pathways

> **pathways**: `string`[]

### referenceAGs

> **referenceAGs**: `string`[]
