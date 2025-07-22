import type {InteractionResponse, Message, MessageComponentInteraction} from "discord.js";
import type {AdvancedArray} from "../utils/advancedArrays.js";
import type {InteractiveInteraction} from "./commandHandlers.js";

export type IDTimeout = {
    id: string;
    timeout: NodeJS.Timeout | null;
};

export interface AdvancedMessage<
    I extends InteractiveInteraction = InteractiveInteraction,
    InGuild extends boolean = boolean
> extends Message<InGuild> {
    actualInteraction?: I;
}

export type MessageCache<I extends InteractiveInteraction = InteractiveInteraction> = AdvancedArray<AdvancedMessage<I>>;

export enum DMTEventType {
    clearId = 0,
    beforeDelete = 1,
    afterDelete = 2,
}
export type Listeners = (event: DMTEventData) => any;
export type DMTEventData = {type: "clearId" | "beforeDelete" | "afterDelete"};
export type DMTEventNames = keyof typeof DMTEventType | "all";

export type DetatchServerCache = {key: string; cache: MessageCache};

export type Response<I extends InteractiveInteraction = InteractiveInteraction> =
    | AdvancedMessage<I>
    | InteractionResponse;
