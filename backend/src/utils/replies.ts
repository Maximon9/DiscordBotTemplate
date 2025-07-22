//#region Main

import type { BitFieldResolvable, MessageFlagsString } from "discord.js";
import {
    MessageFlags,
    APIEmbed,
    ActionRowBuilder,
    InteractionReplyOptions,
    MessageCreateOptions,
    WebhookMessageEditOptions,
} from "discord.js";
import { Colors } from "discord.js";

type Flags = BitFieldResolvable<
    Extract<
        MessageFlagsString,
        | "Ephemeral"
        | "SuppressEmbeds"
        | "SuppressNotifications"
        | "IsComponentsV2"
    >,
    | MessageFlags.Ephemeral
    | MessageFlags.SuppressEmbeds
    | MessageFlags.SuppressNotifications
    | MessageFlags.IsComponentsV2
>;

export const Reply = {
    interactionError(
        ...args:
            | [
                  ...msgs: string[],
                  components: ActionRowBuilder<any>[],
                  msgFlags: MessageFlags
              ]
            | [...msgs: string[], msgFlags: MessageFlags]
            | [...msgs: string[], components: ActionRowBuilder<any>[]]
            | [...msgs: string[]]
    ): InteractionReplyOptions {
        let lastArg = args[args.length - 1];
        const flags: Flags =
            lastArg instanceof ActionRowBuilder
                ? MessageFlags.Ephemeral
                : (lastArg as Flags);
        if (typeof lastArg === "boolean") {
            args.splice(args.length - 1, 1);
            lastArg = args[args.length - 1];
        }
        let components = Array.isArray(lastArg) ? lastArg : [];
        if (Array.isArray(lastArg)) args.splice(args.length - 1, 1);
        const embeds = (args as string[]).map((msg): APIEmbed => {
            return {
                description: msg,
                color: Colors.Red,
            };
        });
        return {
            flags,
            embeds,
            components,
        };
    },
    interaction(
        ...args:
            | [
                  ...embeds: APIEmbed[],
                  components: ActionRowBuilder<any>[],
                  msgFlags: MessageFlags
              ]
            | [...embeds: APIEmbed[], msgFlags: MessageFlags]
            | [...embeds: APIEmbed[], components: ActionRowBuilder<any>[]]
            | [...embeds: APIEmbed[]]
    ): InteractionReplyOptions {
        let lastArg = args[args.length - 1];
        const flags: Flags =
            lastArg instanceof ActionRowBuilder
                ? MessageFlags.Ephemeral
                : (lastArg as Flags);
        if (typeof lastArg === "boolean") {
            args.splice(args.length - 1, 1);
            lastArg = args[args.length - 1];
        }
        let components = Array.isArray(lastArg) ? lastArg : [];
        if (Array.isArray(lastArg)) args.splice(args.length - 1, 1);
        return {
            flags,
            embeds: args as APIEmbed[],
            components,
        };
    },
    messageError(
        ...args:
            | [...msgs: string[], components: ActionRowBuilder<any>[]]
            | [...msgs: string[]]
    ): MessageCreateOptions {
        let lastArg = args[args.length - 1];
        if (typeof lastArg === "boolean") {
            args.splice(args.length - 1, 1);
            lastArg = args[args.length - 1];
        }
        let components = Array.isArray(lastArg) ? lastArg : [];
        if (Array.isArray(lastArg)) args.splice(args.length - 1, 1);
        const embeds = (args as string[]).map((msg): APIEmbed => {
            return {
                description: msg,
                color: Colors.Red,
            };
        });
        return {
            embeds,
            components,
        };
    },
    message(
        ...args:
            | [...embeds: APIEmbed[], components: ActionRowBuilder<any>[]]
            | [...embeds: APIEmbed[]]
    ): MessageCreateOptions {
        let lastArg = args[args.length - 1];
        if (typeof lastArg === "boolean") {
            args.splice(args.length - 1, 1);
            lastArg = args[args.length - 1];
        }
        let components = Array.isArray(lastArg) ? lastArg : [];
        if (Array.isArray(lastArg)) args.splice(args.length - 1, 1);
        return {
            embeds: args as APIEmbed[],
            components,
        };
    },
};
export const EditReply = {
    error(
        ...args:
            | [...msgs: string[], components: ActionRowBuilder<any>[]]
            | [...msgs: string[]]
    ): WebhookMessageEditOptions {
        let lastArg = args[args.length - 1];
        if (typeof lastArg === "boolean") {
            args.splice(args.length - 1, 1);
            lastArg = args[args.length - 1];
        }
        let components = Array.isArray(lastArg) ? lastArg : [];
        if (Array.isArray(lastArg)) args.splice(args.length - 1, 1);
        const embeds = (args as string[]).map((msg): APIEmbed => {
            return {
                description: msg,
                color: Colors.Red,
            };
        });
        return {
            embeds,
            components,
        };
    },
    new(
        ...args:
            | [...embeds: APIEmbed[], components: ActionRowBuilder<any>[]]
            | [...embeds: APIEmbed[]]
    ): WebhookMessageEditOptions {
        let lastArg = args[args.length - 1];
        if (typeof lastArg === "boolean") {
            args.splice(args.length - 1, 1);
            lastArg = args[args.length - 1];
        }
        let components = Array.isArray(lastArg) ? lastArg : [];
        if (Array.isArray(lastArg)) args.splice(args.length - 1, 1);
        return {
            embeds: args as APIEmbed[],
            components,
        };
    },
};

//#endregion
