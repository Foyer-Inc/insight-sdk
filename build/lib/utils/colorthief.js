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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getColor = void 0;
const quantize = require('quantize');
const helpers_1 = require("./helpers");
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
function getColor(image, quality = 10) {
    return __awaiter(this, void 0, void 0, function* () {
        const palette = yield getPalette(image, { quality, count: 5 });
        const dominantColor = palette[0];
        return dominantColor;
    });
}
exports.getColor = getColor;
;
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
function getPalette(image, options = { quality: 10, count: 5 }) {
    return __awaiter(this, void 0, void 0, function* () {
        options = validateOptions(options);
        const imageData = yield (0, helpers_1.getImageData)(image);
        const pixelArray = createPixelArray(imageData, options.quality);
        // Send array to quantize function which clusters values
        // using median cut algorithm
        const cmap = quantize(pixelArray, options.count);
        const palette = cmap ? cmap.palette() : [[]];
        return palette;
    });
}
;
function createPixelArray(imgData, quality) {
    const { data, width, height } = imgData;
    const pixelCount = width * height;
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
function validateOptions(options) {
    let { count, quality } = options;
    if (typeof count === 'undefined' || !Number.isInteger(count)) {
        count = 10;
    }
    else if (count === 1) {
        throw new Error('count should be between 2 and 20. To get one color, call getColor() instead of getPalette()');
    }
    else {
        count = Math.max(count, 2);
        count = Math.min(count, 20);
    }
    if (typeof quality === 'undefined' || !Number.isInteger(quality) || quality < 1) {
        quality = 10;
    }
    return {
        count,
        quality
    };
}
//# sourceMappingURL=colorthief.js.map