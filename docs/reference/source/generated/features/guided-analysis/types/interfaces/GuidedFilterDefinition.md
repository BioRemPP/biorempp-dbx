[**BioRemPPDBX Source Reference**](../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../README.md) / [features/guided-analysis/types](../README.md) / GuidedFilterDefinition

# Interface: GuidedFilterDefinition

Defined in: [src/features/guided-analysis/types.ts:65](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/guided-analysis/types.ts#L65)

Filter definition declared by a guided query.

## Properties

### depends\_on?

> `optional` **depends\_on?**: `string`

Defined in: [src/features/guided-analysis/types.ts:79](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/guided-analysis/types.ts#L79)

Upstream filter identifier required before this filter becomes available.

***

### id

> **id**: `string`

Defined in: [src/features/guided-analysis/types.ts:67](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/guided-analysis/types.ts#L67)

Stable filter identifier used in request payloads.

***

### label

> **label**: `string`

Defined in: [src/features/guided-analysis/types.ts:71](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/guided-analysis/types.ts#L71)

Human-readable label shown in the filter panel.

***

### max?

> `optional` **max?**: `number`

Defined in: [src/features/guided-analysis/types.ts:83](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/guided-analysis/types.ts#L83)

Inclusive numeric maximum for range filters.

***

### max\_placeholder?

> `optional` **max\_placeholder?**: `string`

Defined in: [src/features/guided-analysis/types.ts:77](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/guided-analysis/types.ts#L77)

Placeholder text for the maximum input of range controls.

***

### min?

> `optional` **min?**: `number`

Defined in: [src/features/guided-analysis/types.ts:81](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/guided-analysis/types.ts#L81)

Inclusive numeric minimum for range filters.

***

### min\_placeholder?

> `optional` **min\_placeholder?**: `string`

Defined in: [src/features/guided-analysis/types.ts:75](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/guided-analysis/types.ts#L75)

Placeholder text for the minimum input of range controls.

***

### placeholder?

> `optional` **placeholder?**: `string`

Defined in: [src/features/guided-analysis/types.ts:73](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/guided-analysis/types.ts#L73)

Placeholder text for search-like controls.

***

### provider?

> `optional` **provider?**: [`GuidedFilterProvider`](GuidedFilterProvider.md)

Defined in: [src/features/guided-analysis/types.ts:87](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/guided-analysis/types.ts#L87)

Option provider definition used by select-like controls.

***

### step?

> `optional` **step?**: `number`

Defined in: [src/features/guided-analysis/types.ts:85](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/guided-analysis/types.ts#L85)

Numeric step used by range filters.

***

### type

> **type**: [`GuidedFilterType`](../type-aliases/GuidedFilterType.md)

Defined in: [src/features/guided-analysis/types.ts:69](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/guided-analysis/types.ts#L69)

UI control type used to render the filter.
