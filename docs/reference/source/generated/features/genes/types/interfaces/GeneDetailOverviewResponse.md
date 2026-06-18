[**BioRemPPDBX Source Reference**](../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../README.md) / [features/genes/types](../README.md) / GeneDetailOverviewResponse

# Interface: GeneDetailOverviewResponse

Defined in: [src/features/genes/types.ts:73](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/genes/types.ts#L73)

Overview payload returned by gene detail endpoints.

## Properties

### ko

> **ko**: `string`

Defined in: [src/features/genes/types.ts:75](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/genes/types.ts#L75)

KO identifier requested by the client.

***

### summary

> **summary**: [`GeneDetailOverviewSummary`](GeneDetailOverviewSummary.md)

Defined in: [src/features/genes/types.ts:77](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/genes/types.ts#L77)

Aggregate metrics used by the overview page.

***

### toxicity\_matrix

> **toxicity\_matrix**: [`PathwayToxicityMatrix`](../../../pathways/types/interfaces/PathwayToxicityMatrix.md)

Defined in: [src/features/genes/types.ts:79](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/genes/types.ts#L79)

Compound-endpoint toxicity matrix used by the overview heatmap.
