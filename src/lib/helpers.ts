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
    return jimpImage.resize(width ?? DEFAULT_WIDTH, height ?? DEFAULT_HEIGHT).getBase64Async(jimp.MIME_PNG);
}

export async function getImageSize(file: string): Promise<{ width: number, height: number }> {
    let jimpImage = await jimp.read(Buffer.from(sanitizeBase64(file), 'base64'))
    return { width: jimpImage.bitmap.width, height: jimpImage.bitmap.height }
}
/**
 *
 * @param file base64 encoded image
 * @returns this is used to return the image without the data prefix, ex. needed when using Buffer.from
 */
export function sanitizeBase64(file: string) {
    if (file.startsWith('data')) {
        return file.split(',')[1]
    }

    return file
}

/**
 * Creates a base64 represenation of the detection segmentation of the same size as the original image
 * @param detection detection as returned from the model
 * @param width width of the original image
 * @param height height of the original image
 * @returns the detection mask as base64 encoded string
 */
export async function makeMaskStringFromDetection(detection: Detection, width: number, height: number): Promise<string> {
    //create ImageData from segmentation to identify location of detection
    const { size, counts } = detection.segmentation;
    const mask = toMaskImageData(decode(rleFromString(counts)), size[0], size[1]);
    const b64 = imageDataToBase64(mask);
    const buf = Buffer.from(sanitizeBase64(b64), 'base64')
    const jimpMask = await jimp.read(buf)
    //for some reason the mask appears to be returned as a mirror of the original image
    jimpMask.rotate(-90)
    jimpMask.flip(true, false)
    return jimpMask.resize(width, height).getBase64Async(jimp.MIME_PNG)
}

/**
 * This only works when called in a browser context
 * @param imageData ImageData represetation of bitmap used on canvas
 * @returns bsae64 string with mime type
 */
function imageDataToBase64(imageData: ImageData): string {
    //use canvas to create base64 respresentation of image mask
    var canvas = document.createElement("canvas");
    canvas.width = imageData.width;
    canvas.height = imageData.height;
    var ctx = canvas.getContext("2d");
    ctx.putImageData(imageData, 0, 0);

    return canvas.toDataURL()
}

/**
 * This only works when called in a browser context
 * @param originalImage the image as a base64 encoded string
 * @param blur should the image be blurred before drawing
 * @returns return image as Uint8ClampedArray
 */
async function getImageArray(originalImage: string, blur: boolean) {
    //The next few lines detail the process needed to create an imagebitmap, used for drawing on canvas
    const clampedArray = Uint8ClampedArray.from(Buffer.from(sanitizeBase64(originalImage), 'base64'));
    const blob = new Blob([clampedArray])
    const bitmap = await createImageBitmap(blob)

    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    var ctx = canvas.getContext("2d");

    if (blur) {
        ctx.filter = 'blur(10px)';
    }

    ctx.drawImage(bitmap, 0, 0)
    return ctx.getImageData(0, 0, canvas.width, canvas.height).data;
}

/**
 *
 * @param originalImage the original image as a base64 encoded string
 * @param mask the mask as a base64 encoded string with mime type
 */
export async function applyBlur(originalImage: string, mask: string): Promise<string> {
    const maskArray = await getImageArray(mask, false);
    const imageArray = await getImageArray(originalImage, false);
    const blurredArray = await getImageArray(originalImage, true);
    const length = imageArray.length
    const destinationArray: Uint8ClampedArray = new Uint8ClampedArray(length)

    for (let i = 0; i < length; i++) {
        destinationArray[i] = (maskArray[i] != 0) ? blurredArray[i] : imageArray[i]
    }

    const { width, height } = await getImageSize(originalImage);

    return imageDataToBase64(new ImageData(
        destinationArray,
        width,
        height
    ))
}
