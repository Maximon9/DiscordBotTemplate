//#region Main

import {
    Collection,
    Message,
    type DMChannel,
    type InteractionReplyOptions,
    InteractionResponse,
    type MessageCreateOptions,
    type MessageEditOptions,
    type MessagePayload,
    type MessageReplyOptions,
    type TextChannel,
    BaseInteraction,
    InteractionWebhook,
} from "discord.js";
import {
    type Response,
    type MessageCache,
    type IDTimeout,
    type DetatchServerCache,
    type DMTEventData,
    type Listeners,
    type DMTEventNames,
    DMTEventType,
    InteractiveInteraction,
    AdvancedMessage,
} from "../types/index";
import { AdvancedArray, Stringf } from "./index";

export class MessageHandler extends AdvancedArray<DetatchServerCache> {
    static Messages: Collection<string, Response | Response[]> =
        new Collection();

    static IDTimeouts: AdvancedArray<IDTimeout> = new AdvancedArray();

    constructor(...items: DetatchServerCache[]) {
        super(...items);
    }

    static keyMod(key: string, current = false): string {
        let count = 0;
        MessageHandler.Messages.forEach((_, _key) => {
            if (_key.startsWith(key)) count++;
        });
        if (current && count > 0) count--;
        if (count === 0) return `${key}`;
        else return `${key}${count}`;
    }

    async clear() {
        if (this.length > 0) {
            for (let i = 0; i < this.length; i++) {
                const serverCache = this[i];
                for (let i = 0; i < serverCache.cache.length; i++) {
                    const message = serverCache.cache[i];
                    await MessageHandler.deleteMessageAsync(message);
                }
            }
        }
    }

    public fetchServerCache(key: string): MessageCache | null {
        const serverCache = this.find((serverCache) => serverCache.key === key);
        return serverCache ? serverCache.cache : null;
    }

    fetchNewest(): MessageCache {
        if (this.length > 0) return this[this.length - 1].cache;
        else return new AdvancedArray();
    }

