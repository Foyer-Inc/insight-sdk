import { decode, rleFromString, toMaskImageData } from "./rle"
import jimp from 'jimp';
import { makeDataURLFromDetection, sanitizeBase64 } from "./helpers";

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

    howdy = () => {
        console.log(this.metadata)
        console.log(this.detections.map((d: Detection) => d.class))
    }

    async extractDetection(className: string): Promise<string> {
        let foundDetection = this.detections.find((d: Detection) => d.class === className)

        if (foundDetection && foundDetection.segmentation) {
            const dataURL = makeDataURLFromDetection(this.image, foundDetection);
            const buf = Buffer.from(dataURL, 'base64')
            const jimpMask = await jimp.read(buf)
            // const jimpImage = await jimp.read(Buffer.from(sanitizeBase64(this.image), 'base64'))
            // jimpMask.rotate(90)
            // jimpImage.mask(jimpMask, 0, 0)

            return jimpMask.getBase64Async(jimp.MIME_JPEG);
        } else {
            return `No detection with class: ${className} found`
        }
    }
}
