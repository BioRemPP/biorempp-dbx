[**BioRemPPDBX Source Reference**](../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../README.md) / [features/genes/types](../README.md) / GeneMetadata

# Interface: GeneMetadata

Defined in: [src/features/genes/types.ts:157](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/genes/types.ts#L157)

Metadata payload returned by gene detail endpoints.

## Properties

### data\_sources

> **data\_sources**: [`GeneMetadataSource`](GeneMetadataSource.md)[]

Defined in: [src/features/genes/types.ts:184](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/genes/types.ts#L184)

Data source badges shown in the metadata UI.

***

### identifiers

> **identifiers**: `object`

Defined in: [src/features/genes/types.ts:159](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/genes/types.ts#L159)

Identifier and cross-reference fields shown in the metadata panel.

#### chebi\_ids

> **chebi\_ids**: `string`[]

Distinct ChEBI identifiers linked to the gene.

#### chebi\_items

> **chebi\_items**: [`GeneMetadataChebiItem`](GeneMetadataChebiItem.md)[]

Expanded ChEBI items used by the metadata UI.

#### ec\_numbers

> **ec\_numbers**: `string`[]

Distinct EC numbers linked to the gene.

#### gene\_name

> **gene\_name**: `string` \| `null`

Preferred gene name when available.

#### gene\_symbol

> **gene\_symbol**: `string` \| `null`

Preferred gene symbol when available.

#### kegg\_ko\_id

> **kegg\_ko\_id**: `string`

KEGG KO identifier preserved from the backend payload.

#### ko

> **ko**: `string`

KO identifier requested by the client.

#### reaction\_ids

> **reaction\_ids**: `string`[]

Distinct reaction identifiers linked to the gene.

#### reaction\_items

> **reaction\_items**: [`GeneMetadataReactionItem`](GeneMetadataReactionItem.md)[]

Expanded reaction items used by the metadata UI.

#### smiles

> **smiles**: `string`[]

Distinct SMILES strings linked to the gene.

#### smiles\_items

> **smiles\_items**: [`GeneMetadataSmilesItem`](GeneMetadataSmilesItem.md)[]

Expanded SMILES items used by the metadata UI.

***

### quantitative\_overview

> **quantitative\_overview**: `object`

Defined in: [src/features/genes/types.ts:186](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/genes/types.ts#L186)

Quantitative counters summarizing linked annotations and coverage.

#### compound\_classes

> **compound\_classes**: `number`

Number of distinct linked compound classes.

#### ec\_count

> **ec\_count**: `number`

Number of distinct EC numbers linked to the gene.

#### enzyme\_activity\_count

> **enzyme\_activity\_count**: `number`

Number of distinct enzyme activity labels linked to the gene.

#### linked\_compounds

> **linked\_compounds**: `number`

Number of linked compounds.

#### pathway\_annotations

> **pathway\_annotations**: `number`

Number of total pathway annotations across sources.

#### pathways\_compound\_pathway

> **pathways\_compound\_pathway**: `number`

Number of COMPOUND_PATHWAY annotations.

#### pathways\_hadeg

> **pathways\_hadeg**: `number`

Number of HADEG pathway annotations.

#### pathways\_kegg

> **pathways\_kegg**: `number`

Number of KEGG pathway annotations.

#### reaction\_id\_count

> **reaction\_id\_count**: `number`

Number of distinct reaction identifiers linked to the gene.

#### reference\_agencies

> **reference\_agencies**: `number`

Number of distinct reference agencies represented by linked compounds.

#### toxicity\_coverage\_pct

> **toxicity\_coverage\_pct**: `number` \| `null`

Percentage of linked compounds with toxicity coverage.
