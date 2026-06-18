[**BioRemPPDBX Source Reference**](../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../README.md) / [features/compounds/types](../README.md) / CompoundGeneCardRow

# Interface: CompoundGeneCardRow

Defined in: [src/features/compounds/types.ts:285](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/compounds/types.ts#L285)

Gene association row returned by compound detail endpoints.

## Properties

### cpd

> **cpd**: `string`

Defined in: [src/features/compounds/types.ts:287](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/compounds/types.ts#L287)

Compound identifier requested by the client.

***

### ec

> **ec**: `string`

Defined in: [src/features/compounds/types.ts:297](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/compounds/types.ts#L297)

EC number associated with the gene relation.

***

### enzyme\_activity

> **enzyme\_activity**: `string`

Defined in: [src/features/compounds/types.ts:295](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/compounds/types.ts#L295)

Enzyme activity label associated with the gene relation.

***

### genename

> **genename**: `string`

Defined in: [src/features/compounds/types.ts:293](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/compounds/types.ts#L293)

Gene name linked to the compound.

***

### genesymbol

> **genesymbol**: `string`

Defined in: [src/features/compounds/types.ts:291](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/compounds/types.ts#L291)

Gene symbol linked to the compound.

***

### ko

> **ko**: `string`

Defined in: [src/features/compounds/types.ts:289](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/compounds/types.ts#L289)

KO identifier linked to the gene association.

***

### reaction\_descriptions

> **reaction\_descriptions**: `string`[]

Defined in: [src/features/compounds/types.ts:299](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/compounds/types.ts#L299)

Reaction descriptions linked to the association row.

***

### reaction\_descriptions\_total

> **reaction\_descriptions\_total**: `number`

Defined in: [src/features/compounds/types.ts:301](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/compounds/types.ts#L301)

Total number of reaction descriptions before client-side truncation.

***

### supporting\_rows

> **supporting\_rows**: `number`

Defined in: [src/features/compounds/types.ts:303](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/compounds/types.ts#L303)

Number of supporting rows contributing to the association.

***

### updated\_at

> **updated\_at**: `string`

Defined in: [src/features/compounds/types.ts:305](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/compounds/types.ts#L305)

ISO-like timestamp indicating when the row was last refreshed.
