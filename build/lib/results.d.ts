import { Classification, ClassifyResponse, Detection, ImageMetadata } from "./types";
/**
 * Class representing the result from Insight
 * Contains the original image as initially passed to the classify endpoint
 * Contains the results of a successful call to the classify endpoint
 */
export declare class ClassifyResult {
    /**
     * The image as initially passed to the classify endpoint
     * If was a url, will be changed to a base64 string for post processing functions
     */
    image: string;
    /**
     * The classifications returned by the classify endpint
     * See Classification interface for more information
     */
    classifications: Classification[];
    /**
     * The detections returned by the classify endpint
     * See Detection interface for more information
     */
    detections: Detection[];
    /**
     * Metadata relating to the input image.
     * See ImageMetadata interface for more information
     */
    metadata: ImageMetadata;
    /**
     * @constructor
     * @param image the original image as initially passed to the classify endpoint
     * @param response the results of a successful call to the classify endpoint
     */
    constructor(image: string, response: ClassifyResponse);
    /**
     * This function serves to blur a particular detection in the image
     * @param name the name of the detection to blur in the image, will only work if detection was returned with includeSegmentations=true
     * @returns Image with detection blurred as base64 encoded string
     */
    blurDetection(name: string): Promise<string>;
    /**
     * This function serves to extract a particular detection in the image
     * @param name the name of the detection to extract from the image, will only work if detection was returned with includeSegmentations=true
     * @returns Image of the extracted detection with transparent background as base64 encoded string
     */
    extractDetection(name: string): Promise<string>;
    /**
     * This function returns the dominant color of a particular detection
     * @param detection - the name of the detection to be isolated
     * or a base64 encoded string of the mask already extracted by extractDetection
     * @returns number array where [r, g, b] represents the color
     */
    getDetectionColor(detection: string): Promise<number[]>;
    /**
     * Check if a certain detection was returned for this image
     * @param name name of the detection to find
     * @returns true if detection was found and false otherwise
     */
    checkDetection(name: string): boolean;
    /**
     *Check if an array of detections were returned for this image
     * @param names array of names of detections to find
     * @returns true if all detections are found, false otherwise
     */
    checkDetections(names: string[]): boolean;
    /**
     * Internal function for decoding detection segmentation into base64 string
     * @param name the name of the detection to find
     * @returns the found detection as base64 string or an empty string
     */
    private getDetectionMask;
    /**
     * Internal function to change image from url to a base64 encoded string
     * for use in subsequent function calls
     */
    private updateImage;
}
