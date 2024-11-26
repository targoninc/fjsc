import * as fs from "node:fs";
import { execSync } from "node:child_process";
import * as path from "node:path"; // Ensure @types/node is added to dependencies

interface ProjectArgs {
    folder: string;
    projectName?: string;
}

const args: ProjectArgs = {
    folder: process.argv[2] || ".",
    projectName: process.argv[3] || "my-project",
};

// Logging function
const log = (message: string) => {
    console.log(`[LOG] ${message}`);
};

log(`Project folder: ${args.folder}`);
log(`Project name: ${args.projectName}`);

// If the folder does not exist, create it
if (!fs.existsSync(args.folder)) {
    log(`Creating folder: ${args.folder}`);
    fs.mkdirSync(args.folder, { recursive: true });
}

// Change the working directory to the project folder
process.chdir(args.folder);
log(`Changed working directory to ${process.cwd()}`);

// Set the project name (if provided)
fs.writeFileSync(
    "package.json",
    JSON.stringify({
        name: args.projectName,
    }, null, 2)
);
log(`Created package.json with project name: ${args.projectName}`);

// Initialize bun in the project folder
log("Initializing bun...");
execSync("bun init", { stdio: "inherit" });
log("Bun initialized successfully");

// Initialize a new git repository
log("Initializing a new git repository...");
execSync("git init", { stdio: "inherit" });
log("Git repository initialized successfully");

// Add the git submodule
const submoduleUrl = "https://github.com/targoninc/fjsc.git";
log(`Adding git submodule: ${submoduleUrl}`);
execSync(`git submodule add ${submoduleUrl}`, { stdio: "inherit" });
log("Git submodule added successfully");

// Create index.ts file
const indexPath = path.join(args.folder, "index.ts");
log(`Creating index.ts file at ${indexPath}`);
fs.writeFileSync(indexPath, `console.log('Hello, world!');`);
log("Created index.ts file");

// Install @types packages
log("Installing @types/node...");
execSync("bun add @types/node", { stdio: "inherit" });
log("@types/node installed successfully");
