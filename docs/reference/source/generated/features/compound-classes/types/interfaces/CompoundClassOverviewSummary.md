[**BioRemPPDBX Source Reference**](../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../README.md) / [features/compound-classes/types](../README.md) / CompoundClassOverviewSummary

# Interface: CompoundClassOverviewSummary

Defined in: [src/features/compound-classes/types.ts:34](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/compound-classes/types.ts#L34)

Quantitative summary returned by compound class overview endpoints.

## Properties

### compound\_count

> **compound\_count**: `number`

Defined in: [src/features/compound-classes/types.ts:42](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/compound-classes/types.ts#L42)

Number of distinct compounds linked to the class.

***

### compoundclass

> **compoundclass**: `string`

Defined in: [src/features/compound-classes/types.ts:36](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/compound-classes/types.ts#L36)

Compound class currently being summarized.

***

### gene\_count

> **gene\_count**: `number`

Defined in: [src/features/compound-classes/types.ts:40](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/compound-classes/types.ts#L40)

Number of distinct genes linked to the class.

***

### ko\_count

> **ko\_count**: `number`

Defined in: [src/features/compound-classes/types.ts:38](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/compound-classes/types.ts#L38)

Number of distinct KO identifiers linked to the class.

***

### pathway\_count

> **pathway\_count**: `number`

Defined in: [src/features/compound-classes/types.ts:46](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/compound-classes/types.ts#L46)

Number of distinct pathways linked to the class.

***

### reaction\_ec\_count

> **reaction\_ec\_count**: `number`

Defined in: [src/features/compound-classes/types.ts:44](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/compound-classes/types.ts#L44)

Number of distinct reaction EC classes linked to the class.

***

### source\_count

> **source\_count**: `number`

Defined in: [src/features/compound-classes/types.ts:48](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/compound-classes/types.ts#L48)

Number of pathway source catalogs represented in the class.

***

### toxicity\_coverage\_pct

> **toxicity\_coverage\_pct**: `number` \| `null`

Defined in: [src/features/compound-classes/types.ts:50](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/compound-classes/types.ts#L50)

Percentage of linked compounds that have toxicity coverage.
