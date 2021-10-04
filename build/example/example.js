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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
const fs_1 = __importDefault(require("fs"));
const helpers_1 = require("../lib/utils/helpers");
function main() {
    const sdk = new __1.Insight({
        authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IDU0ODQsICJyZWFsbSI6ICJjb25zdW1lciIsICJpYXQiOjE2MDkyNzk5NTF9.lhUh6jZPRCT6wsPMUsuknWu7gLqMUl61AmZsJAg3TBs'
    });
    const image = fs_1.default.readFileSync("/Users/abramvillegas/Desktop/assets/kitchen.jpeg", { encoding: 'base64' });
    const file = `data:image/png;base64,${image}`;
    const url = 'https://reviewed-com-res.cloudinary.com/image/fetch/s--lTXgNCr0--/b_white,c_fill,cs_srgb,f_auto,fl_progressive.strip_profile,g_xy_center,q_auto,w_972,x_1925,y_1624/https://reviewed-production.s3.amazonaws.com/1458766753000/whirlpool-stainless-steel-kitchen-appliance-trends-hero.jpg';
    sdk.classify(url, { includeSegmentations: true })
        .then((r) => __awaiter(this, void 0, void 0, function* () {
        console.log('going to extract refrigerator');
        const extracted = yield r.extractDetection("refrigerator");
        console.log('going to get color of extracted refrigerator');
        const color = yield r.getDetectionColor(extracted);
        console.log('going to extract and get color of refrigerator');
        const fridgeColor = yield r.getDetectionColor('refrigerator');
        console.log('colors');
        console.log(color, fridgeColor);
        const blurred = yield r.blurDetection('refrigerator');
        const blurredBuffer = Buffer.from((0, helpers_1.sanitizeBase64)(blurred), 'base64');
        const extractedBuffer = Buffer.from((0, helpers_1.sanitizeBase64)(extracted), 'base64');
        fs_1.default.writeFileSync('blurred.png', blurredBuffer);
        fs_1.default.writeFileSync('extracted.png', extractedBuffer);
    }))
        .catch(console.error);
    // sdk.classify(file, { includeTagpoints: true })
    //     .then((r) => {
    //         console.log('includeTagpoints = true')
    //         console.log(r.detections)
    //     })
    //     .catch(console.error);
    // sdk.classify(file, { detectionsRequested: ['cabinet', 'tray'] })
    //     .then((r) => {
    //         console.log('detectionsRequested = [cabinet, tray]')
    //         console.log(JSON.stringify(r.detections))
    //     })
    //     .catch(console.error);
    // sdk.classify(url)
    //     .then((r) => {
    //         console.log(r.checkDetection('cabinet'))
    //         console.log(r.checkDetections(['person', 'phone']))
    //         console.log(r.checkDetections(['wall', 'floor', 'ceiling']))
    //     })
    //     .catch(console.error);
}
main();
//# sourceMappingURL=example.js.map