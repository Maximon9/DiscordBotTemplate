import { getEnvVar } from "../utils/env.js";

//#region Main
export const Keys = {
    clientToken: getEnvVar("ClIENT_TOKEN", "No Token"),
    testGuild: getEnvVar("TEST_GUILD", "No Guild"),
    isScript: getEnvVar("IS_SCRIPT", "false") === "true",
    node_ENV: getEnvVar("NODE_ENV", "production") as
        | "production"
        | "development",
    mongoUrl: getEnvVar("MONGO_URL", "No database url"),
    serverPort: Number(getEnvVar("PORT", "3000")),
} as const;

export default Keys;
//#endregion

/* import { Keys } from "../types/index.js";\

const keys: Keys = {
    clientToken: process.env.CLIENT_TOKEN ?? "nul",
    testGuild: process.env.TEST_GUILD ?? "nul",
    isScript: Boolean(process.env.IS_SCRIPT).valueOf() ?? false,
    node_ENV: process.env.NODE_ENV ?? "nul",
};

if (Object.values(keys).includes("nil"))
    throw new Error("Not all ENV variables are defined!");

export default keys; */
