// note: you could also pass in one or all of the HTML files
// but if you do that the HTML file might be over written
// to fix that, set an output directory in the options

import html from 'bun-plugin-html';
import { Glob } from "bun";

// read in all the typescript files in the /public directory
// (or the directory where your typescript files are located)
// and compile them into builded javascript files in the same directory
// using the same name as the typescript file but with a code extension
// your HTML pages should reference the javascript file
// unless you are compiling the HTML files

const sourceDirectory = "./src/";
const glob = new Glob('*.ts');
let entrypoints = [...glob.scanSync(sourceDirectory)];
entrypoints = entrypoints.map((x) => sourceDirectory + x);
console.log("Compiling " + entrypoints.length + " typescript files...");

const results = await Bun.build({
    entrypoints: entrypoints,
    publicPath: "",
    sourcemap: "linked",
    outdir: './dist',
    plugins: [
        html()
    ],
});

if (results.success === false) {
    console.error("Build failed");
    for (const message of results.logs) {
        console.error(message);
    }
} else {
    console.log("Compiled " + results.outputs.length + " javascript files...");
}