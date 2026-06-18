[**BioRemPPDBX Source Reference**](../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../README.md) / [features/guided-analysis/types](../README.md) / GuidedMethodsModal

# Interface: GuidedMethodsModal

Defined in: [src/features/guided-analysis/types.ts:193](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/guided-analysis/types.ts#L193)

Methods modal content attached to a guided query definition.

## Properties

### button\_label

> **button\_label**: `string`

Defined in: [src/features/guided-analysis/types.ts:195](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/guided-analysis/types.ts#L195)

Label shown on the button that opens the modal.

***

### footer\_note?

> `optional` **footer\_note?**: `string`

Defined in: [src/features/guided-analysis/types.ts:203](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/guided-analysis/types.ts#L203)

Optional closing note shown at the end of the modal.

***

### introduction

> **introduction**: `string`

Defined in: [src/features/guided-analysis/types.ts:199](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/guided-analysis/types.ts#L199)

Introductory paragraph shown before the steps.

***

### steps

> **steps**: [`GuidedMethodsStep`](GuidedMethodsStep.md)[]

Defined in: [src/features/guided-analysis/types.ts:201](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/guided-analysis/types.ts#L201)

Ordered step list describing the method.

***

### title

> **title**: `string`

Defined in: [src/features/guided-analysis/types.ts:197](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/guided-analysis/types.ts#L197)

Modal title.
