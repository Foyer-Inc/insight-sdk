import { applyBlur, getImageSize, makeMaskStringFromDetection } from "./helpers";
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
    async blurDetection(className: string): Promise<string> {
        let foundDetection = this.detections.find((d: Detection) => d.class === className)

        if (foundDetection && foundDetection.segmentation) {
            const { width, height } = await getImageSize(this.image);
            const maskImage = await makeMaskStringFromDetection(foundDetection, width, height);
            return await applyBlur(this.image, maskImage);

        } else {
            throw new Error(`No detection with class: ${className} found`)
        }
    }
}
