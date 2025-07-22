import type {
    BitFieldResolvable,
    MessageFlags,
    MessageFlagsString,
} from "discord.js";

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

export default Flags;
