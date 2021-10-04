/**
 * An interface describing the options available when declaring a
 * new Insight() instance
 */
export interface InsightOptions {
    /**
     * An authorization token for Foyer Insight services
     */
    authorization?: string;
    /**
     * A flag requesting a new result even when cached data exists
     */
    force?: boolean;
    /**
     * A flag requesting the segmentations property to be returned
     * with each Detection, necessary for post processing
     */
    includeSegmentations?: boolean;
    /**
     * A flag requesting the tagpoint attribute to be returned
     * with each Detection
     */
    includeTagpoints?: boolean;
    /**
     * An array of detections names to be returned in ClassifyResponse
     */
    detectionsRequested?: string[];
}

/**
 * An interface describing the payload sent to the classify endpoint
 */
export interface ClassifyPayload {
    /**
     * An image encoded as a base64 string
     */
    file?: string
    /**
     * An array of images encoded as base64 strings
     */
    files?: string[]
    /**
     * A url for a remotely hosted image
     */
    url?: string;
    /**
     * An array of urls for remotely hosted images
     */
    urls?: string[];
    /**
     * A flag requesting a new result even when cached data exists
     */
    force?: boolean;
    /**
     * A flag requesting the segmentations property to be returned
     * with each Detection, necessary for post processing
     */
    includeSegmentations?: boolean;
    /**
     * A flag requesting the tagpoint attribute to be returned
     * with each Detection
     */
    includeTagpoints?: boolean;
    /**
     * An array of detections names to be returned in ClassifyResponse
     */
    detectionsRequested?: string[];
}

/**
 * An interface describing a classification returned by the classify endpoint
 */
export interface Classification {
    /**
     * A number between 0 and 1 that represents the likelihood that the
     * output of the Insight classification model is correct
     */
    confidence: number;
    /**
     * The name of this classification, e.g. bathroom, bedroom, etc.
     */
    name: string;
    /**
     * A number related to an ordering when multiple classifications are returned for an image
     */
    rank: number;
}

/**
 * An interface describing a detection returned by the classify endpoint
 */
export interface Detection {
    /**
     * The name of the detection
     */
    class: string;
    /**
     * A number between 0 and 1 that represents what percentage of the image
     * the given Detection occupies
     */
    area: number;
    /**
     * An array of shape [x1, y1, x2, y2] where
     * items are (x1, y1) represents the upperleft corner of the Detection
     * and (x2, y2) represent the lowerright corner of the Detection
     * Each value is a number between 0 and 1 and represents a percentage
     * of distance across an image in either the x or y axes.
     */
    boundingBox: number[];
    /**
     * A number between 0 and 1 that represents the likelihood that the
     * output of the Insight object detection model is correct
     */
    confidence: number;
    /**
     * Attributes are more specific features gathered from the objects detected in the images.
     * For the detections that have them, the attributes will give more robust information about the image.
     * Attributes will always have a name field and a value field.
     */
    attributes: object[]
    segmentation?: Segmentation;
}

/**
 * An interface describing a segmentation returned within a Detection from the classify endpoint
 */
export interface Segmentation {
    /**
     * An array of shape [width, height] for the size of the detection
     */
    size: number[];
    /**
     * A string representing the shape of the detection
     */
    counts: string;
}

/**
 * An interface describing metadata about an image returned by the classify endpoint
 */
export interface ImageMetadata {
    /**
     * A unique hash of the image
     */
    md5: string;
    /**
     * the width of the input image
     */
    width: number;
    /**
     * the height of the input image
     */
    height: number;
};

/**
 * A interface describing the response returned by the classify endpoint
 */
export interface ClassifyResponse {
    /**
     * An array of classifications for an image as returned by the Insight classification model.
     * See Classification for more information
     */
    classifications: Classification[];
    /**
     * An array of detections for an image as returned by the Insight object detection model.
     * See Classification for more information
     */
    detections: Detection[];
    /**
     * An object describing metadata of the input image
     */
    metadata: ImageMetadata;
}
