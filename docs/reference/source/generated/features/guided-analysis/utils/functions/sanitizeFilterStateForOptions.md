[**BioRemPPDBX Source Reference**](../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../README.md) / [features/guided-analysis/utils](../README.md) / sanitizeFilterStateForOptions

# Function: sanitizeFilterStateForOptions()

> **sanitizeFilterStateForOptions**(`query`, `current`, `optionsByFilter`): [`GuidedFilterState`](../../types/type-aliases/GuidedFilterState.md)

Defined in: [src/features/guided-analysis/utils.ts:193](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/guided-analysis/utils.ts#L193)

Reconciles the current filter state with the latest available options.

## Parameters

### query

[`GuidedQueryDefinition`](../../types/interfaces/GuidedQueryDefinition.md) \| `null`

Guided query definition that owns the filters.

### current

[`GuidedFilterState`](../../types/type-aliases/GuidedFilterState.md)

Current client-side filter state.

### optionsByFilter

`Record`\<`string`, [`GuidedFilterOption`](../../types/interfaces/GuidedFilterOption.md)[]\>

Latest option sets keyed by filter identifier.

## Returns

[`GuidedFilterState`](../../types/type-aliases/GuidedFilterState.md)

The original state when nothing changes, or a cloned state with invalid selections removed.

## Remarks

Only `select` and `dependent_select` filters are validated. Invalid `select` values are cleared to an empty
string, while invalid `dependent_select` values fall back to the first available option when one exists.
