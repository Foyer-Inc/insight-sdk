import { applyBlur, makeMaskStringFromDetection } from "./helpers";

export type InsightOptions = {
    authorization?: string;
    force?: boolean;
    includeSegmentations?: boolean;
    includeTagpoints?: boolean;
}

export type ClassifyPayload = {
    file?: string
    files?: string[]
    url?: string;
    urls?: string[];
    force?: boolean;
    includeSegmentations?: boolean;
    includeTagpoints?: boolean;
}

export type Classification = {
    confidence: number;
    name: string;
    rank: number;
}

export type Detection = {
    class: string;
    area: number;
    boundingBox: number[];
    confidence: number;
    attributes: object[]
    segmentation?: Segmentation;
}

export type Segmentation = {
    size: number[];
    counts: string;
}

export type ImageMetadata = {
    md5: string;
    width: number;
    height: number;
};

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
     * @param className the name of the detection to blur in the original image
     * @returns Image with detection blurred as base64 encoded string
     */
    async blurDetection(className: string): Promise<string> {
        let foundDetection = this.detections.find((d: Detection) => d.class === className)

        if (foundDetection && foundDetection.segmentation) {
            const maskImage = await makeMaskStringFromDetection(foundDetection);
            return applyBlur(this.image, maskImage);

        } else {
            return `No detection with class: ${className} found`
        }
    }
}
