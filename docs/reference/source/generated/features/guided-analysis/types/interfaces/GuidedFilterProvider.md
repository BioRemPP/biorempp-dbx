[**BioRemPPDBX Source Reference**](../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../README.md) / [features/guided-analysis/types](../README.md) / GuidedFilterProvider

# Interface: GuidedFilterProvider

Defined in: [src/features/guided-analysis/types.ts:47](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/guided-analysis/types.ts#L47)

Data provider configuration used to populate guided filter options.

## Properties

### endpoint?

> `optional` **endpoint?**: `string`

Defined in: [src/features/guided-analysis/types.ts:51](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/guided-analysis/types.ts#L51)

Metadata endpoint used when `type` resolves options remotely.

***

### include\_mean\_option?

> `optional` **include\_mean\_option?**: `boolean`

Defined in: [src/features/guided-analysis/types.ts:55](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/guided-analysis/types.ts#L55)

Whether the provider exposes a synthetic mean option.

***

### mean\_option\_label?

> `optional` **mean\_option\_label?**: `string`

Defined in: [src/features/guided-analysis/types.ts:57](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/guided-analysis/types.ts#L57)

Label used for the synthetic mean option when enabled.

***

### options?

> `optional` **options?**: [`GuidedFilterProviderOption`](GuidedFilterProviderOption.md)[]

Defined in: [src/features/guided-analysis/types.ts:59](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/guided-analysis/types.ts#L59)

Inline static options when `type` is `static`.

***

### source?

> `optional` **source?**: `string`

Defined in: [src/features/guided-analysis/types.ts:53](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/guided-analysis/types.ts#L53)

Optional source discriminator forwarded to metadata endpoints.

***

### type

> **type**: [`GuidedProviderType`](../type-aliases/GuidedProviderType.md)

Defined in: [src/features/guided-analysis/types.ts:49](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/guided-analysis/types.ts#L49)

Provider strategy used to resolve the option list.
