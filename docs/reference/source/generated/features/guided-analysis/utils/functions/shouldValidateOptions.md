[**BioRemPPDBX Source Reference**](../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../README.md) / [features/guided-analysis/utils](../README.md) / shouldValidateOptions

# Function: shouldValidateOptions()

> **shouldValidateOptions**(`filter`): `boolean`

Defined in: [src/features/guided-analysis/utils.ts:177](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/guided-analysis/utils.ts#L177)

Determines whether a filter's current value should be validated against an option list.

## Parameters

### filter

[`GuidedFilterDefinition`](../../types/interfaces/GuidedFilterDefinition.md)

Guided filter definition to inspect.

## Returns

`boolean`

`true` for filter types backed by explicit option lists.
