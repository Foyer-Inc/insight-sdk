import { Insight } from "..";
import fs from 'fs'
import { sanitizeBase64 } from "../lib/utils/helpers";
function main() {
    const sdk = new Insight(
        {
            authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IDU0ODQsICJyZWFsbSI6ICJjb25zdW1lciIsICJpYXQiOjE2MDkyNzk5NTF9.lhUh6jZPRCT6wsPMUsuknWu7gLqMUl61AmZsJAg3TBs'
        }
    );

    const image = fs.readFileSync("/Users/abramvillegas/Desktop/assets/kitchen.jpeg", { encoding: 'base64' })
    const file = `data:image/png;base64,${image}`;
    const url = 'https://reviewed-com-res.cloudinary.com/image/fetch/s--lTXgNCr0--/b_white,c_fill,cs_srgb,f_auto,fl_progressive.strip_profile,g_xy_center,q_auto,w_972,x_1925,y_1624/https://reviewed-production.s3.amazonaws.com/1458766753000/whirlpool-stainless-steel-kitchen-appliance-trends-hero.jpg'

    sdk.classify(url, { includeSegmentations: true })
        .then(async (r) => {
            console.log('going to extract refrigerator')
            const extracted = await r.extractDetection("refrigerator")
            console.log('going to get color of extracted refrigerator')
            const color = await r.getDetectionColor(extracted);
            console.log('going to extract and get color of refrigerator')
            const fridgeColor = await r.getDetectionColor('refrigerator')
            console.log('colors')
            console.log(color, fridgeColor)
            const blurred = await r.blurDetection('refrigerator')
            const blurredBuffer = Buffer.from(sanitizeBase64(blurred), 'base64')
            const extractedBuffer = Buffer.from(sanitizeBase64(extracted), 'base64')
            fs.writeFileSync('blurred.png', blurredBuffer);
            fs.writeFileSync('extracted.png', extractedBuffer)

        })
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
main()
