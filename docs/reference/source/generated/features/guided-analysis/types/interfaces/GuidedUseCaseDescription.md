[**BioRemPPDBX Source Reference**](../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../README.md) / [features/guided-analysis/types](../README.md) / GuidedUseCaseDescription

# Interface: GuidedUseCaseDescription

Defined in: [src/features/guided-analysis/types.ts:163](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/guided-analysis/types.ts#L163)

Narrative use-case description attached to a guided query definition.

## Properties

### color\_scheme?

> `optional` **color\_scheme?**: `string`

Defined in: [src/features/guided-analysis/types.ts:175](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/guided-analysis/types.ts#L175)

Optional semantic color family used by the descriptive panel.

***

### description

> **description**: `string`

Defined in: [src/features/guided-analysis/types.ts:167](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/guided-analysis/types.ts#L167)

High-level description of the use case.

***

### interpretation\_guidelines

> **interpretation\_guidelines**: `string`[]

Defined in: [src/features/guided-analysis/types.ts:171](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/guided-analysis/types.ts#L171)

Interpretation bullets shown to the user when reading the use-case guidance.

***

### limitations

> **limitations**: `string`[]

Defined in: [src/features/guided-analysis/types.ts:173](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/guided-analysis/types.ts#L173)

Stated limitations that bound interpretation of the use case.

***

### scientific\_question

> **scientific\_question**: `string`

Defined in: [src/features/guided-analysis/types.ts:165](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/guided-analysis/types.ts#L165)

Scientific question that the guided query helps answer.

***

### visual\_elements?

> `optional` **visual\_elements?**: [`GuidedUseCaseVisualElement`](GuidedUseCaseVisualElement.md)[]

Defined in: [src/features/guided-analysis/types.ts:169](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/guided-analysis/types.ts#L169)

Optional visual element descriptors shown alongside the use case.
