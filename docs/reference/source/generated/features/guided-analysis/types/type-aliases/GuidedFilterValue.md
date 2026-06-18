[**BioRemPPDBX Source Reference**](../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../README.md) / [features/guided-analysis/types](../README.md) / GuidedFilterValue

# Type Alias: GuidedFilterValue

> **GuidedFilterValue** = `string` \| `boolean` \| \{ `max?`: `number`; `min?`: `number`; \}

Defined in: [src/features/guided-analysis/types.ts:613](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/guided-analysis/types.ts#L613)

Supported value shapes stored in client-side guided filter state.

## Union Members

`string`

***

`boolean`

***

### Type Literal

\{ `max?`: `number`; `min?`: `number`; \}

#### max?

> `optional` **max?**: `number`

Inclusive numeric maximum selected by the user.

#### min?

> `optional` **min?**: `number`

Inclusive numeric minimum selected by the user.
