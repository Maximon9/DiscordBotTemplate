import type {Awaitable, Client, ClientEvents} from "discord.js";

export type LogMethod = (...args: unknown[]) => void;
export type EventKeys = keyof ClientEvents;

/// Props that will be passed through the event callback.
export interface EventProps {
    client: Client;
    log: LogMethod;
}

export type EventCallbackArgs<T extends EventKeys> = [props: EventProps, ...args: ClientEvents[T]];

export type EventCallback<T extends EventKeys> = (...args: EventCallbackArgs<T>) => Awaitable<unknown>;

/// Internal struct that represents an event.
export interface Event<T extends EventKeys = EventKeys> {
    key: T;
    callback: EventCallback<T>;
}
