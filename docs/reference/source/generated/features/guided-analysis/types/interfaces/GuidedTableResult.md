[**BioRemPPDBX Source Reference**](../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../README.md) / [features/guided-analysis/types](../README.md) / GuidedTableResult

# Interface: GuidedTableResult

Defined in: [src/features/guided-analysis/types.ts:525](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/guided-analysis/types.ts#L525)

Paginated table result returned by guided query execution.

## Extends

- [`GuidedTableDefinition`](GuidedTableDefinition.md)

## Properties

### columns

> **columns**: [`GuidedTableColumnDefinition`](GuidedTableColumnDefinition.md)[]

Defined in: [src/features/guided-analysis/types.ts:147](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/guided-analysis/types.ts#L147)

Ordered column definitions used to render rows.

#### Inherited from

[`GuidedTableDefinition`](GuidedTableDefinition.md).[`columns`](GuidedTableDefinition.md#columns)

***

### empty\_message?

> `optional` **empty\_message?**: `string`

Defined in: [src/features/guided-analysis/types.ts:145](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/guided-analysis/types.ts#L145)

Message shown when the table has no rows.

#### Inherited from

[`GuidedTableDefinition`](GuidedTableDefinition.md).[`empty_message`](GuidedTableDefinition.md#empty_message)

***

### id

> **id**: `string`

Defined in: [src/features/guided-analysis/types.ts:137](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/guided-analysis/types.ts#L137)

Stable table identifier.

#### Inherited from

[`GuidedTableDefinition`](GuidedTableDefinition.md).[`id`](GuidedTableDefinition.md#id)

***

### page

> **page**: `number`

Defined in: [src/features/guided-analysis/types.ts:529](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/guided-analysis/types.ts#L529)

One-based page number returned for the current result set.

***

### pageSize

> **pageSize**: `number`

Defined in: [src/features/guided-analysis/types.ts:531](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/guided-analysis/types.ts#L531)

Maximum number of rows returned per page.

***

### row\_click\_field?

> `optional` **row\_click\_field?**: `string`

Defined in: [src/features/guided-analysis/types.ts:143](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/guided-analysis/types.ts#L143)

Row field used to build drill-down navigation on click.

#### Inherited from

[`GuidedTableDefinition`](GuidedTableDefinition.md).[`row_click_field`](GuidedTableDefinition.md#row_click_field)

***

### rows

> **rows**: `Record`\<`string`, `unknown`\>[]

Defined in: [src/features/guided-analysis/types.ts:527](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/guided-analysis/types.ts#L527)

Table rows keyed by column identifiers and backend field names.

***

### subtitle?

> `optional` **subtitle?**: `string`

Defined in: [src/features/guided-analysis/types.ts:141](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/guided-analysis/types.ts#L141)

Optional subtitle shown below the title.

#### Inherited from

[`GuidedTableDefinition`](GuidedTableDefinition.md).[`subtitle`](GuidedTableDefinition.md#subtitle)

***

### title

> **title**: `string`

Defined in: [src/features/guided-analysis/types.ts:139](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/guided-analysis/types.ts#L139)

Primary table title shown in the UI.

#### Inherited from

[`GuidedTableDefinition`](GuidedTableDefinition.md).[`title`](GuidedTableDefinition.md#title)

***

### total

> **total**: `number`

Defined in: [src/features/guided-analysis/types.ts:533](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/guided-analysis/types.ts#L533)

Total number of rows available for the current filter scope.

***

### totalPages

> **totalPages**: `number`

Defined in: [src/features/guided-analysis/types.ts:535](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/guided-analysis/types.ts#L535)

Total number of available pages for the current filter scope.
