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
exports.extract = exports.blur = exports.getImageData = exports.makeMaskStringFromDetection = exports.addImagesToPayload = exports.sanitizeBase64 = exports.getImageSize = exports.resizeImage = exports.checkStatus = void 0;
const jimp_1 = __importDefault(require("jimp"));
const rle_1 = require("./rle");
const { Canvas, loadImage } = require('skia-canvas');
const DEFAULT_HEIGHT = 512;
const DEFAULT_WIDTH = 512;
const isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';
class HTTPResponseError extends Error {
    constructor(response) {
        super(`HTTP Error Response: ${response.status} ${response.statusText}`);
    }
}
function checkStatus(response) {
    if (response.ok) {
        // response.status >= 200 && response.status < 300
        return response;
    }
    else {
        throw new HTTPResponseError(response);
    }
}
exports.checkStatus = checkStatus;
/**
 * This function is used to resize the input image
 * @param file - base64 encoded image, with or without file type
 * @param width - desired width of output image, defaults to 512
 * @param height - desired height of output image, defaults to 512
 * @returns resized image base64 encoded
 */
function resizeImage(file, width, height) {
    return __awaiter(this, void 0, void 0, function* () {
        let jimpImage = yield jimp_1.default.read(Buffer.from(sanitizeBase64(file), 'base64'));
        return jimpImage.resize(width !== null && width !== void 0 ? width : DEFAULT_WIDTH, height !== null && height !== void 0 ? height : DEFAULT_HEIGHT).getBase64Async(jimp_1.default.MIME_PNG);
    });
}
exports.resizeImage = resizeImage;
/**
 * This function is used to find the width and height of an image
 * @param file base64 encoded image, with or without file type
 * @returns {width, height} height and width of input image
 */
function getImageSize(file) {
    return __awaiter(this, void 0, void 0, function* () {
        let jimpImage = yield jimp_1.default.read(Buffer.from(sanitizeBase64(file), 'base64'));
        return { width: jimpImage.bitmap.width, height: jimpImage.bitmap.height };
    });
}
exports.getImageSize = getImageSize;
/**
 * Some functions, ex: Buffer.from, only work without the data prefix
 * @param file base64 encoded image
 * @returns this is used to return the image without the data prefix
 */
function sanitizeBase64(file) {
    if (file.startsWith('data')) {
        return file.split(',')[1];
    }
    return file;
}
exports.sanitizeBase64 = sanitizeBase64;
/**
 * This function uses information about the images parameter to determine which payload property to set
 * @param images images to classify as base64 string, array of base64 strings, a url, or an array of urls
 * @param payload the payload used as the body of a classify request, will have one and only one of file, files, url or urls property when returned
 * @returns
 */
function addImagesToPayload(images, payload) {
    return __awaiter(this, void 0, void 0, function* () {
        if (Array.isArray(images)) {
            if (images[0].startsWith('data')) {
                payload.files = yield Promise.all(images.map((f) => __awaiter(this, void 0, void 0, function* () { return yield resizeImage(f); })));
            }
            else {
                payload.urls = images;
            }
        }
        else {
            if (images.startsWith('data')) {
                payload.file = yield resizeImage(images);
            }
            else {
                payload.url = images;
            }
        }
        return payload;
    });
}
exports.addImagesToPayload = addImagesToPayload;
/**
 * Creates a base64 represenation of the detection segmentation of the same size as the original image
 * @param detection detection as returned from the model
 * @param width width of the original image
 * @param height height of the original image
 * @returns the detection mask as base64 encoded string
 */
function makeMaskStringFromDetection(detection, width, height) {
    return __awaiter(this, void 0, void 0, function* () {
        //create ImageData from segmentation to identify location of detection
        const { size, counts } = detection.segmentation;
        const mask = (0, rle_1.toMaskImageData)((0, rle_1.decode)((0, rle_1.rleFromString)(counts)), size[0], size[1]);
        const b64 = imageDataToBase64(mask);
        const buf = Buffer.from(sanitizeBase64(b64), 'base64');
        const jimpMask = yield jimp_1.default.read(buf);
        //for some reason the mask appears to be returned as a mirror of the original image
        jimpMask.rotate(-90);
        jimpMask.flip(true, false);
        return jimpMask.resize(width, height).getBase64Async(jimp_1.default.MIME_PNG);
    });
}
exports.makeMaskStringFromDetection = makeMaskStringFromDetection;
/**
 * Transforms an ImageData instance to a base64 encoded string
 * @param imageData ImageData represetation of bitmap used on canvas
 * @returns bsae64 string with mime type
 */
