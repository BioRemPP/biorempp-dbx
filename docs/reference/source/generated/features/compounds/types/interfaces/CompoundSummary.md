[**BioRemPPDBX Source Reference**](../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../README.md) / [features/compounds/types](../README.md) / CompoundSummary

# Interface: CompoundSummary

Defined in: [src/features/compounds/types.ts:13](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/compounds/types.ts#L13)

Summary row returned by compound explorer endpoints.

## Properties

### compoundclass

> **compoundclass**: `string` \| `null`

Defined in: [src/features/compounds/types.ts:19](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/compounds/types.ts#L19)

Compound class label when available.

***

### compoundname

> **compoundname**: `string` \| `null`

Defined in: [src/features/compounds/types.ts:17](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/compounds/types.ts#L17)

Preferred compound name when available.

***

### cpd

> **cpd**: `string`

Defined in: [src/features/compounds/types.ts:15](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/compounds/types.ts#L15)

Compound identifier used as the canonical route key.

***

### gene\_count

> **gene\_count**: `number`

Defined in: [src/features/compounds/types.ts:27](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/compounds/types.ts#L27)

Number of genes linked to the compound.

***

### genes

> **genes**: `string`[]

Defined in: [src/features/compounds/types.ts:39](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/compounds/types.ts#L39)

Linked gene symbols included in compact list responses.

***

### high\_risk\_endpoint\_count

> **high\_risk\_endpoint\_count**: `number`

Defined in: [src/features/compounds/types.ts:33](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/compounds/types.ts#L33)

Number of linked endpoints currently classified as high risk.

***

### ko\_count

> **ko\_count**: `number`

Defined in: [src/features/compounds/types.ts:25](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/compounds/types.ts#L25)

Number of KO identifiers linked to the compound.

***

### pathway\_count

> **pathway\_count**: `number`

Defined in: [src/features/compounds/types.ts:29](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/compounds/types.ts#L29)

Number of pathways linked to the compound.

***

### pathways

> **pathways**: `string`[]

Defined in: [src/features/compounds/types.ts:41](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/compounds/types.ts#L41)

Linked pathway names included in compact list responses.

***

### reference\_ag

> **reference\_ag**: `string` \| `null`

Defined in: [src/features/compounds/types.ts:21](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/compounds/types.ts#L21)

Reference agency associated with the compound row when available.

***

### reference\_count

> **reference\_count**: `number`

Defined in: [src/features/compounds/types.ts:23](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/compounds/types.ts#L23)

Number of reference records linked to the compound.

***

### smiles

> **smiles**: `string` \| `null`

Defined in: [src/features/compounds/types.ts:37](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/compounds/types.ts#L37)

Compound SMILES string when available.

***

### toxicity\_risk\_mean

> **toxicity\_risk\_mean**: `number` \| `null`

Defined in: [src/features/compounds/types.ts:31](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/compounds/types.ts#L31)

Mean toxicity risk score across supported endpoints.

***

### toxicity\_scores

> **toxicity\_scores**: `Record`\<`string`, `number` \| `null`\>

Defined in: [src/features/compounds/types.ts:35](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/compounds/types.ts#L35)

Per-endpoint toxicity scores keyed by endpoint identifier.

***

### updated\_at

> **updated\_at**: `string`

Defined in: [src/features/compounds/types.ts:43](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/compounds/types.ts#L43)

ISO-like timestamp indicating when the row was last refreshed.
