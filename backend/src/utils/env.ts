// import { config } from "dotenv";
// import { resolve } from "path";

// const envFile =
//     process.env.NODE_ENV === "development" ? "./envs/.dev.env" : "./envs/.env";

// const envFilePath = resolve(process.cwd(), envFile);

// config({ path: envFilePath });

export function getEnvVar(name: string, fallback?: string): string {
    const value = process.env[name] ?? fallback;
    if (value === undefined)
        throw new Error(`Environment variable ${name} is not set.`);
    return value;
}
