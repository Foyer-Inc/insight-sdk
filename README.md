# Foyer Insight
[![npm](https://img.shields.io/npm/v/insight-sdk.svg)](https://www.npmjs.com/package/insight-sdk) [![MIT License](https://img.shields.io/github/license/Foyer-Inc/insight-sdk.svg)](https://github.com/Foyer-Inc/insight-sdk)
### Listed below is example usage of the insight-sdk
```js
import { ClassifyResult, Insight } from "insight-sdk";

//can be initialized with authorization and other defaults or with nothing
const insight = new Insight() or new Insight(options)

const options = {
    // bypass login call by providing authorization
    // defaults to ''
    authorization: string,
    // run full model even if cached data exists for this image
    // defaults to false
    force: boolean,
     // must be true for class methods to function
     // defaults to false
    includeSegmentations: boolean,
    // returns tagpoints for location of detection
    // defaults to false
    includeTagpoints: boolean,
    // if only certain detections should be returned include them here
    // defaults to ['all']
    detectionsRequested: string[]
}
/*
* if not initialized with authorization string you may call login with
* credentials. The authorization token is returned and is also
* automatically added to your insight instance
*/
const authorization = await insight.login('email', 'password')

const url = 'https://myfakewebsite.com/myfakeimage.jpg'
const file = //base 64 encoded string representation of image
/*
*Below are example calls to the classification service
* you can use async/await or promise with a callback function
*/

const result: ClassifyResult = await insight.classify(url)

//Can include a variety of options
//options provided will overrule those set on the insight instance
const anotherResult: ClassifyResult = await insight.classify(url, options)

insight.classify(url)
    .then( (result: ClassifyResult) => {
        // additional work or call class methods
    });
}

// A sample of functions available on the result
// an image, as a base64 encoded string, with the requested detection blurred
const blurredImage = await result.blurDetection('detectionName')
// an image of the requested detection with a transparent background
const extractedImage = await result.extractDetection('detectionName')

// returns an array of shape [r,g,b] for the dominant color of the named detection
const color = await result.getDetectionColor('detectionName')
//can also be passed the already extracted detection
const anotherColor = await result.getDetectionColor(extractedImage)

//also possible to check if a detection exists in the result
//returns true or false if detection is present
const found = result.checkDetection('detectionName')
//returns true or false if all detections listed are present
const multipleFound = result.checkDetection(['detectionName', 'anotherDetectionName'])
```
