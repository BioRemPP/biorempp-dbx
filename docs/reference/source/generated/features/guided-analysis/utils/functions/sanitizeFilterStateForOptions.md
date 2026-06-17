[**BioRemPPDBX Source Reference**](../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../README.md) / [features/guided-analysis/utils](../README.md) / sanitizeFilterStateForOptions

# Function: sanitizeFilterStateForOptions()

> **sanitizeFilterStateForOptions**(`query`, `current`, `optionsByFilter`): [`GuidedFilterState`](../../types/type-aliases/GuidedFilterState.md)

Defined in: [src/features/guided-analysis/utils.ts:193](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/guided-analysis/utils.ts#L193)

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
