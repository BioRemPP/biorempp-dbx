[**BioRemPPDBX Source Reference**](../../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../../README.md) / [features/compounds/utils/compoundFilters](../README.md) / applyCompoundFilters

# Function: applyCompoundFilters()

> **applyCompoundFilters**(`compounds`, `filters`): [`CompoundSummary`](../../../types/interfaces/CompoundSummary.md)[]

Defined in: [src/features/compounds/utils/compoundFilters.ts:40](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/compounds/utils/compoundFilters.ts#L40)

Applies client-side filter rules to a set of compound summaries.

## Parameters

### compounds

[`CompoundSummary`](../../../types/interfaces/CompoundSummary.md)[]

Compound summaries to evaluate.

### filters

[`CompoundFilters`](../../../types/interfaces/CompoundFilters.md)

Current explorer filter set.

## Returns

[`CompoundSummary`](../../../types/interfaces/CompoundSummary.md)[]

The subset of compounds that satisfy every active filter.

## Remarks

Empty filter values are ignored. The free-text search matches against the compound identifier and
the normalized compound name.
