[**BioRemPPDBX Source Reference**](../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../README.md) / [features/toxicity/types](../README.md) / ToxicityEndpoint

# Interface: ToxicityEndpoint

Defined in: [src/features/toxicity/types.ts:28](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/toxicity/types.ts#L28)

Row returned by compound toxicity profile endpoints.

## Properties

### compoundclass

> **compoundclass**: `string` \| `null`

Defined in: [src/features/toxicity/types.ts:34](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/toxicity/types.ts#L34)

Compound class label when available.

***

### compoundname

> **compoundname**: `string` \| `null`

Defined in: [src/features/toxicity/types.ts:32](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/toxicity/types.ts#L32)

Compound display name when available.

***

### cpd

> **cpd**: `string`

Defined in: [src/features/toxicity/types.ts:30](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/toxicity/types.ts#L30)

Compound identifier linked to the endpoint measurement.

***

### endpoint

> **endpoint**: `string`

Defined in: [src/features/toxicity/types.ts:36](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/toxicity/types.ts#L36)

Toxicity endpoint identifier.

***

### label

> **label**: `string` \| `null`

Defined in: [src/features/toxicity/types.ts:38](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/toxicity/types.ts#L38)

Optional human-readable endpoint label.

***

### updated\_at

> **updated\_at**: `string`

Defined in: [src/features/toxicity/types.ts:42](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/toxicity/types.ts#L42)

ISO-like timestamp indicating when the underlying row was last updated.

***

### value

> **value**: `number` \| `null`

Defined in: [src/features/toxicity/types.ts:40](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/toxicity/types.ts#L40)

Numeric endpoint value reported by the backend.
