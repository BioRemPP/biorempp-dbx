[**BioRemPPDBX Source Reference**](../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../README.md) / [features/pathways/types](../README.md) / PathwaySummary

# Interface: PathwaySummary

Defined in: [src/features/pathways/types.ts:11](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/pathways/types.ts#L11)

Summary row returned by pathway explorer list endpoints.

## Properties

### compound\_count

> **compound\_count**: `number`

Defined in: [src/features/pathways/types.ts:17](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/pathways/types.ts#L17)

Number of compounds linked to the pathway.

***

### gene\_count

> **gene\_count**: `number`

Defined in: [src/features/pathways/types.ts:19](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/pathways/types.ts#L19)

Number of genes linked to the pathway.

***

### pathway

> **pathway**: `string`

Defined in: [src/features/pathways/types.ts:13](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/pathways/types.ts#L13)

Pathway name or identifier used as the canonical route key.

***

### source

> **source**: `string`

Defined in: [src/features/pathways/types.ts:15](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/pathways/types.ts#L15)

Source catalog associated with the pathway row.

***

### updated\_at

> **updated\_at**: `string`

Defined in: [src/features/pathways/types.ts:21](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/pathways/types.ts#L21)

ISO-like timestamp indicating when the row was last refreshed.
