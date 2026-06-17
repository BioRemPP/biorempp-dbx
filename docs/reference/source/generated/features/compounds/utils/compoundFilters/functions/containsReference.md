[**BioRemPPDBX Source Reference**](../../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../../README.md) / [features/compounds/utils/compoundFilters](../README.md) / containsReference

# Function: containsReference()

> **containsReference**(`compound`, `referenceAg`): `boolean`

Defined in: [src/features/compounds/utils/compoundFilters.ts:26](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/compounds/utils/compoundFilters.ts#L26)

Checks whether a compound summary includes a given reference agency label.

## Parameters

### compound

[`CompoundSummary`](../../../types/interfaces/CompoundSummary.md)

Compound summary being evaluated.

### referenceAg

`string`

Reference agency label to match.

## Returns

`boolean`

`true` when the compound references the provided agency.
