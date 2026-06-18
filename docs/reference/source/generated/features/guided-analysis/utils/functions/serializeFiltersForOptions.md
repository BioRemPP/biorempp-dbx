[**BioRemPPDBX Source Reference**](../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../README.md) / [features/guided-analysis/utils](../README.md) / serializeFiltersForOptions

# Function: serializeFiltersForOptions()

> **serializeFiltersForOptions**(`filters`): `Record`\<`string`, `string`\>

Defined in: [src/features/guided-analysis/utils.ts:114](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/guided-analysis/utils.ts#L114)

Serializes the current filter state for option-loading endpoints.

## Parameters

### filters

[`GuidedFilterState`](../../types/type-aliases/GuidedFilterState.md)

Client-side guided filter state.

## Returns

`Record`\<`string`, `string`\>

A string-only payload containing non-empty string values and explicit boolean selections.

## Remarks

Number-range values are omitted because option endpoints only consume simple scalar filters in the current client.
String values are trimmed before they are forwarded.
