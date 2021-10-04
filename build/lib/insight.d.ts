import { ClassifyResult } from './results';
import { InsightOptions } from './types';
/**
 * A class for sending requests to Foyer Insight services
 */
export declare class Insight {
    /**
     * An authorization token for Foyer Insight services
     */
    private authorization?;
    /**
     * A flag requesting a new result even when cached data exists
     * defaults to false
     */
    force: boolean;
    /**
     * A flag requesting the segmentations property to be returned
     * with each Detection, necessary for post processing
     * defaults to false
     */
    includeSegmentations: boolean;
    /**
     * A flag requesting the tagpoint attribute to be returned
     * with each Detection
     * defaults to false
     */
    includeTagpoints: boolean;
    /**
     * An array of detections names to be returned in ClassifyResponse
     * defaults to ['all'] for returning all available detections
     */
    detectionsRequested: string[];
    baseURL: string;
    /**
     * @constructor
     * @param options see InsightOptions interface for more information
     */
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
