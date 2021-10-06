[@foyer-inc/insight-sdk](../../README.md) / [Exports](../modules.md) / Detection

# Interface: Detection

An interface describing a detection returned by the classify endpoint

## Table of contents

### Properties

- [area](Detection.md#area)
- [attributes](Detection.md#attributes)
- [boundingBox](Detection.md#boundingbox)
- [class](Detection.md#class)
- [confidence](Detection.md#confidence)
- [segmentation](Detection.md#segmentation)

## Properties

### area

• **area**: `number`

A number between 0 and 1 that represents what percentage of the image
the given Detection occupies

#### Defined in

[lib/types.ts:101](https://github.com/Foyer-Inc/insight-sdk/blob/9a7f1f1/src/lib/types.ts#L101)

___

### attributes

• **attributes**: `object`[]

Attributes are more specific features gathered from the objects detected in the images.
For the detections that have them, the attributes will give more robust information about the image.
Attributes will always have a name field and a value field.

#### Defined in

[lib/types.ts:120](https://github.com/Foyer-Inc/insight-sdk/blob/9a7f1f1/src/lib/types.ts#L120)

___

### boundingBox

• **boundingBox**: `number`[]

An array of shape [x1, y1, x2, y2] where
items are (x1, y1) represents the upperleft corner of the Detection
and (x2, y2) represent the lowerright corner of the Detection
Each value is a number between 0 and 1 and represents a percentage
of distance across an image in either the x or y axes.

#### Defined in

[lib/types.ts:109](https://github.com/Foyer-Inc/insight-sdk/blob/9a7f1f1/src/lib/types.ts#L109)

___

### class

• **class**: `string`

The name of the detection

#### Defined in

[lib/types.ts:96](https://github.com/Foyer-Inc/insight-sdk/blob/9a7f1f1/src/lib/types.ts#L96)

___

### confidence

• **confidence**: `number`

A number between 0 and 1 that represents the likelihood that the
output of the Insight object detection model is correct

#### Defined in

[lib/types.ts:114](https://github.com/Foyer-Inc/insight-sdk/blob/9a7f1f1/src/lib/types.ts#L114)

___

### segmentation

• `Optional` **segmentation**: [`Segmentation`](Segmentation.md)

#### Defined in

[lib/types.ts:121](https://github.com/Foyer-Inc/insight-sdk/blob/9a7f1f1/src/lib/types.ts#L121)
