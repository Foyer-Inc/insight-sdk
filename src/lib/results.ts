import { applyBlur, makeMaskStringFromDetection } from "./helpers";
import { Classification, Detection, ImageMetadata } from "./types";

/**
 * Class representing the result from Insight classify
 */
export class ClassifyResult {
    image: string;
    classifications: Classification[];
    detections?: Detection[];
    metadata: ImageMetadata

    constructor(image: string, result: any) {
        this.image = image;
        this.classifications = result.classifications
        this.detections = result.detections
        this.metadata = result.metadata
    }

    /**
     *
     * @param className the name of the detection to blur in the original image, will only work if detection was returned with includeSegmentations= true
     * @returns Image with detection blurred as base64 encoded string
     */
    async blurDetection(className: string): Promise<string> {
        let foundDetection = this.detections.find((d: Detection) => d.class === className)

        if (foundDetection && foundDetection.segmentation) {
            const maskImage = await makeMaskStringFromDetection(foundDetection);
            return await applyBlur(this.image, maskImage);

        } else {
            return `No detection with class: ${className} found`
        }
    }
}
