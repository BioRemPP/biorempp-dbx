[**BioRemPPDBX Source Reference**](../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../README.md) / [features/guided-analysis/utils](../README.md) / toDefaultFilterValue

# Function: toDefaultFilterValue()

> **toDefaultFilterValue**(`filter`, `rawValue`): [`GuidedFilterValue`](../../types/type-aliases/GuidedFilterValue.md)

Defined in: [src/features/guided-analysis/utils.ts:38](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/guided-analysis/utils.ts#L38)

Converts a raw default value into the client-side value shape expected by a guided filter.

## Parameters

### filter

[`GuidedFilterDefinition`](../../types/interfaces/GuidedFilterDefinition.md)

Guided filter definition that determines the target value shape.

### rawValue

`unknown`

Raw default value loaded from the query definition.

## Returns

[`GuidedFilterValue`](../../types/type-aliases/GuidedFilterValue.md)

A normalized filter value compatible with the filter type.

## Remarks

Toggle filters accept common boolean-like primitives, range filters keep only numeric `min` and `max` values,
and other filters fall back to an empty string when the raw value is not a string.
