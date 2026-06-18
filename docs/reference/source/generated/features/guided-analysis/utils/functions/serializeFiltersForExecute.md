[**BioRemPPDBX Source Reference**](../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../README.md) / [features/guided-analysis/utils](../README.md) / serializeFiltersForExecute

# Function: serializeFiltersForExecute()

> **serializeFiltersForExecute**(`filters`): `Record`\<`string`, `unknown`\>

Defined in: [src/features/guided-analysis/utils.ts:140](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/guided-analysis/utils.ts#L140)

Serializes the current filter state for guided query execution requests.

## Parameters

### filters

[`GuidedFilterState`](../../types/type-aliases/GuidedFilterState.md)

Client-side guided filter state.

## Returns

`Record`\<`string`, `unknown`\>

A payload containing trimmed strings, `true` boolean toggles, and populated numeric ranges.

## Remarks

Empty strings, `false` booleans, and empty numeric ranges are omitted from the resulting payload.
