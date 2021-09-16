import { Response } from 'node-fetch';
import jimp from 'jimp';
import { toMaskImageData, decode, rleFromString } from './rle';
import { Detection } from './types';

const DEFAULT_HEIGHT = 512
const DEFAULT_WIDTH = 512
class HTTPResponseError extends Error {
    constructor(response: Response) {
        super(`HTTP Error Response: ${response.status} ${response.statusText}`);
    }
}

export function checkStatus(response: Response) {
    if (response.ok) {
        // response.status >= 200 && response.status < 300
        return response;
    } else {
        throw new HTTPResponseError(response);
    }
}
/**
 *
 * @param file - base64 encoded image, with or without file type
 * @param width -
 * @param height
 * @returns resized image base64 encoded
 */
export async function resizeImage(file: string, width?: number, height?: number): Promise<string> {
    let jimpImage = await jimp.read(Buffer.from(sanitizeBase64(file), 'base64'))
    return jimpImage.resize(width ?? DEFAULT_WIDTH, height ?? DEFAULT_HEIGHT).getBase64Async(jimp.MIME_JPEG);
}

export function sanitizeBase64(file: string) {
    if (file.startsWith('data')) {
        return file.split(',')[1]
    }

    return file
}

/**
 *
 * @param detection detection as returned from the model
 * @returns the detection mask as base64 encoded string
 */
export async function makeMaskStringFromDetection(detection: Detection): Promise<string> {
    //create ImageData from segmentation to identify location of detection
    const { size, counts } = detection.segmentation;
    const mask = toMaskImageData(decode(rleFromString(counts)), size[0], size[1]);

    const b64 = imageDataToBase64(mask);

    //for some reason the mask appears to be returned as a mirror of the original image
    const buf = Buffer.from(b64, 'base64')
    const jimpMask = await jimp.read(buf)
    jimpMask.rotate(-90)
    jimpMask.flip(true, false)

    return await jimpMask.getBase64Async(jimp.MIME_PNG)

}

/**
 *
 * @param imageData ImageData represetation of bitmap used on canvas
 * @returns bsae64 string without mime type
 */
function imageDataToBase64(imageData: ImageData): string {
    //use canvas to create base64 respresentation of image mask
    var canvas = document.createElement("canvas");
    canvas.width = imageData.width;
    canvas.height = imageData.height;
    var ctx = canvas.getContext("2d");
    ctx.putImageData(imageData, 0, 0);

    return sanitizeBase64(canvas.toDataURL())
}

/**
 *
 * @param originalImage the image as a base64 encoded string
 * @param blur should the image be blurred before drawing
 * @returns return imagebitmap as Uint8ClampedArray
 */
function getImageArray(originalImage: string, blur: boolean): Uint8ClampedArray {
    console.log(originalImage, blur)
    const clampedArray = new Uint8ClampedArray(Buffer.from(sanitizeBase64(originalImage), 'base64'))

    if (blur) {
        const canvas = document.createElement("canvas")
        canvas.width = DEFAULT_WIDTH
        canvas.height = DEFAULT_WIDTH
        var ctx = canvas.getContext("2d");
        ctx.filter = 'blur(5px)';
        const imageData = new ImageData(clampedArray, canvas.width, canvas.height)
        ctx.putImageData(imageData, 0, 0);

        return ctx.getImageData(0, 0, canvas.width, canvas.height).data
    }

    return clampedArray;
}

/**
 *
 * @param originalImage the original image as a base64 encoded string
 * @param mask the mask as a base64 encoded string
 */
export function applyBlur(originalImage: string, mask: string): string {
    const maskArray = getImageArray(mask, false);
    console.log(maskArray)
    const imageArray = getImageArray(originalImage, false);
    console.log(imageArray)
    const blurredArray = getImageArray(originalImage, true);
    console.log(blurredArray)
    const length = imageArray.length
    const destinationArray: Uint8ClampedArray = new Uint8ClampedArray(length)

    for (let i = 0; i < length; i++) {
        destinationArray[i] = (maskArray[i] != 0) ? blurredArray[i] : imageArray[i]
    }
    console.log(destinationArray)
    return imageDataToBase64(new ImageData(
        destinationArray,
        DEFAULT_WIDTH,
        DEFAULT_WIDTH
    ))
}
