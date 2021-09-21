import { Insight } from "..";
import fs from 'fs'
function main() {
    const sdk = new Insight(
        {
            authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IDU0ODQsICJyZWFsbSI6ICJjb25zdW1lciIsICJpYXQiOjE2MDkyNzk5NTF9.lhUh6jZPRCT6wsPMUsuknWu7gLqMUl61AmZsJAg3TBs'
        }
    );
    classifyImage()

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
                console.log('includeTagpoints = true')
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
}
main()
