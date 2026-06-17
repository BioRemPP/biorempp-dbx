[**BioRemPPDBX Source Reference**](../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../README.md) / [features/guided-analysis/types](../README.md) / GuidedFilterValue

# Type Alias: GuidedFilterValue

> **GuidedFilterValue** = `string` \| `boolean` \| \{ `max?`: `number`; `min?`: `number`; \}

Defined in: [src/features/guided-analysis/types.ts:613](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/guided-analysis/types.ts#L613)

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
