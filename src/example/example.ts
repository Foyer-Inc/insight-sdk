import { Insight } from "..";
import fs from 'fs'
function main() {
    const sdk = new Insight()

    function classifyImage() {
        const image = fs.readFileSync("assets/kitchen.jpeg", { encoding: 'base64' })
        const file = `data:image/jpeg;base64,${image}`;
        sdk.classify(file, { includeSegmentations: true })
            .then((r) => {
                console.log('includeSegmentations = true')
                console.log(r.detections)
            })
            .catch(console.error);
        sdk.classify(file, { includeTagpoints: true })
            .then((r) => {
                console.log('includeTagpoints = false')
                console.log(r.detections)
            })
            .catch(console.error);
        sdk.classify(file, { detectionsRequested: ['cabinet', 'tray'] })
            .then((r) => {
                console.log('detectionsRequested = [cabinet, tray]')
                console.log(JSON.stringify(r.detections))
            })
            .catch(console.error);
    }

    sdk.login('demo@foyerapp.io', 'warme594')
        .then(classifyImage)
        .catch((error: Error) => console.error(error.message))
}
main()
