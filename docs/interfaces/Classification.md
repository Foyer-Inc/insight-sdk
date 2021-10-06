[@foyer-inc/insight-sdk](../../README.md) / [Exports](../modules.md) / Classification

# Interface: Classification

An interface describing a classification returned by the classify endpoint

## Table of contents

### Properties

- [confidence](Classification.md#confidence)
- [name](Classification.md#name)
- [rank](Classification.md#rank)

## Properties

### confidence

• **confidence**: `number`

A number between 0 and 1 that represents the likelihood that the
output of the Insight classification model is correct

#### Defined in

[lib/types.ts:78](https://github.com/Foyer-Inc/insight-sdk/blob/9a7f1f1/src/lib/types.ts#L78)

___

### name

• **name**: `string`

The name of this classification, e.g. bathroom, bedroom, etc.

#### Defined in

[lib/types.ts:82](https://github.com/Foyer-Inc/insight-sdk/blob/9a7f1f1/src/lib/types.ts#L82)

___

### rank

• **rank**: `number`

A number related to an ordering when multiple classifications are returned for an image

#### Defined in

[lib/types.ts:86](https://github.com/Foyer-Inc/insight-sdk/blob/9a7f1f1/src/lib/types.ts#L86)
