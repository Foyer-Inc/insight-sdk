import fetch from 'node-fetch';
import { addImagesToPayload, checkStatus } from './utils/helpers';
import { ClassifyResult } from './results';
import { InsightOptions, ClassifyPayload } from './types';

export class Insight {
    public force: boolean = false
    public includeSegmentations: boolean = false;
    public includeTagpoints: boolean = false;
    public detectionsRequested: string[] = ['all'];
    private authorization?: string;
    public baseURL = 'https://api.foyer.ai'
    private classifyURL = this.baseURL + '/images/classify'

    constructor(options: InsightOptions = {}) {
        this.authorization = options.authorization
        this.force = options.force ?? false
        this.includeSegmentations = options.includeSegmentations ?? false;
        this.includeTagpoints = options.includeTagpoints ?? false
        this.detectionsRequested = options.detectionsRequested ?? ['all'];
    }

    /**
     *
     * @param authorization - if you already have a valid token you may set it in lieu of making a login request
     */
    public setAuthorization(authorization: string): void {
        this.authorization = authorization
    }

    /**
     * @param email - email used for login
     * @param password - password used for login
     * @returns authorization string, automatically saved into class as well
     * @throws {HTTPResponseError} Will throw when unauthorized
     */
    public async login(email: string, password: string): Promise<string> {
        let response = await fetch(`${this.baseURL}/accounts/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',

            },
            body: JSON.stringify({ email, password }),
        });

        response = checkStatus(response);

        const auth = response.headers.get('authorization');

        if (auth) {
            this.authorization = auth;
        }

        return auth;
    }

    /**
     * @param image - image encoded as base64 string or as a url
     * @param options - can override class level properties
     * @returns classifications and detections
     * @throws can throw errors
     */
    public async classify(image: string, options: InsightOptions = {}): Promise<ClassifyResult> {
        return await this.classifyRequest(image, options) as ClassifyResult

    }

    /**
     * @param images - Array of images encoded as base64 strings, must include data prefix, or urls, not both
     * @param options - can override class level properties
     * @returns classifications and detections
     * @throws can throw errors
     */
    public async bulkClassify(images: string[], options: InsightOptions = {}): Promise<ClassifyResult[]> {
        return await this.classifyRequest(images, options) as ClassifyResult[];
    }

    private async classifyRequest(images: string | string[], options: InsightOptions): Promise<ClassifyResult | ClassifyResult[]> {
        let payload: ClassifyPayload = {
            force: options.force ?? this.force,
            includeSegmentations: options.includeSegmentations ?? this.includeSegmentations,
            includeTagpoints: options.includeTagpoints ?? this.includeTagpoints,
            detectionsRequested: options.detectionsRequested ?? this.detectionsRequested
        }

        payload = await addImagesToPayload(images, payload);

        let response = await fetch(this.classifyURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': options.authorization ?? this.authorization
            },
            body: JSON.stringify(payload),
        });

        response = checkStatus(response);

        const result = await response.json()

        if (Array.isArray(result)) {
            return result.map((r: any, idx: number) => new ClassifyResult(images[idx], r))
        } else {
            return new ClassifyResult(images as string, result);
        }
    }
}