    static deleteMessage<
        I extends InteractiveInteraction = InteractiveInteraction
    >(message: Response | string, interaction?: I | InteractionWebhook) {
        // console.log("ok");
        MessageHandler.#clearTimeoutOnId(
            typeof message === "string" ? message : message.id
        );
        this.#purgeMessage(message, interaction);
    }
    static async deleteMessageAsync<
        I extends InteractiveInteraction = InteractiveInteraction
    >(message: Response | string, interaction?: I | InteractionWebhook) {
        MessageHandler.#clearTimeoutOnId(
            typeof message === "string" ? message : message.id
        );
        await this.#purgeMessage(message, interaction);
    }
    static deleteMessageTimeoutIterable<
        I extends InteractiveInteraction = InteractiveInteraction
    >(
        message: Response | string,
        time: number,
        interaction?: I | InteractionWebhook
    ): AsyncIterable<DMTEventData> {
        return {
            [Symbol.asyncIterator]() {
                let state: number = 0,
                    idTimeout!: IDTimeout;
                return {
                    async next() {
                        switch (state) {
                            case 1:
                                return new Promise((resolve) => {
                                    MessageHandler.IDTimeouts.add(
                                        (idTimeout = {
                                            id:
                                                typeof message === "string"
                                                    ? message
                                                    : message.id,
                                            timeout: setTimeout(async () => {
                                                state = 2;
                                                return resolve({
                                                    value: {
                                                        type: "beforeDelete",
                                                    },
                                                    done: false,
                                                });
                                            }, time),
                                        })
                                    );
                                });
                            case 2:
                                await MessageHandler.#purgeMessage(
                                    message,
                                    interaction
                                );
                                state = 3;
                                MessageHandler.IDTimeouts.remove(idTimeout);
                                return Promise.resolve({
                                    value: { event: "afterDelete" },
                                    done: false,
                                });
                            case 3:
                                return Promise.resolve({
                                    value: { event: "afterDelete" },
                                    done: true,
                                });
                            default:
                                state = 1;
                                MessageHandler.#clearTimeoutOnId(
                                    typeof message === "string"
                                        ? message
                                        : message.id
                                );
                                return Promise.resolve({
                                    value: { event: "clearId" },
                                    done: false,
                                });
                        }
                    },
                };
            },
        } as AsyncIterable<DMTEventData>;
    }
    static deleteMessageTimeout<
        I extends InteractiveInteraction = InteractiveInteraction
    >(
        message: Response | string,
        time: number,
        interaction?: I | InteractionWebhook,
        listener?: Listeners
    ): MessageHandler {
        const messageDH = new MessageHandler();
        if (listener) messageDH.addlistener("all", listener);
        MessageHandler.#clearTimeoutOnId(
            typeof message === "string" ? message : message.id
        );
        messageDH.#emit("clearId", { type: "clearId" });
        messageDH.#emit("all", { type: "clearId" });
        let idTimeout: IDTimeout;
        MessageHandler.IDTimeouts.add(
            (idTimeout = {
                id: typeof message === "string" ? message : message.id,
                timeout: setTimeout(async () => {
                    messageDH.#emit("clearId", { type: "beforeDelete" });
                    messageDH.#emit("all", { type: "beforeDelete" });
                    await MessageHandler.#purgeMessage(message, interaction);
                    MessageHandler.IDTimeouts.remove(idTimeout);
                    messageDH.#emit("clearId", { type: "afterDelete" });
                    messageDH.#emit("all", { type: "afterDelete" });
                }, time),
            })
        );
        return messageDH;
    }
    static deleteMessageTimeoutAsync<
        I extends InteractiveInteraction = InteractiveInteraction
    >(
        message: Response | string,
        time: number,
        interaction?: I | InteractionWebhook
    ): Promise<void> {
        return new Promise((resolve) => {
            MessageHandler.#clearTimeoutOnId(
                typeof message === "string" ? message : message.id
            );
            let idTimeout: IDTimeout;
            MessageHandler.IDTimeouts.add(
                (idTimeout = {
                    id: typeof message === "string" ? message : message.id,
                    timeout: setTimeout(async () => {
                        await MessageHandler.#purgeMessage(
                            message,
                            interaction
                        );
                        MessageHandler.IDTimeouts.remove(idTimeout);
                        resolve();
                    }, time),
                })
            );
        });
    }
    static async deleteMessageWithIdTimeout<
        I extends InteractiveInteraction = InteractiveInteraction
    >(
        message: Response,
        id: string,
        time: number,
        interaction?: I | InteractionWebhook
    ) {
        const preMessage = MessageHandler.Messages.get(id);
        if (preMessage !== undefined) {
            if (Array.isArray(preMessage)) {
                for (let i = 0; i < preMessage.length; i++) {
                    const message = preMessage[i];
                    await MessageHandler.deleteMessageAsync(
                        message,
                        interaction
                    );
                }
            } else {
                await MessageHandler.deleteMessageAsync(
                    preMessage,
                    interaction
                );
            }
            MessageHandler.Messages.delete(id);
        }
        MessageHandler.Messages.set(id, message);
        MessageHandler.deleteMessageTimeout(message, time, interaction);
    }
    static #clearTimeoutOnId(id: string, ignore = true) {
        const idTimeout = MessageHandler.IDTimeouts.find(
            (idTimeout) => idTimeout.id === id
        );
        if (idTimeout) {
            MessageHandler.IDTimeouts.remove(idTimeout);
            if (idTimeout.timeout) clearTimeout(idTimeout.timeout);
        } else {
            if (!ignore)
                console.warn(
                    "idTimout does not exist, which could be an error"
                );
        }
    }

    static async fetchMessage(
        channel: TextChannel | DMChannel,
        id: string
    ): Promise<Message | undefined> {
        try {
            if (!Stringf.isNullOrEmpty(id))
                return await channel.messages.fetch(id);
        } catch (error) {
            console.error(error);
        }
    }

    static async reply<
        T extends Response | I,
        I extends InteractiveInteraction = InteractiveInteraction
    >(
        message: Response | I,
        options:
            | MessagePayload
            | string
            | (MessageReplyOptions & InteractionReplyOptions)
    ): Promise<T | undefined> {
        let reply: T | undefined = undefined;
        try {
            if (!(message instanceof BaseInteraction)) await message.fetch();
            try {
                switch (true) {
                    case message instanceof Message:
                        if (message.actualInteraction) {
                            if (
                                !message.actualInteraction.isButton() &&
                                !message.actualInteraction.isChatInputCommand() &&
                                !message.actualInteraction.isModalSubmit()
                            )
                                return reply;
                            reply = (await message.actualInteraction.reply(
                                options
                            )) as T;
                        } else reply = (await message.reply(options)) as T;
                        break;
                    case message instanceof BaseInteraction:
                        reply = (await message.reply(options)) as T;
                        break;
                    default:
                        console.error(
                            "[Error InteractionResponse]: This cannot be replied to"
                        );
                        break;
                }
            } catch (error) {
                console.error(
                    error,
                    message instanceof Message ? message.content : ""
                );
            }
        } catch (error) {
            console.error(
                error,
                message instanceof Message ? message.content : ""
            );
        }
        return reply;
    }

    static async pin(message: Message): Promise<Message | undefined> {
        try {
            return await message.pin();
        } catch (error) {
            console.error(error);
        }
    }

    static async send(
        channel: TextChannel | DMChannel,
        options: string | MessagePayload | MessageCreateOptions
    ): Promise<Message | undefined> {
        try {
            return await channel.send(options);
        } catch (error) {
            console.error(error);
        }
    }
    static async editMessage(
        message: Message,
        options: string | MessageEditOptions | MessagePayload
    ): Promise<Message | undefined> {
        try {
            return await message.edit(options);
        } catch (error) {
            console.error(error);
        }
    }

    static #removeFromMessages(id: string) {
        this.Messages.delete(
            this.Messages.findKey((message, key) => {
                let _id = "";
                if (
                    message instanceof Message ||
                    message instanceof InteractionResponse
                )
                    _id = message.id;
                else {
                    for (let i = 0; i < message.length; i++) {
                        const response = message[i];
                        if (response.id === id) return key;
                    }
                    return undefined;
                }
                if (_id === id) return key;
            }) ?? ""
        );
    }
    static async #purgeMessage<
        I extends InteractiveInteraction = InteractiveInteraction
    >(message: Response | string, interaction?: I | InteractionWebhook) {
        try {
            switch (true) {
                case message instanceof Message:
                    if (
                        interaction !== undefined &&
                        !(interaction instanceof InteractionWebhook)
                    )
                        message.actualInteraction = interaction;
                    if (message.deletable) {
                        if (message.actualInteraction !== undefined) {
                            await message.actualInteraction.deleteReply(
                                message.id
                            );
                            this.#removeFromMessages(message.id);
                        } else {
                            await message.delete();
                            this.#removeFromMessages(message.id);
                        }
                    }
                    break;
                case typeof message === "string":
                    if (interaction === undefined) break;
                    switch (true) {
                        case interaction instanceof InteractionWebhook:
                            await interaction.deleteMessage(message);
                            break;
                        default:
                            await interaction.deleteReply(message);
                            break;
                    }
                    this.#removeFromMessages(message);
                    break;
                default:
                    await message.delete();
                    this.#removeFromMessages(message.id);
                    break;
            }
        } catch (error) {
            if (message instanceof Message) {
                console.error(
                    `${message.id}: ${message.embeds[0].description}`
                );
                console.error(error);
            } else console.error(error);
        }
    }
    //#region Emitter Methods
    #eventListeners: { [K in DMTEventNames]?: Set<Listeners> } = {};
    /**
     * This adds a listener to an event.
     * @param eventName Name of event.
     * @param listener A function that listens for an event.
     */
    addlistener(eventName: DMTEventNames, listener: Listeners) {
        if (eventName === "all" || DMTEventType[eventName] !== undefined) {
            const listeners = this.#eventListeners[eventName] ?? new Set();
            listeners.add(listener);
            this.#eventListeners[eventName] = listeners;
        } else throw new Error(`Error: ${eventName} is not an existing event`);
    }
    /**
     * This removes a listener from an event.
     * @param eventName Name of event.
     * @param listener A function that listens for an event.
     */
    removeListener(eventName: DMTEventNames, listener: Listeners) {
        if (eventName === "all" || DMTEventType[eventName] !== undefined) {
            const listeners = this.#eventListeners[eventName] ?? new Set();
            listeners.delete(listener);
            this.#eventListeners[eventName] = listeners;
        } else throw new Error(`Error: ${eventName} is not an existing event`);
    }
    /**
     * This removes all listeners from an event.
     * @param eventName Name of event.
     */
    removeAllListeners(eventName: DMTEventNames) {
        if (eventName === "all" || DMTEventType[eventName] !== undefined) {
            const listeners = this.#eventListeners[eventName] ?? new Set();
            listeners.clear();
            this.#eventListeners[eventName] = listeners;
        } else throw new Error(`Error: ${eventName} is not an existing event`);
    }
    /**
     * This returns the number of listeners inside an event.
     * @param eventName Name of event.
     * @returns number
     */
    listenerCount(eventName: DMTEventNames): number {
        if (eventName === "all" || DMTEventType[eventName] !== undefined) {
            const listeners = this.#eventListeners[eventName] ?? new Set();
            return listeners.size;
        } else throw new Error(`Error: ${eventName} is not an existing event`);
    }
    /**
     * This returns all the listeners inside an event.
     * @param eventName Name of event.
     * @returns Set<listeners>
     */
    getEventListeners(eventName: DMTEventNames): Set<Listeners> {
        if (eventName === "all" || DMTEventType[eventName] !== undefined) {
            const listeners = this.#eventListeners[eventName] ?? new Set();
            return listeners;
        } else throw new Error(`Error: ${eventName} is not an existing event`);
    }
    /**
     * Private function that emits an event.
     * @param eventName Name of event.
     * @param eventData Event data that is passed to the listeners.
     */
    #emit(eventName: DMTEventNames, eventData: DMTEventData) {
        if (eventName === "all" || DMTEventType[eventName] !== undefined) {
            const listeners = this.#eventListeners[eventName] ?? new Set();
            for (const listener of listeners) {
                listener(eventData);
            }
        } else throw new Error(`Error: ${eventName} is not an existing event`);
    }
    //#endregion Emitter Methods
}
//#endregion
