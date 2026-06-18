[**BioRemPPDBX Source Reference**](../../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../../README.md) / [features/compounds/utils/compoundFilters](../README.md) / containsReference

# Function: containsReference()

> **containsReference**(`compound`, `referenceAg`): `boolean`

Defined in: [src/features/compounds/utils/compoundFilters.ts:26](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/compounds/utils/compoundFilters.ts#L26)

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
