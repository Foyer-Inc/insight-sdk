import fetch from 'node-fetch';
import { checkStatus, resizeImage } from './helpers';

type InsightOptions = {
    includeSegmentations?: boolean;
    includeTagpoints?: boolean;
}

export class Insight {
    public includeSegmentations: boolean = false;
    public includeTagpoints: boolean = false;

    private authorization?: string;
    private baseURL = 'http://localhost:5000'
    private classifyURL = this.baseURL + '/images/classify'

    constructor(authorization?: string, options: InsightOptions = {}) {
        this.authorization = authorization
        this.includeSegmentations = options.includeSegmentations ?? false;
        this.includeTagpoints = options.includeTagpoints ?? false
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
     * @param file - image encoded as base64 string
     * @param options - can override class level properties
     * @returns classifications and detections
     * @throws can throw errors
     */
    public async classify(file: string, options: InsightOptions = {}) {
        const resized = await resizeImage(file)
        return await this.classifyRequest(resized, options);
    }

    /**
     * @param file - Array of images encoded as base64 strings
     * @param options - can override class level properties
     * @returns classifications and detections
     * @throws can throw errors
     */
    public async bulkClassify(files: string[], options: InsightOptions = {}) {
        const resized = await Promise.all(
            files.map(async (f: string) => await resizeImage(f))
        );
        return await this.classifyRequest(resized, options);
    }

    private async classifyRequest(files: string | string[], options: InsightOptions) {
        const payload = {
            file: files,
            includeSegmentations: options.includeSegmentations ?? this.includeSegmentations,
            includeTagpoints: options.includeTagpoints ?? this.includeTagpoints
        }
        let response = await fetch(this.classifyURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': this.authorization
            },
            body: JSON.stringify(payload),
        });

        response = checkStatus(response);

        return await response.json()
    }
}