function imageDataToBase64(imageData) {
    //use canvas to create base64 respresentation of image mask
    const { width, height } = imageData;
    const canvas = resolveCanvas(width, height);
    let ctx = canvas.getContext("2d");
    ctx.putImageData(imageData, 0, 0);
    return canvas.toDataURL();
}
/**
 * Transform a base64 encoded string into an ImageData instance
 * @param originalImage the image as a base64 encoded string
 * @param blur should the image be blurred before drawing
 * @returns return image as ImageData
 */
function getImageData(originalImage, blur = false) {
    return __awaiter(this, void 0, void 0, function* () {
        let image;
        if (isBrowser) {
            //The next few lines detail the process needed to create an imagebitmap, used for drawing on canvas
            const clampedArray = Uint8ClampedArray.from(Buffer.from(sanitizeBase64(originalImage), 'base64'));
            const blob = new Blob([clampedArray]);
            image = yield createImageBitmap(blob);
        }
        else {
            image = yield loadImage(originalImage);
        }
        const { width, height } = image;
        const canvas = resolveCanvas(width, height);
        let ctx = canvas.getContext("2d");
        if (blur) {
            ctx.filter = 'blur(10px)';
        }
        ctx.drawImage(image, 0, 0);
        return ctx.getImageData(0, 0, canvas.width, canvas.height);
    });
}
exports.getImageData = getImageData;
/**
 * This function returns the image with a detection blurred
 * @param originalImage the original image as a base64 encoded string
 * @param mask the mask as a base64 encoded string with mime type
 * @returns The original image with the requested detection blurred as base64 string
 */
function blur(originalImage, mask) {
    return __awaiter(this, void 0, void 0, function* () {
        //get the components from the original image as ImageData
        const { data, width, height } = yield getImageData(originalImage);
        const maskArray = (yield getImageData(mask)).data;
        const blurredArray = (yield getImageData(originalImage, true)).data;
        const canvas = resolveCanvas(width, height);
        const ctx = canvas.getContext("2d");
        const imageData = ctx.createImageData(width, height);
        for (let i = 0; i < imageData.data.length; i++) {
            imageData.data[i] = (maskArray[i] != 0) ? blurredArray[i] : data[i];
        }
        return imageDataToBase64(imageData);
    });
}
exports.blur = blur;
/**
 * This functions returns an image of an isolated detection
 * @param originalImage the original image as a base64 encoded string
 * @param mask the mask as a base64 encoded string with mime type
 * @returns Image of the extracted detection with transparent background as base64 encoded string
 */
function extract(originalImage, mask) {
    return __awaiter(this, void 0, void 0, function* () {
        //get the components from the original image as ImageData
        const { data, width, height } = yield getImageData(originalImage);
        const maskArray = (yield getImageData(mask)).data;
        const canvas = resolveCanvas(width, height);
        const ctx = canvas.getContext("2d");
        const imageData = ctx.createImageData(width, height);
        for (let i = 0; i < imageData.data.length; i++) {
            imageData.data[i] = (maskArray[i] != 0) ? data[i] : maskArray[i];
        }
        return imageDataToBase64(imageData);
    });
}
exports.extract = extract;
/**
 * Returns an appropriate canvas for the environment
 * @param width width of canvas to create
 * @param height height of canvas to create
 * @returns a canvas for drawing images
 */
function resolveCanvas(width, height) {
    let canvas;
    if (isBrowser) {
        canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
    }
    else {
        canvas = new Canvas(width, height);
        canvas.async = false;
    }
    return canvas;
}
//# sourceMappingURL=helpers.js.map