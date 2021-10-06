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
exports.ClassifyResult = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const colorthief_1 = require("./utils/colorthief");
const helpers_1 = require("./utils/helpers");
/**
 * Class representing the result from Insight
 * Contains the original image as initially passed to the classify endpoint
 * Contains the results of a successful call to the classify endpoint
 */
class ClassifyResult {
    /**
     * @constructor
     * @param image the original image as initially passed to the classify endpoint
     * @param response the results of a successful call to the classify endpoint
     */
    constructor(image, response) {
        this.image = image;
        this.classifications = response.classifications;
        this.detections = response.detections;
        this.metadata = response.metadata;
    }
    /**
     * This function serves to blur a particular detection in the image
     * @param name the name of the detection to blur in the image, will only work if detection was returned with includeSegmentations=true
     * @returns Image with detection blurred as base64 encoded string
     */
    blurDetection(name) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.updateImage();
            const mask = yield this.getDetectionMask(name);
            if (mask) {
                return yield (0, helpers_1.blur)(this.image, mask);
            }
            else {
                throw new Error(`No detection with class: ${name} found`);
            }
        });
    }
    /**
     * This function serves to extract a particular detection in the image
     * @param name the name of the detection to extract from the image, will only work if detection was returned with includeSegmentations=true
     * @returns Image of the extracted detection with transparent background as base64 encoded string
     */
    extractDetection(name) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.updateImage();
            const mask = yield this.getDetectionMask(name);
            if (mask) {
                return yield (0, helpers_1.extract)(this.image, mask);
            }
            else {
                throw new Error(`No detection with class: ${name} found`);
            }
        });
    }
    /**
     * This function returns the dominant color of a particular detection
     * @param detection - the name of the detection to be isolated
     * or a base64 encoded string of the mask already extracted by extractDetection
     * @returns number array where [r, g, b] represents the color
     */
    getDetectionColor(detection) {
        return __awaiter(this, void 0, void 0, function* () {
            let extractedMask;
            if (detection.startsWith('data')) {
                extractedMask = detection;
            }
            else {
                extractedMask = yield this.extractDetection(detection);
            }
            return yield (0, colorthief_1.getColor)(extractedMask);
        });
    }
    /**
     * Check if a certain detection was returned for this image
     * @param name name of the detection to find
     * @returns true if detection was found and false otherwise
     */
    checkDetection(name) {
        return this.detections.findIndex((d) => d.class === name) !== -1;
    }
    /**
     *Check if an array of detections were returned for this image
     * @param names array of names of detections to find
     * @returns true if all detections are found, false otherwise
     */
    checkDetections(names) {
        for (let i = 0; i < names.length; i++) {
            const n = names[i];
            if (this.detections.findIndex((d) => d.class === n) === -1) {
                return false;
            }
        }
        return true;
    }
    /**
     * Internal function for decoding detection segmentation into base64 string
     * @param name the name of the detection to find
     * @returns the found detection as base64 string or an empty string
     */
    getDetectionMask(name) {
        return __awaiter(this, void 0, void 0, function* () {
            let foundDetection = this.detections.find((d) => d.class === name);
            if (foundDetection && foundDetection.segmentation) {
                const { width, height } = yield (0, helpers_1.getImageSize)(this.image);
                return yield (0, helpers_1.makeMaskStringFromDetection)(foundDetection, width, height);
            }
            return '';
        });
    }
    /**
     * Internal function to change image from url to a base64 encoded string
     * for use in subsequent function calls
     */
    updateImage() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.image.startsWith('data')) {
                const img = yield (0, node_fetch_1.default)(this.image);
                const buffer = yield img.buffer();
                this.image = `data:${img.headers.get('content-type')};base64,${buffer.toString('base64')}`;
            }
        });
    }
}
exports.ClassifyResult = ClassifyResult;
//# sourceMappingURL=results.js.map