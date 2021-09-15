import { decode, rleFromString, toMaskImageData } from "./rle"
import jimp from 'jimp';

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

type Classification = {
    confidence: number;
    name: string;
    rank: number;
}

type Detection = {
    class: string;
    area: number;
    boundingBox: number[];
    confidence: number;
    attributes: object[]
    segmentation?: Segmentation;
}

type Segmentation = {
    size: number[];
    counts: string;
}

type ImageMetadata = {
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

    async extractDetection(className: string) {
        console.log(className);
        console.log(this.detections.map((d: Detection) => d.class))

        let foundDetection = this.detections.find((d: Detection) => d.class === className)
        console.log(foundDetection)
        if (foundDetection && foundDetection.segmentation) {
            //let encodedMessage = utf8Encode.encode(cocoCounts);
            const { size, counts } = foundDetection.segmentation;
            const mask = toMaskImageData(decode(rleFromString(counts)), size[0], size[1]);
            const canvas = document.createElement("canvas")
            canvas.width = mask.width
            canvas.height = mask.height
            const ctx = canvas.getContext("2d");
            ctx.putImageData(mask, 0, 0);
            const b64 = canvas.toDataURL()
            const jimpMask = await jimp.read(Buffer.from(b64, "base64"))
            jimpMask.write("assets/mask.png")
        } else {
            return `No detection with class: ${className} found`
        }
    }
}
