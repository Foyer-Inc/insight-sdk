import { ClassifyResult } from './results';
import { InsightOptions } from './types';
export declare class Insight {
    force: boolean;
    includeSegmentations: boolean;
    includeTagpoints: boolean;
    detectionsRequested: string[];
    private authorization?;
    baseURL: string;
    private classifyURL;
    constructor(options?: InsightOptions);
    /**
     *
     * @param authorization - if you already have a valid token you may set it in lieu of making a login request
     */
    setAuthorization(authorization: string): void;
    /**
     * @param email - email used for login
     * @param password - password used for login
     * @returns authorization string, automatically saved into class as well
     * @throws {HTTPResponseError} Will throw when unauthorized
     */
    login(email: string, password: string): Promise<string>;
    /**
     * @param image - image encoded as base64 string or as a url
     * @param options - can override class level properties
     * @returns classifications and detections
     * @throws can throw errors
     */
    classify(image: string, options?: InsightOptions): Promise<ClassifyResult>;
    /**
     * @param images - Array of images encoded as base64 strings, must include data prefix, or urls, not both
     * @param options - can override class level properties
     * @returns classifications and detections
     * @throws can throw errors
     */
    bulkClassify(images: string[], options?: InsightOptions): Promise<ClassifyResult[]>;
    private classifyRequest;
}
