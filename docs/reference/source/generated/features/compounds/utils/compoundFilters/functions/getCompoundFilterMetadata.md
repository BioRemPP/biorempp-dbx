[**BioRemPPDBX Source Reference**](../../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../../README.md) / [features/compounds/utils/compoundFilters](../README.md) / getCompoundFilterMetadata

# Function: getCompoundFilterMetadata()

> **getCompoundFilterMetadata**(`compounds`): `object`

Defined in: [src/features/compounds/utils/compoundFilters.ts:93](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/compounds/utils/compoundFilters.ts#L93)

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
