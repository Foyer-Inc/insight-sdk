"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Insight = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const helpers_1 = require("./utils/helpers");
const results_1 = require("./results");
/**
 * A class for sending requests to Foyer Insight services
 */
class Insight {
    /**
     * @constructor
     * @param options see InsightOptions interface for more information
     */
    constructor(options = {}) {
        var _a, _b, _c, _d;
        /**
         * A flag requesting a new result even when cached data exists
         * defaults to false
         */
        this.force = false;
        /**
         * A flag requesting the segmentations property to be returned
         * with each Detection, necessary for post processing
         * defaults to false
         */
        this.includeSegmentations = false;
        /**
         * A flag requesting the tagpoint attribute to be returned
         * with each Detection
         * defaults to false
         */
        this.includeTagpoints = false;
        /**
         * An array of detections names to be returned in ClassifyResponse
         * defaults to ['all'] for returning all available detections
         */
        this.detectionsRequested = ['all'];
        this.baseURL = 'https://api-v2.foyer.ai';
        this.authorization = options.authorization;
        this.force = (_a = options.force) !== null && _a !== void 0 ? _a : false;
        this.includeSegmentations = (_b = options.includeSegmentations) !== null && _b !== void 0 ? _b : false;
        this.includeTagpoints = (_c = options.includeTagpoints) !== null && _c !== void 0 ? _c : false;
        this.detectionsRequested = (_d = options.detectionsRequested) !== null && _d !== void 0 ? _d : ['all'];
    }
    /**
     *
     * @param authorization - if you already have a valid token you may set it in lieu of making a login request
     */
    setAuthorization(authorization) {
        this.authorization = authorization;
    }
    /**
     * @param email - email used for login
     * @param password - password used for login
     * @returns authorization string, automatically saved into class as well
     * @throws {HTTPResponseError} Will throw when unauthorized
     */
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield (0, node_fetch_1.default)(`${this.baseURL}/User/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
            response = (0, helpers_1.checkStatus)(response);
            const auth = response.headers.get('authorization');
            if (auth) {
                this.authorization = auth;
            }
            return auth;
        });
    }
    /**
     * @param image - image encoded as base64 string or as a url
     * @param options - can override class level properties
     * @returns classifications and detections
     * @throws can throw errors
     */
    classify(image, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.classifyRequest(image, options));
        });
    }
    /**
     * @param images - Array of images encoded as base64 strings, must include data prefix, or urls, not both
     * @param options - can override class level properties
     * @returns classifications and detections
     * @throws can throw errors
     */
    bulkClassify(images, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.classifyRequest(images, options));
        });
    }
    classifyRequest(images, options) {
        var _a, _b, _c, _d, _e;
        return __awaiter(this, void 0, void 0, function* () {
            let payload = {
                force: (_a = options.force) !== null && _a !== void 0 ? _a : this.force,
                includeSegmentations: (_b = options.includeSegmentations) !== null && _b !== void 0 ? _b : this.includeSegmentations,
                includeTagpoints: (_c = options.includeTagpoints) !== null && _c !== void 0 ? _c : this.includeTagpoints,
                detectionsRequested: (_d = options.detectionsRequested) !== null && _d !== void 0 ? _d : this.detectionsRequested,
            };
            payload = yield (0, helpers_1.addImagesToPayload)(images, payload);
            let response = yield (0, node_fetch_1.default)(`${this.baseURL}/Media/classify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: (_e = options.authorization) !== null && _e !== void 0 ? _e : this.authorization,
                },
                body: JSON.stringify(payload),
            });
            response = (0, helpers_1.checkStatus)(response);
            const result = yield response.json();
            if (Array.isArray(result)) {
                return result.map((r, idx) => new results_1.ClassifyResult(images[idx], r));
            }
            else {
                return new results_1.ClassifyResult(images, result);
            }
        });
    }
}
exports.Insight = Insight;
//# sourceMappingURL=insight.js.map