/**
 * getColor(sourceImage[, quality])
 * Use the median cut algorithm provided by quantize.js to cluster similar
 * colors and return the base color from the largest cluster.
 *
 * @param image image as base64 string
 * @param quality Quality is an optional argument. It needs to be an integer. 1 is the highest quality settings.
 * 10 is the default. There is a trade-off between quality and speed. The bigger the number, the
 * faster a color will be returned but the greater the likelihood that it will not be the visually
 * most dominant color.
 * @returns rgb [r, g, b]
 */
export declare function getColor(image: string, quality?: number): Promise<number[]>;
