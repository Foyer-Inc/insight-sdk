[@foyer-inc/insight-sdk](../../README.md) / [Exports](../modules.md) / ClassifyPayload

# Interface: ClassifyPayload

An interface describing the payload sent to the classify endpoint

## Table of contents

### Properties

- [detectionsRequested](ClassifyPayload.md#detectionsrequested)
- [file](ClassifyPayload.md#file)
- [files](ClassifyPayload.md#files)
- [force](ClassifyPayload.md#force)
- [includeSegmentations](ClassifyPayload.md#includesegmentations)
- [includeTagpoints](ClassifyPayload.md#includetagpoints)
- [url](ClassifyPayload.md#url)
- [urls](ClassifyPayload.md#urls)

## Properties

### detectionsRequested

• `Optional` **detectionsRequested**: `string`[]

An array of detections names to be returned in ClassifyResponse

#### Defined in

[lib/types.ts:67](https://github.com/Foyer-Inc/insight-sdk/blob/9a7f1f1/src/lib/types.ts#L67)

___

### file

• `Optional` **file**: `string`

An image encoded as a base64 string

#### Defined in

[lib/types.ts:37](https://github.com/Foyer-Inc/insight-sdk/blob/9a7f1f1/src/lib/types.ts#L37)

___

### files

• `Optional` **files**: `string`[]

An array of images encoded as base64 strings

#### Defined in

[lib/types.ts:41](https://github.com/Foyer-Inc/insight-sdk/blob/9a7f1f1/src/lib/types.ts#L41)

___

### force

• `Optional` **force**: `boolean`

A flag requesting a new result even when cached data exists

#### Defined in

[lib/types.ts:53](https://github.com/Foyer-Inc/insight-sdk/blob/9a7f1f1/src/lib/types.ts#L53)

___

### includeSegmentations

• `Optional` **includeSegmentations**: `boolean`

A flag requesting the segmentations property to be returned
with each Detection, necessary for post processing

#### Defined in

[lib/types.ts:58](https://github.com/Foyer-Inc/insight-sdk/blob/9a7f1f1/src/lib/types.ts#L58)

___

### includeTagpoints

• `Optional` **includeTagpoints**: `boolean`

A flag requesting the tagpoint attribute to be returned
with each Detection

#### Defined in

[lib/types.ts:63](https://github.com/Foyer-Inc/insight-sdk/blob/9a7f1f1/src/lib/types.ts#L63)

___

### url

• `Optional` **url**: `string`

A url for a remotely hosted image

#### Defined in

[lib/types.ts:45](https://github.com/Foyer-Inc/insight-sdk/blob/9a7f1f1/src/lib/types.ts#L45)

___

### urls

• `Optional` **urls**: `string`[]

An array of urls for remotely hosted images

#### Defined in

[lib/types.ts:49](https://github.com/Foyer-Inc/insight-sdk/blob/9a7f1f1/src/lib/types.ts#L49)
