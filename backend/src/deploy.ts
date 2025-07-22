import { log } from "console";
import fs from "fs";
import { exec, execSync } from "child_process";
import { dirname, join } from "path";

const BACKEND_PATH = dirname(__dirname);
const CWD = dirname(BACKEND_PATH);
export const LOCK_FILE = join(BACKEND_PATH, "deploying.lock");

function deployLog(msg: any) {
    log(`\r\n[deploy] ${msg}`);
}

export async function redeployProject(): Promise<void> {
    let count = 1;
    if (fs.existsSync(LOCK_FILE)) {
        count = Number(
            fs.readFileSync(LOCK_FILE, { encoding: "utf-8" }).trim()
        );
        count++;

        if (count > 2) {
            count = 2;
        }

        fs.writeFileSync(LOCK_FILE, String(count));

        log("Another deployment is already running.");
        return;
    } else {
        fs.writeFileSync(LOCK_FILE, String(count));
    }

    while (count > 0) {
        deployLog("Redeploying Project...");
        try {
            deployLog("Pulling latest code...");
            execSync("git pull", {
                cwd: CWD,
                stdio: "ignore",
                windowsHide: true,
            });

            deployLog("Installing dependencies...");
            execSync("npm install", {
                cwd: CWD,
                stdio: "ignore",
                windowsHide: true,
            });

            deployLog("Building project...");
            execSync("npm run build", {
                cwd: CWD,
                stdio: "ignore",
                windowsHide: true,
            });
        } catch (error) {
            console.error(error);
        }
        count = Number(
            fs.readFileSync(LOCK_FILE, { encoding: "utf-8" }).trim()
        );
        count--;
        fs.writeFileSync(LOCK_FILE, String(count));
    }
    exec(
        "npm run restart",
        {
            cwd: CWD,
            windowsHide: true,
        },
        (err, _, stderr) => {
            if (err) {
                console.error("Deployment failed: " + stderr);
                return;
            }
        }
    );
}
