[@foyer-inc/insight-sdk](../../README.md) / [Exports](../modules.md) / ClassifyResult

# Class: ClassifyResult

Class representing the result from Insight
Contains the original image as initially passed to the classify endpoint
Contains the results of a successful call to the classify endpoint

## Table of contents

### Constructors

- [constructor](ClassifyResult.md#constructor)

### Properties

- [classifications](ClassifyResult.md#classifications)
- [detections](ClassifyResult.md#detections)
- [image](ClassifyResult.md#image)
- [metadata](ClassifyResult.md#metadata)

### Methods

- [blurDetection](ClassifyResult.md#blurdetection)
- [checkDetection](ClassifyResult.md#checkdetection)
- [checkDetections](ClassifyResult.md#checkdetections)
- [extractDetection](ClassifyResult.md#extractdetection)
- [getDetectionColor](ClassifyResult.md#getdetectioncolor)
- [getDetectionMask](ClassifyResult.md#getdetectionmask)
- [updateImage](ClassifyResult.md#updateimage)

## Constructors

### constructor

• **new ClassifyResult**(`image`, `response`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `image` | `string` | the original image as initially passed to the classify endpoint |
| `response` | [`ClassifyResponse`](../interfaces/ClassifyResponse.md) | the results of a successful call to the classify endpoint |

#### Defined in

[lib/results.ts:38](https://github.com/Foyer-Inc/insight-sdk/blob/9a7f1f1/src/lib/results.ts#L38)

## Properties

### classifications

• **classifications**: [`Classification`](../interfaces/Classification.md)[]

The classifications returned by the classify endpint
See Classification interface for more information

#### Defined in

[lib/results.ts:21](https://github.com/Foyer-Inc/insight-sdk/blob/9a7f1f1/src/lib/results.ts#L21)

___

### detections

• **detections**: [`Detection`](../interfaces/Detection.md)[]

The detections returned by the classify endpint
See Detection interface for more information

#### Defined in

[lib/results.ts:26](https://github.com/Foyer-Inc/insight-sdk/blob/9a7f1f1/src/lib/results.ts#L26)

___

### image

• **image**: `string`

The image as initially passed to the classify endpoint
If was a url, will be changed to a base64 string for post processing functions

#### Defined in

[lib/results.ts:16](https://github.com/Foyer-Inc/insight-sdk/blob/9a7f1f1/src/lib/results.ts#L16)

___

### metadata

• **metadata**: [`ImageMetadata`](../interfaces/ImageMetadata.md)

Metadata relating to the input image.
See ImageMetadata interface for more information

#### Defined in

[lib/results.ts:31](https://github.com/Foyer-Inc/insight-sdk/blob/9a7f1f1/src/lib/results.ts#L31)

## Methods

### blurDetection

▸ **blurDetection**(`name`): `Promise`<`string`\>

This function serves to blur a particular detection in the image

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | the name of the detection to blur in the image, will only work if detection was returned with includeSegmentations=true |

#### Returns

`Promise`<`string`\>

Image with detection blurred as base64 encoded string

#### Defined in

[lib/results.ts:50](https://github.com/Foyer-Inc/insight-sdk/blob/9a7f1f1/src/lib/results.ts#L50)

___

### checkDetection

▸ **checkDetection**(`name`): `boolean`

Check if a certain detection was returned for this image

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | name of the detection to find |

#### Returns

`boolean`

true if detection was found and false otherwise

#### Defined in

[lib/results.ts:98](https://github.com/Foyer-Inc/insight-sdk/blob/9a7f1f1/src/lib/results.ts#L98)

___

### checkDetections

▸ **checkDetections**(`names`): `boolean`

Check if an array of detections were returned for this image

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `names` | `string`[] | array of names of detections to find |

#### Returns

`boolean`

true if all detections are found, false otherwise

#### Defined in

[lib/results.ts:107](https://github.com/Foyer-Inc/insight-sdk/blob/9a7f1f1/src/lib/results.ts#L107)

___

### extractDetection

▸ **extractDetection**(`name`): `Promise`<`string`\>

This function serves to extract a particular detection in the image

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | the name of the detection to extract from the image, will only work if detection was returned with includeSegmentations=true |

#### Returns

`Promise`<`string`\>

Image of the extracted detection with transparent background as base64 encoded string

#### Defined in

[lib/results.ts:65](https://github.com/Foyer-Inc/insight-sdk/blob/9a7f1f1/src/lib/results.ts#L65)

___

### getDetectionColor

▸ **getDetectionColor**(`detection`): `Promise`<`number`[]\>

This function returns the dominant color of a particular detection

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `detection` | `string` | the name of the detection to be isolated or a base64 encoded string of the mask already extracted by extractDetection |

#### Returns

`Promise`<`number`[]\>

number array where [r, g, b] represents the color

#### Defined in

[lib/results.ts:83](https://github.com/Foyer-Inc/insight-sdk/blob/9a7f1f1/src/lib/results.ts#L83)

___

### getDetectionMask

▸ `Private` **getDetectionMask**(`name`): `Promise`<`string`\>

Internal function for decoding detection segmentation into base64 string

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | the name of the detection to find |

#### Returns

`Promise`<`string`\>

the found detection as base64 string or an empty string

#### Defined in

[lib/results.ts:122](https://github.com/Foyer-Inc/insight-sdk/blob/9a7f1f1/src/lib/results.ts#L122)

___

### updateImage

▸ `Private` **updateImage**(): `Promise`<`void`\>

Internal function to change image from url to a base64 encoded string
for use in subsequent function calls

#### Returns

`Promise`<`void`\>

#### Defined in

[lib/results.ts:137](https://github.com/Foyer-Inc/insight-sdk/blob/9a7f1f1/src/lib/results.ts#L137)
