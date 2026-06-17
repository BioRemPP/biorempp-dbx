[**BioRemPPDBX Source Reference**](../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../README.md) / [features/genes/types](../README.md) / GeneDetailOverviewSummary

# Interface: GeneDetailOverviewSummary

Defined in: [src/features/genes/types.ts:57](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/genes/types.ts#L57)

Summary metrics focused on the gene overview visualization payload.

## Properties

### endpoint\_count

> **endpoint\_count**: `number`

Defined in: [src/features/genes/types.ts:65](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/genes/types.ts#L65)

Number of toxicity endpoints represented in the overview matrix.

***

### excluded\_no\_toxicity

> **excluded\_no\_toxicity**: `number`

Defined in: [src/features/genes/types.ts:63](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/genes/types.ts#L63)

Number of linked compounds excluded because no toxicity data was available.

***

### linked\_compounds\_total

> **linked\_compounds\_total**: `number`

Defined in: [src/features/genes/types.ts:59](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/genes/types.ts#L59)

Total number of compounds linked to the gene.

***

### toxicity\_compounds

> **toxicity\_compounds**: `number`

Defined in: [src/features/genes/types.ts:61](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/genes/types.ts#L61)

Number of linked compounds that have toxicity data.

***

### toxicity\_coverage\_pct

> **toxicity\_coverage\_pct**: `number` \| `null`

Defined in: [src/features/genes/types.ts:67](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/genes/types.ts#L67)

Percentage of linked compounds with toxicity coverage.
