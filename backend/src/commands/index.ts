import Debug from "./debug/index.js";
import { chunk } from "../utils/index.js";
import type { Command } from "../utils/command.js";
import type { APIEmbedField } from "discord.js";

//#region Main
const categories = [Debug];
export const commands = categories.map(({ commands }) => commands).flat(),
    commandsMap = new Map<CommandNames, Command<CommandNames, any>>(
        commands.map((c) => [c.name, c])
    );

const categoryNames = categories[0].name;
export type CategoryNames = typeof categoryNames;

const commandNames = commands[0].name;
export type CommandNames = typeof commandNames;

export const categoryChunks = categories.map((c) => {
    // Pre-map all commands as embed fields
    const commands: APIEmbedField[] = c.commands.map((c) => ({
        name: `/${c.meta.name}`,
        value: c.meta.description,
    }));

    return {
        ...c,
        commands: chunk(commands, 10),
    };
});

export default categories;
//#endregion Main
