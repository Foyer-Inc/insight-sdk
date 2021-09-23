export declare type InsightOptions = {
    authorization?: string;
    force?: boolean;
    includeSegmentations?: boolean;
    includeTagpoints?: boolean;
    detectionsRequested?: string[];
};
export declare type ClassifyPayload = {
    file?: string;
    files?: string[];
    url?: string;
    urls?: string[];
    force?: boolean;
    includeSegmentations?: boolean;
    includeTagpoints?: boolean;
    detectionsRequested?: string[];
};
export declare type Classification = {
    confidence: number;
    name: string;
    rank: number;
};
export declare type Detection = {
    class: string;
    area: number;
    boundingBox: number[];
    confidence: number;
    attributes: object[];
    segmentation?: Segmentation;
};
export declare type Segmentation = {
    size: number[];
    counts: string;
};
export declare type ImageMetadata = {
    md5: string;
    width: number;
    height: number;
};
export declare type ClassifyResponse = {
    classifications: Classification[];
    detections: Detection[];
    metadata: ImageMetadata;
};
