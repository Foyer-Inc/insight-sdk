import { blur, extract, getImageSize, makeMaskStringFromDetection } from "./utils/helpers";
import { Classification, ClassifyResponse, Detection, ImageMetadata } from "./types";

/**
 * Class representing the result from Insight
 * Contains the original image as a base64 string
 * Contains the results of a successful call to the classify endpoint
 */
export class ClassifyResult {
    image: string;
    classifications: Classification[];
    detections: Detection[];
    metadata: ImageMetadata

    constructor(image: string, response: ClassifyResponse) {
        this.image = image;
        this.classifications = response.classifications
        this.detections = response.detections
        this.metadata = response.metadata
    }

    /**
     * This function serves to blur a particular detection in the image
     * @param className the name of the detection to blur in the image, will only work if detection was returned with includeSegmentations=true
     * @returns Image with detection blurred as base64 encoded string
     */
    async blurDetection(name: string): Promise<string> {
        const mask = await this.getDetectionMask(name);
        if (mask) {
            return await blur(this.image, mask);
        } else {
            throw new Error(`No detection with class: ${name} found`)
        }
    }

    /**
     * This function serves to extract a particular detection in the image
     * @param className the name of the detection to extract from the image, will only work if detection was returned with includeSegmentations=true
     * @returns Image of the extracted detection with transparent background as base64 encoded string
     */
    async extractDetection(name: string): Promise<string> {
        const mask = await this.getDetectionMask(name);

        if (mask) {
            return await extract(this.image, mask);
        } else {
            throw new Error(`No detection with class: ${name} found`)
        }
    }

    /**
     * Check if a certain detection was returned for this image
     * @param name name of the detection to find
     * @returns true if detection was found and false otherwise
     */
    checkDetection(name: string): boolean {
        return this.detections.findIndex((d: Detection) => d.class === name) !== -1
    }

    /**
     *Check if an array of detections were returned for this image
     * @param names array of names of detections to find
     * @returns true if all detections are found, false otherwise
     */
    checkDetections(names: string[]): boolean {
        for (let i = 0; i < names.length; i++) {
            const n = names[i]
            console.log(this.detections.findIndex((d: Detection) => d.class === n))
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
}
