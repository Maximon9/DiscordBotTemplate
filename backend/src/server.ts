//#region Main

import fs from "fs";
import express from "express";
import cors from "cors";
import crypto from "crypto";
import { log } from "console";
import { LOCK_FILE, redeployProject } from "./deploy";
import RunDiscordBot from "./client";

const app = express();
const PORT = process.env.PORT || 3000;
const GITHUB_WEBHOOK_SECRET = process.env.GITHUB_WEBHOOK_SECRET || "no secret";

// Middleware to capture raw body for signature verification
app.use(
    express.json({
        verify: (req, _res, buf) => {
            (req as any).rawBody = buf;
        },
    })
);

app.use(cors());

// --- GitHub Webhook signature verification ---
function verifySignature(req: express.Request): boolean {
    const signature = req.headers["x-hub-signature-256"] as string | undefined;
    if (!signature) return false;

    const hmac = crypto.createHmac("sha256", GITHUB_WEBHOOK_SECRET);
    const digest = "sha256=" + hmac.update((req as any).rawBody).digest("hex");

    try {
        return (
            signature.length === digest.length &&
            crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest))
        );
    } catch {
        return false;
    }
}

// --- Webhook endpoint ---
app.post("/webhook", async (req, res) => {
    res.status(200).send("Webhook received, processing...");
    if (!verifySignature(req)) {
        console.warn("❌ Invalid GitHub webhook signature");
        return res.status(401).send("Unauthorized");
    }
    redeployProject();
});

app.listen(PORT, () => {
    if (fs.existsSync(LOCK_FILE)) {
        console.log("\r\nProject Deployed");
        fs.unlinkSync(LOCK_FILE);
    }
    log(`\r\n🚀 Backend running on http://localhost:${PORT}`);
    RunDiscordBot();
});

//#endregion
