[**BioRemPPDBX Source Reference**](../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../README.md) / [features/guided-analysis/types](../README.md) / GuidedFilterOption

# Interface: GuidedFilterOption

Defined in: [src/features/guided-analysis/types.ts:261](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/guided-analysis/types.ts#L261)

Resolved option item returned by guided filter option endpoints.

## Properties

### group\_key?

> `optional` **group\_key?**: `string`

Defined in: [src/features/guided-analysis/types.ts:267](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/guided-analysis/types.ts#L267)

Optional grouping key used to cluster options in the UI.

***

### group\_title?

> `optional` **group\_title?**: `string`

Defined in: [src/features/guided-analysis/types.ts:269](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/guided-analysis/types.ts#L269)

Optional grouping label shown for the option cluster.

***

### label

> **label**: `string`

Defined in: [src/features/guided-analysis/types.ts:265](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/guided-analysis/types.ts#L265)

Human-readable option label shown in the UI.

***

### value

> **value**: `string`

Defined in: [src/features/guided-analysis/types.ts:263](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/guided-analysis/types.ts#L263)

Stored filter value sent back to the backend.
