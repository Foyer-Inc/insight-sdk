import { Response } from 'node-fetch';
import { ClassifyPayload, Detection } from '../types';
export declare function checkStatus(response: Response): Response;
/**
 * This function is used to resize the input image
 * @param file - base64 encoded image, with or without file type
 * @param width - desired width of output image, defaults to 512
 * @param height - desired height of output image, defaults to 512
 * @returns resized image base64 encoded
 */
export declare function resizeImage(file: string, width?: number, height?: number): Promise<string>;
/**
 * This function is used to find the width and height of an image
 * @param file base64 encoded image, with or without file type
 * @returns {width, height} height and width of input image
 */
export declare function getImageSize(file: string): Promise<{
    width: number;
    height: number;
}>;
/**
 * Some functions, ex: Buffer.from, only work without the data prefix
 * @param file base64 encoded image
 * @returns this is used to return the image without the data prefix
 */
export declare function sanitizeBase64(file: string): string;
/**
 * This function uses information about the images parameter to determine which payload property to set
 * @param images images to classify as base64 string, array of base64 strings, a url, or an array of urls
 * @param payload the payload used as the body of a classify request, will have one and only one of file, files, url or urls property when returned
 * @returns
 */
export declare function addImagesToPayload(images: string | string[], payload: ClassifyPayload): Promise<ClassifyPayload>;
/**
 * Creates a base64 represenation of the detection segmentation of the same size as the original image
 * @param detection detection as returned from the model
 * @param width width of the original image
 * @param height height of the original image
 * @returns the detection mask as base64 encoded string
 */
export declare function makeMaskStringFromDetection(detection: Detection, width: number, height: number): Promise<string>;
/**
 * This only works when called in a browser context
 * @param originalImage the image as a base64 encoded string
 * @param blur should the image be blurred before drawing
 * @returns return image as ImageData
 */
export declare function getImageData(originalImage: string, blur?: boolean): Promise<ImageData>;
/**
 *
 * @param originalImage the original image as a base64 encoded string
 * @param mask the mask as a base64 encoded string with mime type
 * @returns The original image with the requested detection blurred as base64 string
 */
export declare function blur(originalImage: string, mask: string): Promise<string>;
/**
 *
 * @param originalImage the original image as a base64 encoded string
 * @param mask the mask as a base64 encoded string with mime type
 * @returns Image of the extracted detection with transparent background as base64 encoded string
 */
export declare function extract(originalImage: string, mask: string): Promise<string>;
