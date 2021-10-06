import { Response } from 'node-fetch';
import jimp from 'jimp';
import { toMaskImageData, decode, rleFromString } from './rle';
import { ClassifyPayload, Detection } from '../types';

const { Canvas, loadImage } = require('skia-canvas');
const DEFAULT_HEIGHT = 512
const DEFAULT_WIDTH = 512
const isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';
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
 * This function is used to resize the input image
 * @param file - base64 encoded image, with or without file type
 * @param width - desired width of output image, defaults to 512
 * @param height - desired height of output image, defaults to 512
 * @returns resized image base64 encoded
 */
export async function resizeImage(file: string, width?: number, height?: number): Promise<string> {
    let jimpImage = await jimp.read(Buffer.from(sanitizeBase64(file), 'base64'))
    return jimpImage.resize(width ?? DEFAULT_WIDTH, height ?? DEFAULT_HEIGHT).getBase64Async(jimp.MIME_PNG);
}

/**
 * This function is used to find the width and height of an image
 * @param file base64 encoded image, with or without file type
 * @returns {width, height} height and width of input image
 */
export async function getImageSize(file: string): Promise<{ width: number, height: number }> {
    let jimpImage = await jimp.read(Buffer.from(sanitizeBase64(file), 'base64'))
    return { width: jimpImage.bitmap.width, height: jimpImage.bitmap.height }
}

/**
 * Some functions, ex: Buffer.from, only work without the data prefix
 * @param file base64 encoded image
 * @returns this is used to return the image without the data prefix
 */
export function sanitizeBase64(file: string) {
    if (file.startsWith('data')) {
        return file.split(',')[1]
    }

    return file
}

/**
 * This function uses information about the images parameter to determine which payload property to set
 * @param images images to classify as base64 string, array of base64 strings, a url, or an array of urls
 * @param payload the payload used as the body of a classify request, will have one and only one of file, files, url or urls property when returned
 * @returns
 */
export async function addImagesToPayload(images: string | string[], payload: ClassifyPayload): Promise<ClassifyPayload> {
    if (Array.isArray(images)) {
        if (images[0].startsWith('data')) {
            payload.files = await Promise.all(
                images.map(async (f: string) => await resizeImage(f))
            );
        } else {
            payload.urls = images;
        }

    } else {
        if (images.startsWith('data')) {
            payload.file = await resizeImage(images)
        } else {
            payload.url = images
        }
    }

    return payload;
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
 * Transforms an ImageData instance to a base64 encoded string
 * @param imageData ImageData represetation of bitmap used on canvas
 * @returns bsae64 string with mime type
 */
function imageDataToBase64(imageData: ImageData): string {
    //use canvas to create base64 respresentation of image mask
    const { width, height } = imageData;
    const canvas = resolveCanvas(width, height)
    let ctx = canvas.getContext("2d");
    ctx.putImageData(imageData, 0, 0);

    return canvas.toDataURL()
}

/**
 * Transform a base64 encoded string into an ImageData instance
 * @param originalImage the image as a base64 encoded string
 * @param blur should the image be blurred before drawing
 * @returns return image as ImageData
 */
export async function getImageData(originalImage: string, blur: boolean = false): Promise<ImageData> {
    let image: any;
    if (isBrowser) {
        //The next few lines detail the process needed to create an imagebitmap, used for drawing on canvas
        const clampedArray = Uint8ClampedArray.from(Buffer.from(sanitizeBase64(originalImage), 'base64'));
        const blob = new Blob([clampedArray])
        image = await createImageBitmap(blob)
    } else {
        image = await loadImage(originalImage);
    }

    const { width, height } = image;
    const canvas = resolveCanvas(width, height);
    let ctx = canvas.getContext("2d");

    if (blur) {
        ctx.filter = 'blur(10px)';
    }

    ctx.drawImage(image, 0, 0)
    return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

/**
 * This function returns the image with a detection blurred
 * @param originalImage the original image as a base64 encoded string
 * @param mask the mask as a base64 encoded string with mime type
 * @returns The original image with the requested detection blurred as base64 string
 */
export async function blur(originalImage: string, mask: string): Promise<string> {
    //get the components from the original image as ImageData
    const { data, width, height } = await getImageData(originalImage);

    const maskArray = (await getImageData(mask)).data;
    const blurredArray = (await getImageData(originalImage, true)).data;

    const canvas = resolveCanvas(width, height)
    const ctx = canvas.getContext("2d");
    const imageData = ctx.createImageData(
        width,
        height
    )

    for (let i = 0; i < imageData.data.length; i++) {
        imageData.data[i] = (maskArray[i] != 0) ? blurredArray[i] : data[i]
    }
    return imageDataToBase64(imageData)
}

/**
 * This functions returns an image of an isolated detection
 * @param originalImage the original image as a base64 encoded string
 * @param mask the mask as a base64 encoded string with mime type
 * @returns Image of the extracted detection with transparent background as base64 encoded string
 */
export async function extract(originalImage: string, mask: string): Promise<string> {
    //get the components from the original image as ImageData
    const { data, width, height } = await getImageData(originalImage);
    const maskArray = (await getImageData(mask)).data;

    const canvas = resolveCanvas(width, height)
    const ctx = canvas.getContext("2d");
    const imageData = ctx.createImageData(
        width,
        height
    )

    for (let i = 0; i < imageData.data.length; i++) {
        imageData.data[i] = (maskArray[i] != 0) ? data[i] : maskArray[i]
    }

    return imageDataToBase64(imageData);
}

/**
 * Returns an appropriate canvas for the environment
 * @param width width of canvas to create
 * @param height height of canvas to create
 * @returns a canvas for drawing images
 */
function resolveCanvas(width: number, height: number): any {
    let canvas: any;
    if (isBrowser) {
        canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
    } else {
        canvas = new Canvas(width, height)
        canvas.async = false
    }

    return canvas;
}
