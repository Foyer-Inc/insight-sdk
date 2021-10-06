[@foyer-inc/insight-sdk](../../README.md) / [Exports](../modules.md) / InsightOptions

# Interface: InsightOptions

An interface describing the options available when declaring a
new Insight() instance

## Table of contents

### Properties

- [authorization](InsightOptions.md#authorization)
- [detectionsRequested](InsightOptions.md#detectionsrequested)
- [force](InsightOptions.md#force)
- [includeSegmentations](InsightOptions.md#includesegmentations)
- [includeTagpoints](InsightOptions.md#includetagpoints)

## Properties

### authorization

• `Optional` **authorization**: `string`

An authorization token for Foyer Insight services

#### Defined in

[lib/types.ts:9](https://github.com/Foyer-Inc/insight-sdk/blob/9a7f1f1/src/lib/types.ts#L9)

___

### detectionsRequested

• `Optional` **detectionsRequested**: `string`[]

An array of detections names to be returned in ClassifyResponse

#### Defined in

[lib/types.ts:27](https://github.com/Foyer-Inc/insight-sdk/blob/9a7f1f1/src/lib/types.ts#L27)

___

### force

• `Optional` **force**: `boolean`

A flag requesting a new result even when cached data exists

#### Defined in

[lib/types.ts:13](https://github.com/Foyer-Inc/insight-sdk/blob/9a7f1f1/src/lib/types.ts#L13)

___

### includeSegmentations

• `Optional` **includeSegmentations**: `boolean`

A flag requesting the segmentations property to be returned
with each Detection, necessary for post processing

#### Defined in

[lib/types.ts:18](https://github.com/Foyer-Inc/insight-sdk/blob/9a7f1f1/src/lib/types.ts#L18)

___

### includeTagpoints

• `Optional` **includeTagpoints**: `boolean`

A flag requesting the tagpoint attribute to be returned
with each Detection

#### Defined in

[lib/types.ts:23](https://github.com/Foyer-Inc/insight-sdk/blob/9a7f1f1/src/lib/types.ts#L23)
