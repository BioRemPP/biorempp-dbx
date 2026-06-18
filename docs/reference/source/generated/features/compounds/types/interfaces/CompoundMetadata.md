[**BioRemPPDBX Source Reference**](../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../README.md) / [features/compounds/types](../README.md) / CompoundMetadata

# Interface: CompoundMetadata

Defined in: [src/features/compounds/types.ts:175](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/compounds/types.ts#L175)

Metadata payload returned by compound detail endpoints.

## Properties

### chemical\_information

> **chemical\_information**: `object`

Defined in: [src/features/compounds/types.ts:211](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/compounds/types.ts#L211)

Chemical identifiers and names exposed by the metadata panel.

#### chebi

> **chebi**: `string` \| `null`

ChEBI identifier when available.

#### compound\_class

> **compound\_class**: `string` \| `null`

Compound class label when available.

#### compound\_name

> **compound\_name**: `string` \| `null`

Preferred compound name when available.

#### smiles

> **smiles**: `string` \| `null`

Compound SMILES string when available.

***

### cross\_references

> **cross\_references**: `object`

Defined in: [src/features/compounds/types.ts:233](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/compounds/types.ts#L233)

External identifiers and counts used for cross-reference display.

#### chebi

> **chebi**: `string` \| `null`

ChEBI identifier when available.

#### ec\_numbers

> **ec\_numbers**: `string`[]

EC numbers linked to the compound.

#### kegg\_compound\_id

> **kegg\_compound\_id**: `string`

KEGG compound identifier preserved from the backend payload.

#### reaction\_count

> **reaction\_count**: `number`

Number of distinct linked reactions.

***

### data\_quality

> **data\_quality**: `object`

Defined in: [src/features/compounds/types.ts:244](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/compounds/types.ts#L244)

Backend-reported data quality signals for the current compound.

#### completeness\_pct

> **completeness\_pct**: `number`

Completeness percentage reported by the backend.

#### cpd\_format\_valid

> **cpd\_format\_valid**: `boolean`

Whether the compound identifier passed backend format validation.

#### cross\_references\_coverage

> **cross\_references\_coverage**: `string`

Qualitative cross-reference coverage label returned by the backend.

#### ko\_format\_valid

> **ko\_format\_valid**: `boolean`

Whether linked KO identifiers passed backend format validation.

***

### data\_sources

> **data\_sources**: [`CompoundMetadataSource`](CompoundMetadataSource.md)[]

Defined in: [src/features/compounds/types.ts:222](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/compounds/types.ts#L222)

Data source badges shown in the metadata UI.

***

### functional\_annotation

> **functional\_annotation**: `object`

Defined in: [src/features/compounds/types.ts:196](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/compounds/types.ts#L196)

Functional annotations derived from linked genes, reactions, and pathways.

#### compound\_pathway\_class

> **compound\_pathway\_class**: `string`[]

COMPOUND_PATHWAY entries linked to the compound.

#### ec\_numbers

> **ec\_numbers**: `string`[]

EC numbers linked to the compound.

#### enzyme\_activity

> **enzyme\_activity**: `string`[]

Enzyme activity labels linked to the compound.

#### pathways\_hadeg

> **pathways\_hadeg**: `string`[]

HADEG pathways linked to the compound.

#### pathways\_kegg

> **pathways\_kegg**: `string`[]

KEGG pathways linked to the compound.

#### reaction\_count

> **reaction\_count**: `number`

Number of distinct linked reactions.

***

### identifiers

> **identifiers**: `object`

Defined in: [src/features/compounds/types.ts:177](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/compounds/types.ts#L177)

Identifier and cross-reference fields shown in the metadata panel.

#### chebi\_id

> **chebi\_id**: `string` \| `null`

ChEBI identifier when available.

#### compound\_class

> **compound\_class**: `string` \| `null`

Compound class label when available.

#### compound\_name

> **compound\_name**: `string` \| `null`

Preferred compound name when available.

#### cpd

> **cpd**: `string`

Compound identifier requested by the client.

#### gene\_names

> **gene\_names**: `string`[]

Gene names linked to the compound.

#### gene\_symbols

> **gene\_symbols**: `string`[]

Gene symbols linked to the compound.

#### ko\_ids

> **ko\_ids**: `string`[]

KO identifiers linked to the compound.

#### smiles

> **smiles**: `string` \| `null`

Compound SMILES string when available.

***

### provenance

> **provenance**: `object`

Defined in: [src/features/compounds/types.ts:224](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/compounds/types.ts#L224)

Provenance fields describing the dataset build that produced the payload.

#### last\_updated

> **last\_updated**: `string` \| `null`

Last update timestamp when available.

#### pipeline

> **pipeline**: `string`

Pipeline identifier reported by the backend.

#### version

> **version**: `string`

Dataset or payload version string.
