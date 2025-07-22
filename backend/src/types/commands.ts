//#region Main
import type {
    AutocompleteFocusedOption,
    AutocompleteInteraction,
    Awaitable,
    CacheType,
    ChatInputCommandInteraction,
    Client,
    SlashCommandBuilder,
    SlashCommandSubcommandsOnlyBuilder,
    SlashCommandOptionsOnlyBuilder,
} from "discord.js";
import type {Command} from "../utils/command.js";

type loggerFunction = (...args: unknown[]) => void;

export interface CommandProps {
    interaction: ChatInputCommandInteraction;
    client: Client;
    log: loggerFunction;
}

export type CommandExec = (props: CommandProps) => Awaitable<unknown>;
export type AutoCompleteFunc<choices extends string | number = string> = (
    interaction: AutocompleteInteraction<CacheType>,
    choices: choices[],
    focusedOption: AutocompleteFocusedOption
) => Promise<void>;
export type CommandMeta =
    | SlashCommandBuilder
    | SlashCommandSubcommandsOnlyBuilder
    | SlashCommandOptionsOnlyBuilder
    | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;

export interface CommandCategoryExtra {
    description?: string;
    emoji?: string;
}

export interface CommandCategory<
    Name extends string,
    CommandName extends string = string,
    choices extends string | number = string
> extends CommandCategoryExtra {
    name: Name;
    commands: Command<CommandName, choices>[];
}
//#endregion Main
