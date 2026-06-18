[**BioRemPPDBX Source Reference**](../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../README.md) / [features/guided-analysis/utils](../README.md) / buildDefaultFilterState

# Function: buildDefaultFilterState()

> **buildDefaultFilterState**(`query`): [`GuidedFilterState`](../../types/type-aliases/GuidedFilterState.md)

Defined in: [src/features/guided-analysis/utils.ts:66](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/guided-analysis/utils.ts#L66)

Builds the initial guided filter state for a query definition.

## Parameters

### query

[`GuidedQueryDefinition`](../../types/interfaces/GuidedQueryDefinition.md) \| `null`

Guided query definition whose defaults should seed the state.

## Returns

[`GuidedFilterState`](../../types/type-aliases/GuidedFilterState.md)

A normalized filter state keyed by filter identifier.

## Remarks

Missing queries return an empty object. Missing filter defaults are normalized according to each filter type.
