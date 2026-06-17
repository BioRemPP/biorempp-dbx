[**BioRemPPDBX Source Reference**](../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../README.md) / [features/guided-analysis/types](../README.md) / GuidedExecuteRequest

# Interface: GuidedExecuteRequest

Defined in: [src/features/guided-analysis/types.ts:601](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/guided-analysis/types.ts#L601)

Request payload accepted by guided execution endpoints.

## Properties

### filters?

> `optional` **filters?**: `Record`\<`string`, `unknown`\>

Defined in: [src/features/guided-analysis/types.ts:607](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/guided-analysis/types.ts#L607)

Filter state forwarded to the backend executor.

***

### page?

> `optional` **page?**: `number`

Defined in: [src/features/guided-analysis/types.ts:603](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/guided-analysis/types.ts#L603)

One-based page number requested by the client.

***

### pageSize?

> `optional` **pageSize?**: `number`

Defined in: [src/features/guided-analysis/types.ts:605](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/guided-analysis/types.ts#L605)

Maximum number of rows requested per page.
