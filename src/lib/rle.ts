/**
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * This software consists of voluntary contributions made by many individuals
 * and is licensed under the MIT license. For more information, see
 * <http://www.doctrine-project.org>.
 */

/**
 * RLE (Run-length Encoding) - encode/decode binary
 * image mask on JavaScript in the same way as in the
 * popular [COCO tools](https://pypi.org/project/pycocotools/) library
 *
 * @license http://www.opensource.org/licenses/mit-license.html  MIT License
 * @author Salavat Dinmukhametov <s.dinmukhametov@eora.ru>
 * @author Vlad Vinogradov <vladvin@eora.ru>
*/


/**
 * Translate similar to LEB128 but using 6 bits/char and ascii chars 48-111-like string to RLE encoded array.
 * @param {String} Output of encode COCO tools algorithm
 * @returns {Array} Returns rle encoded array
 */

export const rleFromString = (s: string): number[] => {
    let cnts = [];
    let m = 0;
    let p = 0;
    let k;
    let x;
    let more;
    while (s[p]) {
        x = 0;
        k = 0;
        more = 1;
        while (more) {
            let c = s.charCodeAt(p) - 48;
            x = x | ((c & 0x1f) << (5 * k));
            more = c & 0x20;
            p += 1;
            k += 1;
            if (!more && c & 0x10) {
                x = x | (-1 << (5 * k));
            }
        }
        if (m > 2) {
            x += cnts[m - 2];
        }
        cnts[m++] = x;
    }

    // return cnts.map((it) => Math.abs(it));
    return cnts;
};

/**
 * Encode sequence of bits to encoded array
 * @example
 * [0,0,255,255,255,0,255] -> [2,3,1,1]
 * @returns {Array} Returns rle encoded array
 */
export const encode = (imageArray: Uint8ClampedArray): number[] => {
    let lastElement = imageArray[0];
    let lastSequenceSize = 1;
    let message = [];
    if (imageArray[0] === 255) {
        message.push(0);
    }
    for (let i = 1; i < imageArray.length; i++) {
        if (lastElement !== imageArray[i]) {
            message.push(lastSequenceSize);
            lastElement = imageArray[i];
            lastSequenceSize = 1;
        } else {
            lastSequenceSize += 1;
        }
    }
    message.push(lastSequenceSize);
    return message;
};

/**
 * Opposite function to encode.
 * @example
 * [0,6,1] -> [255,255,255,255,255,255,0]
 * @returns {Array} Returns sequence of bits
 */
export const decode = (message: number[]): Uint8ClampedArray => {
    let imageArray = [];
    let isZero = true;
    for (let i = 0; i < message.length; i++) {
        for (let j = 0; j < message[i]; j++) {
            imageArray.push(isZero ? 0 : 255);
        }
        // imageArray.push(...Array(message[i]).fill(isZero ? 0 : 255));
        isZero = !isZero;
    }
    return new Uint8ClampedArray(imageArray);
};

/**
 * Creates imageData from array of bits.
 * @example
 * ([0, 0, 0, 0], 2, 2) -> ImageData
 * @returns {Array} Returns sequence of bits
 */
export const toMaskImageData = (data: Uint8ClampedArray, w: number, h: number): ImageData => {
    let dataWithAdditionalLayers = [];
    for (let i = 0; i < data.length; i++) {
        dataWithAdditionalLayers.push(...[data[i], data[i], data[i], data[i]])
    }

    let image = new ImageData(
        new Uint8ClampedArray(dataWithAdditionalLayers),
        w,
        h
    );
    return image;
};
