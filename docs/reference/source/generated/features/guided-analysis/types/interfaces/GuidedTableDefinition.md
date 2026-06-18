[**BioRemPPDBX Source Reference**](../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../README.md) / [features/guided-analysis/types](../README.md) / GuidedTableDefinition

# Interface: GuidedTableDefinition

Defined in: [src/features/guided-analysis/types.ts:135](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/guided-analysis/types.ts#L135)

Table definition declared by a guided query.

## Extended by

- [`GuidedTableResult`](GuidedTableResult.md)

## Properties

### columns

> **columns**: [`GuidedTableColumnDefinition`](GuidedTableColumnDefinition.md)[]

Defined in: [src/features/guided-analysis/types.ts:147](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/guided-analysis/types.ts#L147)

Ordered column definitions used to render rows.

***

### empty\_message?

> `optional` **empty\_message?**: `string`

Defined in: [src/features/guided-analysis/types.ts:145](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/guided-analysis/types.ts#L145)

Message shown when the table has no rows.

***

### id

> **id**: `string`

Defined in: [src/features/guided-analysis/types.ts:137](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/guided-analysis/types.ts#L137)

Stable table identifier.

***

### row\_click\_field?

> `optional` **row\_click\_field?**: `string`

Defined in: [src/features/guided-analysis/types.ts:143](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/guided-analysis/types.ts#L143)

Row field used to build drill-down navigation on click.

***

### subtitle?

> `optional` **subtitle?**: `string`

Defined in: [src/features/guided-analysis/types.ts:141](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/guided-analysis/types.ts#L141)

Optional subtitle shown below the title.

***

### title

> **title**: `string`

Defined in: [src/features/guided-analysis/types.ts:139](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/guided-analysis/types.ts#L139)

Primary table title shown in the UI.
