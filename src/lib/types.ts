
export type InsightOptions = {
    authorization?: string;
    force?: boolean;
    includeSegmentations?: boolean;
    includeTagpoints?: boolean;
    detectionsRequested?: string[];
}

export type ClassifyPayload = {
    file?: string
    files?: string[]
    url?: string;
    urls?: string[];
    force?: boolean;
    includeSegmentations?: boolean;
    includeTagpoints?: boolean;
    detectionsRequested?: string[];
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
