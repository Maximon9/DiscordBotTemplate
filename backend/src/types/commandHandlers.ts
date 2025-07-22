import type {
    ChatInputCommandInteraction,
    Colors,
    MessageComponentInteraction,
    ModalSubmitInteraction,
    User,
} from "discord.js";
import type { AdvancedArray } from "../utils/advancedArrays.js";
import type { Command } from "../utils/command.js";
import type { CustomID } from "../utils/ids.js";
import type { AdvancedMessage } from "./messageHandler.js";

export type PollCategory =
    | "send"
    | "remove"
    | "clear"
    | "view"
    | "edit"
    | "end_poll";
export type ViewGuildCategory = "channel" | "authorizers" | "blacklist";
export type ViewGroup =
    | "global_settings"
    | "server_settings"
    | "authorizers"
    | undefined;
export type ViewCategorys = "b_i" | "m_s" | "s_s" | "d_d";
export type UserGuildsCategory = "globally" | "in_server";
export type ViewOpt = "view_full" | "view_unfull";
export type BlacklistCategoryOpt = "A" | "ℛ";
export type AuthCategoryOpt = "C" | "R" | "ℛ";
export type InteractiveInteraction =
    | MessageComponentInteraction
    | ChatInputCommandInteraction
    | ModalSubmitInteraction;
export type HelpTitles =
    | "🐞Debug Commands"
    | "✅General Commands"
    | "Help Menu";
export type HelpHandlerValues = {
    categoryOffset: number;
    commandOffset: number;
    viewOption: ViewOpt;
};
export type TextinHandlerValues = {
    categoryOffset: number;
    commandOffset: number;
    viewOption: ViewOpt;
};

export type AlreadyInit = { customId: CustomID; state: string };

export type PollOptions = {
    name?: string;
    color?: keyof typeof Colors;
    question?: string;
    yes_Emoji?: string;
    no_Emoji?: string;
    resetVotes?: true;
};

export type UserShowOptions = {
    user: User;
    showBirthday?: boolean | "Default";
    showYear?: boolean | "Default";
    showTime_zone?: boolean | "Default";
    guildId?: string;
};
export type ShowVarNames = Exclude<
    Exclude<keyof UserShowOptions, "user">,
    "guildId"
>;

export type UserMentionOptions = {
    user: User;
    mentionBirthday?: boolean | "Default";
    mentionYear?: boolean | "Default";
    mentionTime_zone?: boolean | "Default";
    guildId?: string;
};
export type MentionsVarNames = Exclude<
    Exclude<keyof UserMentionOptions, "user">,
    "guildId"
>;

export type UserOptions = {
    user: User;
    day?: number | "Empty";
    month?: number | "Empty";
    time_zone?: string | "Empty";
    year?: number | "Empty";
};
export type BirthInfoVarNames = Exclude<keyof UserOptions, "user">;
