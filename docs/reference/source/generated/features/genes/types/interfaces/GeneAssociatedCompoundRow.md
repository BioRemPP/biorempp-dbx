[**BioRemPPDBX Source Reference**](../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../README.md) / [features/genes/types](../README.md) / GeneAssociatedCompoundRow

# Interface: GeneAssociatedCompoundRow

Defined in: [src/features/genes/types.ts:85](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/genes/types.ts#L85)

Compound row returned by gene association endpoints.

## Properties

### compoundclass

> **compoundclass**: `string` \| `null`

Defined in: [src/features/genes/types.ts:91](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/genes/types.ts#L91)

Compound class label when available.

***

### compoundname

> **compoundname**: `string` \| `null`

Defined in: [src/features/genes/types.ts:89](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/genes/types.ts#L89)

Compound display name when available.

***

### cpd

> **cpd**: `string`

Defined in: [src/features/genes/types.ts:87](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/genes/types.ts#L87)

Compound identifier linked to the gene.

***

### gene\_count

> **gene\_count**: `number`

Defined in: [src/features/genes/types.ts:99](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/genes/types.ts#L99)

Number of genes linked to the compound.

***

### high\_risk\_endpoint\_count

> **high\_risk\_endpoint\_count**: `number`

Defined in: [src/features/genes/types.ts:105](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/genes/types.ts#L105)

Number of linked endpoints currently classified as high risk.

***

### ko\_count

> **ko\_count**: `number`

Defined in: [src/features/genes/types.ts:97](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/genes/types.ts#L97)

Number of KO identifiers linked to the compound.

***

### pathway\_count

> **pathway\_count**: `number`

Defined in: [src/features/genes/types.ts:101](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/genes/types.ts#L101)

Number of pathways linked to the compound.

***

### reference\_ag

> **reference\_ag**: `string` \| `null`

Defined in: [src/features/genes/types.ts:93](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/genes/types.ts#L93)

Reference agency associated with the compound row when available.

***

### reference\_count

> **reference\_count**: `number`

Defined in: [src/features/genes/types.ts:95](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/genes/types.ts#L95)

Number of reference records linked to the compound.

***

### smiles

> **smiles**: `string` \| `null`

Defined in: [src/features/genes/types.ts:107](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/genes/types.ts#L107)

Compound SMILES string when available.

***

### toxicity\_risk\_mean

> **toxicity\_risk\_mean**: `number` \| `null`

Defined in: [src/features/genes/types.ts:103](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/genes/types.ts#L103)

Mean toxicity risk score across supported endpoints.

***

### updated\_at

> **updated\_at**: `string`

Defined in: [src/features/genes/types.ts:109](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/genes/types.ts#L109)

ISO-like timestamp indicating when the row was last refreshed.
