import { Response } from 'node-fetch';
import jimp from 'jimp';
import { toMaskImageData, decode, rleFromString } from './rle';
import { Detection } from './types';

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
    let b64Str = sanitizeBase64(file)
    let jimpImage = await jimp.read(Buffer.from(b64Str, 'base64'))
    return jimpImage.resize(width ?? 512, height ?? 512).getBase64Async(jimp.MIME_JPEG);
}

export function sanitizeBase64(file: string) {
    if (file.startsWith('data')) {
        return file.split(',')[1]
    }

    return file
}

export function makeDataURLFromDetection(image: string, detection: Detection) {
    const { boundingBox } = detection;
    const coords = boundingBox.map((v: number) => v * 512)
    //const mask = toMaskImageData(decode(rleFromString(counts)), size[0], size[1]);
    const img = new Image();
    img.src = image;
    const canvas = document.createElement("canvas")
    canvas.width = img.width
    canvas.height = img.height
    const ctx = canvas.getContext("2d");
    ctx.filter = 'blur(5px)';
    ctx.drawImage(img, 0, 0);
    var imgData = ctx.getImageData(coords[0], coords[1], coords[2] - coords[0], coords[3] - coords[1]);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.filter = 'none';
    ctx.drawImage(img, 0, 0);

    ctx.putImageData(imgData, coords[0], coords[0]);

    const b64 = canvas.toDataURL()

    return sanitizeBase64(b64)
}
