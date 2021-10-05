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
export declare const rleFromString: (s: string) => number[];
/**
 * Encode sequence of bits to encoded array
 * @example
 * [0,0,255,255,255,0,255] -> [2,3,1,1]
 * @returns {Array} Returns rle encoded array
 */
export declare const encode: (imageArray: Uint8ClampedArray) => number[];
/**
 * Opposite function to encode.
 * @example
 * [0,6,1] -> [255,255,255,255,255,255,0]
 * @returns {Array} Returns sequence of bits
 */
export declare const decode: (message: number[]) => Uint8ClampedArray;
/**
 * Creates imageData from array of bits.
 * @example
 * ([0, 0, 0, 0], 2, 2) -> ImageData
 * @returns {Array} Returns sequence of bits
 */
export declare const toMaskImageData: (data: Uint8ClampedArray, w: number, h: number) => ImageData;
