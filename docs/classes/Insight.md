[@foyer-inc/insight-sdk](../../README.md) / [Exports](../modules.md) / Insight

# Class: Insight

A class for sending requests to Foyer Insight services

## Table of contents

### Constructors

- [constructor](Insight.md#constructor)

### Properties

- [authorization](Insight.md#authorization)
- [baseURL](Insight.md#baseurl)
- [detectionsRequested](Insight.md#detectionsrequested)
- [force](Insight.md#force)
- [includeSegmentations](Insight.md#includesegmentations)
- [includeTagpoints](Insight.md#includetagpoints)

### Methods

- [bulkClassify](Insight.md#bulkclassify)
- [classify](Insight.md#classify)
- [classifyRequest](Insight.md#classifyrequest)
- [login](Insight.md#login)
- [setAuthorization](Insight.md#setauthorization)

## Constructors

### constructor

• **new Insight**(`options?`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | [`InsightOptions`](../interfaces/InsightOptions.md) | see InsightOptions interface for more information |

#### Defined in

[lib/insight.ts:48](https://github.com/Foyer-Inc/insight-sdk/blob/9a7f1f1/src/lib/insight.ts#L48)

## Properties

### authorization

• `Private` `Optional` **authorization**: `string`

An authorization token for Foyer Insight services

#### Defined in

[lib/insight.ts:14](https://github.com/Foyer-Inc/insight-sdk/blob/9a7f1f1/src/lib/insight.ts#L14)

___

### baseURL

• **baseURL**: `string` = `'https://api.foyer.ai'`

#### Defined in

[lib/insight.ts:42](https://github.com/Foyer-Inc/insight-sdk/blob/9a7f1f1/src/lib/insight.ts#L42)

___

### detectionsRequested

• **detectionsRequested**: `string`[]

An array of detections names to be returned in ClassifyResponse
defaults to ['all'] for returning all available detections

#### Defined in

[lib/insight.ts:40](https://github.com/Foyer-Inc/insight-sdk/blob/9a7f1f1/src/lib/insight.ts#L40)

___

### force

• **force**: `boolean` = `false`

A flag requesting a new result even when cached data exists
defaults to false

#### Defined in

[lib/insight.ts:20](https://github.com/Foyer-Inc/insight-sdk/blob/9a7f1f1/src/lib/insight.ts#L20)

___

### includeSegmentations

• **includeSegmentations**: `boolean` = `false`

A flag requesting the segmentations property to be returned
with each Detection, necessary for post processing
defaults to false

#### Defined in

[lib/insight.ts:27](https://github.com/Foyer-Inc/insight-sdk/blob/9a7f1f1/src/lib/insight.ts#L27)

___

### includeTagpoints

• **includeTagpoints**: `boolean` = `false`

A flag requesting the tagpoint attribute to be returned
with each Detection
defaults to false

#### Defined in

[lib/insight.ts:34](https://github.com/Foyer-Inc/insight-sdk/blob/9a7f1f1/src/lib/insight.ts#L34)

## Methods

### bulkClassify

▸ **bulkClassify**(`images`, `options?`): `Promise`<[`ClassifyResult`](ClassifyResult.md)[]\>

**`throws`** can throw errors

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `images` | `string`[] | Array of images encoded as base64 strings, must include data prefix, or urls, not both |
| `options` | [`InsightOptions`](../interfaces/InsightOptions.md) | can override class level properties |

#### Returns

`Promise`<[`ClassifyResult`](ClassifyResult.md)[]\>

classifications and detections

#### Defined in

[lib/insight.ts:108](https://github.com/Foyer-Inc/insight-sdk/blob/9a7f1f1/src/lib/insight.ts#L108)

___

### classify

▸ **classify**(`image`, `options?`): `Promise`<[`ClassifyResult`](ClassifyResult.md)\>

**`throws`** can throw errors

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `image` | `string` | image encoded as base64 string or as a url |
| `options` | [`InsightOptions`](../interfaces/InsightOptions.md) | can override class level properties |

#### Returns

`Promise`<[`ClassifyResult`](ClassifyResult.md)\>

classifications and detections

#### Defined in

[lib/insight.ts:97](https://github.com/Foyer-Inc/insight-sdk/blob/9a7f1f1/src/lib/insight.ts#L97)

___

### classifyRequest

▸ `Private` **classifyRequest**(`images`, `options`): `Promise`<[`ClassifyResult`](ClassifyResult.md) \| [`ClassifyResult`](ClassifyResult.md)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `images` | `string` \| `string`[] |
| `options` | [`InsightOptions`](../interfaces/InsightOptions.md) |

#### Returns

`Promise`<[`ClassifyResult`](ClassifyResult.md) \| [`ClassifyResult`](ClassifyResult.md)[]\>

#### Defined in

[lib/insight.ts:112](https://github.com/Foyer-Inc/insight-sdk/blob/9a7f1f1/src/lib/insight.ts#L112)

___

### login

▸ **login**(`email`, `password`): `Promise`<`string`\>

**`throws`** {HTTPResponseError} Will throw when unauthorized

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `email` | `string` | email used for login |
| `password` | `string` | password used for login |

#### Returns

`Promise`<`string`\>

authorization string, automatically saved into class as well

#### Defined in

[lib/insight.ts:70](https://github.com/Foyer-Inc/insight-sdk/blob/9a7f1f1/src/lib/insight.ts#L70)

___

### setAuthorization

▸ **setAuthorization**(`authorization`): `void`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `authorization` | `string` | if you already have a valid token you may set it in lieu of making a login request |

#### Returns

`void`

#### Defined in

[lib/insight.ts:60](https://github.com/Foyer-Inc/insight-sdk/blob/9a7f1f1/src/lib/insight.ts#L60)
