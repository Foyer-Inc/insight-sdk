import fetch from 'node-fetch';
import { getColor } from './utils/colorthief';
import { blur, extract, getImageSize, makeMaskStringFromDetection } from "./utils/helpers";
import { Classification, ClassifyResponse, Detection, ImageMetadata } from "./types";

/**
 * Class representing the result from Insight
 * Contains the original image as initially passed to the classify endpoint
 * Contains the results of a successful call to the classify endpoint
 */
export class ClassifyResult {
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
    metadata: ImageMetadata

    /**
     * @constructor
     * @param image the original image as initially passed to the classify endpoint
     * @param response the results of a successful call to the classify endpoint
     */
    constructor(image: string, response: ClassifyResponse) {
        this.image = image;
        this.classifications = response.classifications
        this.detections = response.detections
        this.metadata = response.metadata
    }

    /**
     * This function serves to blur a particular detection in the image
     * @param name the name of the detection to blur in the image, will only work if detection was returned with includeSegmentations=true
     * @returns Image with detection blurred as base64 encoded string
     */
    public async blurDetection(name: string): Promise<string> {
        await this.updateImage()
        const mask = await this.getDetectionMask(name);
        if (mask) {
            return await blur(this.image, mask);
        } else {
            throw new Error(`No detection with class: ${name} found`)
        }
    }

    /**
     * This function serves to extract a particular detection in the image
     * @param name the name of the detection to extract from the image, will only work if detection was returned with includeSegmentations=true
     * @returns Image of the extracted detection with transparent background as base64 encoded string
     */
    public async extractDetection(name: string): Promise<string> {
        await this.updateImage()
        const mask = await this.getDetectionMask(name);

        if (mask) {
            return await extract(this.image, mask);
        } else {
            throw new Error(`No detection with class: ${name} found`)
        }
    }


    /**
     * This function returns the dominant color of a particular detection
     * @param detection - the name of the detection to be isolated
     * or a base64 encoded string of the mask already extracted by extractDetection
     * @returns number array where [r, g, b] represents the color
     */
    public async getDetectionColor(detection: string): Promise<number[]> {
        let extractedMask: string;
        if (detection.startsWith('data')) {
            extractedMask = detection
        } else {
            extractedMask = await this.extractDetection(detection);
        }
        return await getColor(extractedMask)
    }

    /**
     * Check if a certain detection was returned for this image
     * @param name name of the detection to find
     * @returns true if detection was found and false otherwise
     */
    public checkDetection(name: string): boolean {
        return this.detections.findIndex((d: Detection) => d.class === name) !== -1
    }

    /**
     *Check if an array of detections were returned for this image
     * @param names array of names of detections to find
     * @returns true if all detections are found, false otherwise
     */
    public checkDetections(names: string[]): boolean {
        for (let i = 0; i < names.length; i++) {
            const n = names[i]
            if (this.detections.findIndex((d: Detection) => d.class === n) === -1) {
                return false
            }
        }
        return true;
    }

    /**
     * Internal function for decoding detection segmentation into base64 string
     * @param name the name of the detection to find
     * @returns the found detection as base64 string or an empty string
     */
    private async getDetectionMask(name: string): Promise<string> {
        let foundDetection = this.detections.find((d: Detection) => d.class === name)

        if (foundDetection && foundDetection.segmentation) {
            const { width, height } = await getImageSize(this.image);
            return await makeMaskStringFromDetection(foundDetection, width, height);
        }

        return '';
    }

    /**
     * Internal function to change image from url to a base64 encoded string
     * for use in subsequent function calls
     */
    private async updateImage(): Promise<void> {
        if (!this.image.startsWith('data')) {
            const img = await fetch(this.image);
            const buffer = await img.buffer();
            this.image = `data:${img.headers.get('content-type')};base64,${buffer.toString('base64')}`;
        }
    }
}
