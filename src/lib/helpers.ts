import { Response } from 'node-fetch';
import sharp from 'sharp';

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
    let b64Str: string = file;
    if (file.startsWith('data')) {
        b64Str = file.split(',')[1]
    }
    const resizedBuffer = await sharp(Buffer.from(b64Str, 'base64')).resize(width ?? 1024, height ?? 1024).toBuffer()
    return `data:image/png;base64,${resizedBuffer.toString('base64')}`;
}
