import { Insight } from "..";
import fs from 'fs'
function main() {
    const sdk = new Insight()

    function classifyImage() {
        const image = fs.readFileSync("assets/kitchen.jpeg", { encoding: 'base64' })
        const file = `data:image/jpeg;base64,${image}`;
        sdk.classify(file, { includeSegmentations: true })
            .then(async (r) => {
                r.howdy()
                await r.extractDetection("cabinet")
                fs.writeFileSync("assets/response.json", JSON.stringify(r))
            })
            .catch(console.error);
    }

    sdk.login('demo@foyerapp.io', 'warme594')
        .then(classifyImage)
        .catch((error: Error) => console.error(error.message))
}
main()
