[**BioRemPPDBX Source Reference**](../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../README.md) / [features/guided-analysis/utils](../README.md) / shouldValidateOptions

# Function: shouldValidateOptions()

> **shouldValidateOptions**(`filter`): `boolean`

Defined in: [src/features/guided-analysis/utils.ts:177](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/guided-analysis/utils.ts#L177)

Determines whether a filter's current value should be validated against an option list.

## Parameters

### filter

[`GuidedFilterDefinition`](../../types/interfaces/GuidedFilterDefinition.md)

Guided filter definition to inspect.

## Returns

`boolean`

`true` for filter types backed by explicit option lists.
