import { Insight } from "..";
import fs from 'fs'
function main() {
    const sdk = new Insight(
        {
            authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IDU0ODQsICJyZWFsbSI6ICJjb25zdW1lciIsICJpYXQiOjE2MDkyNzk5NTF9.lhUh6jZPRCT6wsPMUsuknWu7gLqMUl61AmZsJAg3TBs'
        }
    );

    const image = fs.readFileSync("assets/kitchen.jpeg", { encoding: 'base64' })
    const file = `data:image/jpeg;base64,${image}`;
    const url = 'https://kitchendesignnetwork.com/wp-content/uploads/2016/01/plain-and-fancyfeature.jpg'

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

    sdk.classify(url)
        .then((r) => {
            console.log(r.checkDetection('cabinet'))
            console.log(r.checkDetections(['person', 'phone']))
            console.log(r.checkDetections(['wall', 'floor', 'ceiling']))
        })
        .catch(console.error);
}
main()
