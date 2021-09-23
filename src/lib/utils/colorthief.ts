const quantize = require('quantize')
import { getImageData } from './helpers'
/*
 * Color Thief v2.3.2
 * by Lokesh Dhakar - http://www.lokeshdhakar.com
 *
 * Thanks
 * ------
 * Nick Rabinowitz - For creating quantize.js.
 * John Schulz - For clean up and optimization. @JFSIII
 * Nathan Spady - For adding drag and drop support to the demo page.
 *
 * License
 * -------
 * Copyright Lokesh Dhakar
 * Released under the MIT license
 * https://raw.githubusercontent.com/lokesh/color-thief/master/LICENSE
 *
 * @license
 */

type ColorThiefOptions = {
    quality: number;
    count: number;
}

type ColorMap = {
    palette: () => number[][]
}
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
export async function getColor(image: string, quality: number = 10): Promise<number[]> {
    const palette = await getPalette(image, { quality, count: 5 });
    const dominantColor = palette[0];
    return dominantColor;
};


/**
 * getPalette(sourceImage[, options])
 *
 * Use the median cut algorithm provided by quantize.js to cluster similar colors.
 *
 * @param options is an optional argument contaning count and quality
 * - count determines the size of the palette; the number of colors returned. If not set, it
 * defaults to 10.
 * - quality. It needs to be an integer. 1 is the highest quality settings.
 * 10 is the default. There is a trade-off between quality and speed. The bigger the number, the
 * faster the palette generation but the greater the likelihood that colors will be missed.
 */

async function getPalette(image: string, options: ColorThiefOptions = { quality: 10, count: 5 }): Promise<number[][]> {
    options = validateOptions(options);

    const imageData = await getImageData(image)

    const pixelArray = createPixelArray(imageData, options.quality);

    // Send array to quantize function which clusters values
    // using median cut algorithm
    const cmap = quantize(pixelArray, options.count) as ColorMap;
    const palette = cmap ? cmap.palette() : [[]];

    return palette;
};

function createPixelArray(imgData: ImageData, quality: number): number[][] {
    const { data, width, height } = imgData
    const pixelCount = width * height
    const pixelArray = [];

    for (let i = 0, offset, r, g, b, a; i < pixelCount; i = i + quality) {
        offset = i * 4;
        r = data[offset + 0];
        g = data[offset + 1];
        b = data[offset + 2];
        a = data[offset + 3];

        // If pixel is mostly opaque and not white
        if (typeof a === 'undefined' || a >= 125) {
            if (!(r > 250 && g > 250 && b > 250)) {
                pixelArray.push([r, g, b]);
            }
        }
    }
    return pixelArray;
}

function validateOptions(options: ColorThiefOptions) {
    let { count, quality } = options;

    if (typeof count === 'undefined' || !Number.isInteger(count)) {
        count = 10;
    } else if (count === 1) {
        throw new Error('count should be between 2 and 20. To get one color, call getColor() instead of getPalette()');
    } else {
        count = Math.max(count, 2);
        count = Math.min(count, 20);
    }

    if (typeof quality === 'undefined' || !Number.isInteger(quality) || quality < 1) {
        quality = 10;
    }

    return {
        count,
        quality
    }
}
