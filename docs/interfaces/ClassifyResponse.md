[@foyer-inc/insight-sdk](../../README.md) / [Exports](../modules.md) / ClassifyResponse

# Interface: ClassifyResponse

A interface describing the response returned by the classify endpoint

## Table of contents

### Properties

- [classifications](ClassifyResponse.md#classifications)
- [detections](ClassifyResponse.md#detections)
- [metadata](ClassifyResponse.md#metadata)

## Properties

### classifications

• **classifications**: [`Classification`](Classification.md)[]

An array of classifications for an image as returned by the Insight classification model.
See Classification for more information

#### Defined in

[lib/types.ts:164](https://github.com/Foyer-Inc/insight-sdk/blob/9a7f1f1/src/lib/types.ts#L164)

___

### detections

• **detections**: [`Detection`](Detection.md)[]

An array of detections for an image as returned by the Insight object detection model.
See Classification for more information

#### Defined in

[lib/types.ts:169](https://github.com/Foyer-Inc/insight-sdk/blob/9a7f1f1/src/lib/types.ts#L169)

___

### metadata

• **metadata**: [`ImageMetadata`](ImageMetadata.md)

An object describing metadata of the input image

#### Defined in

[lib/types.ts:173](https://github.com/Foyer-Inc/insight-sdk/blob/9a7f1f1/src/lib/types.ts#L173)
