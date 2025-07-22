//#region Main

/* import { Event, EventExec, EventKeys } from "../types/index.js"
import { ChannelType, Client, DMChannel, TextChannel } from "discord.js"

export function event<T extends EventKeys>(id: T, exec: EventExec<T>): Event<T> {
    return {
        id,
        exec
    };
};

export function registerEvents(client: Client, events: Event<any>[]): void {
    for (const event of events)
        client.on(event.id, async (...args) => {
            const props = {
                client,
                log: (...args: unknown[]) =>
                    console.log(`[${event.id}]`, ...args)
            };

            try {
                await event.exec(props, ...args)
            } catch (error) {
                props.log("uncaught Error", error)
            }
        });
};

export function deleteMessage(client: Client, type: ChannelType, channelId: string, messageId: string) {
    client.channels.fetch(channelId).then((channel) => {
        if (channel) {
            if (type == ChannelType.DM) {
                const newChannel = channel as DMChannel;
                newChannel.messages.fetch(messageId).then(msg => msg.delete())
            }
            else if (type == ChannelType.GuildText) {
                const newChannel = channel as TextChannel;
                newChannel.messages.fetch(messageId).then(msg => msg.delete())
            }
        }
    })
} */

import type { Client } from "discord.js";
import type { EventCallback, EventKeys, Event } from "../types/events.js";
// Export events enum through here to reduce the amount of imports.
export { Events } from "discord.js";

/// Creates an event struct.
export function event<T extends EventKeys>(
    key: T,
    callback: EventCallback<T>
): Event<T> {
    return { key, callback };
}

/// Registers events to the client.
export function registerEvents(client: Client, events: Event[]): void {
    for (const { key, callback } of events) {
        client.on(key, (...args) => {
            // Create a new log method for this event.
            const log = console.log.bind(console, `[Event: ${key}]`);

            // Try to catch ucaught errors.
            try {
                // Call the callback.
                callback({ client, log }, ...args);
            } catch (err) {
                // Log the error.
                log("[Uncaught Error]", err);
            }
        });
    }
}

//#endregion
