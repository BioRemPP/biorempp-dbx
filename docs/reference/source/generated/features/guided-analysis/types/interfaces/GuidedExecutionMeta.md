[**BioRemPPDBX Source Reference**](../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../README.md) / [features/guided-analysis/types](../README.md) / GuidedExecutionMeta

# Interface: GuidedExecutionMeta

Defined in: [src/features/guided-analysis/types.ts:541](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/guided-analysis/types.ts#L541)

Execution metadata returned by guided query execution endpoints.

## Properties

### dataset

> **dataset**: `string`

Defined in: [src/features/guided-analysis/types.ts:545](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/guided-analysis/types.ts#L545)

Dataset identifier used by the backend executor.

***

### excluded\_null\_y?

> `optional` **excluded\_null\_y?**: `number`

Defined in: [src/features/guided-analysis/types.ts:559](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/guided-analysis/types.ts#L559)

Number of rows excluded because no y-axis value was available.

***

### execution\_ms

> **execution\_ms**: `number`

Defined in: [src/features/guided-analysis/types.ts:549](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/guided-analysis/types.ts#L549)

Total execution time reported by the backend, in milliseconds.

***

### focus\_cluster?

> `optional` **focus\_cluster?**: `boolean`

Defined in: [src/features/guided-analysis/types.ts:577](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/guided-analysis/types.ts#L577)

Whether the backend focused the result on a detected cluster.

***

### gene\_p95?

> `optional` **gene\_p95?**: `number` \| `null`

Defined in: [src/features/guided-analysis/types.ts:579](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/guided-analysis/types.ts#L579)

Ninety-fifth percentile of gene counts when reported by the backend.

***

### page

> **page**: `number`

Defined in: [src/features/guided-analysis/types.ts:551](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/guided-analysis/types.ts#L551)

One-based page number returned for the current result set.

***

### pageSize

> **pageSize**: `number`

Defined in: [src/features/guided-analysis/types.ts:553](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/guided-analysis/types.ts#L553)

Maximum number of rows returned per page.

***

### points\_count?

> `optional` **points\_count?**: `number`

Defined in: [src/features/guided-analysis/types.ts:561](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/guided-analysis/types.ts#L561)

Number of plotted points returned by scatter-style visualizations.

***

### quadrant\_counts?

> `optional` **quadrant\_counts?**: [`GuidedQuadrantCounts`](GuidedQuadrantCounts.md)

Defined in: [src/features/guided-analysis/types.ts:563](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/guided-analysis/types.ts#L563)

Quadrant counts returned when the visualization uses quadrant analysis.

***

### query\_id

> **query\_id**: `string`

Defined in: [src/features/guided-analysis/types.ts:543](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/guided-analysis/types.ts#L543)

Guided query identifier that produced the result.

***

### threshold\_basis?

> `optional` **threshold\_basis?**: `string`

Defined in: [src/features/guided-analysis/types.ts:573](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/guided-analysis/types.ts#L573)

Backend explanation for how thresholds were chosen.

***

### total

> **total**: `number`

Defined in: [src/features/guided-analysis/types.ts:555](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/guided-analysis/types.ts#L555)

Total number of rows available for the current filter scope.

***

### totalPages

> **totalPages**: `number`

Defined in: [src/features/guided-analysis/types.ts:557](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/guided-analysis/types.ts#L557)

Total number of available pages for the current filter scope.

***

### version

> **version**: `string`

Defined in: [src/features/guided-analysis/types.ts:547](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/guided-analysis/types.ts#L547)

Result version string returned by the backend.

***

### x\_scale?

> `optional` **x\_scale?**: `"log10p1"` \| `"linear"`

Defined in: [src/features/guided-analysis/types.ts:575](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/guided-analysis/types.ts#L575)

Scale mode applied to the x axis when relevant.

***

### x\_threshold?

> `optional` **x\_threshold?**: `number`

Defined in: [src/features/guided-analysis/types.ts:569](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/guided-analysis/types.ts#L569)

Threshold applied to the x axis when relevant.

***

### y\_metric\_key?

> `optional` **y\_metric\_key?**: `string`

Defined in: [src/features/guided-analysis/types.ts:565](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/guided-analysis/types.ts#L565)

Backend field key used for the selected y-axis metric.

***

### y\_metric\_label?

> `optional` **y\_metric\_label?**: `string`

Defined in: [src/features/guided-analysis/types.ts:567](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/guided-analysis/types.ts#L567)

Human-readable label for the selected y-axis metric.

***

### y\_threshold?

> `optional` **y\_threshold?**: `number`

Defined in: [src/features/guided-analysis/types.ts:571](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/guided-analysis/types.ts#L571)

Threshold applied to the y axis when relevant.
