import { Client, GatewayIntentBits } from "discord.js";
import keys from "../keys/index.js";
import events from "../events/index.js";
import { registerEvents } from "../utils/event.js";
export default async function RunDiscordBot() {
    const client = new Client({
        intents: [
            GatewayIntentBits.GuildModeration,
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMembers,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.GuildMessageReactions,
            GatewayIntentBits.MessageContent,
        ],
    });

    registerEvents(client, events);

    client.login(keys.clientToken).catch((err) => {
        console.error("[Login Error]", err);
        process.exit(1);
    });
}
