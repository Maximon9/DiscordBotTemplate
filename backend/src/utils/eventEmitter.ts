type listeners<T extends Array<any>> = (...args: T) => void;
export type Arglisteners<T extends Array<any>> = {listener: listeners<T>; args: T};

export class EventEmitter<EventMap extends Record<string, Array<any>>> {
    #eventListeners: {[K in keyof EventMap]?: Set<Arglisteners<EventMap[K]>>} = {};

    /**
     * This adds a listener to an event.
     * @param eventName Name of event.
     * @param listener A function that listens for an event.
     */
    addlistener<K extends keyof EventMap>(eventName: K, listener: listeners<EventMap[K]>, ...args: EventMap[K]) {
        const argListeners = this.#eventListeners[eventName] ?? new Set();
        argListeners.add({listener, args});
        this.#eventListeners[eventName] = argListeners;
    }
    /**
     * This removes a listener from an event.
     * @param eventName Name of event.
     * @param listener A function that listens for an event.
     */
    removeListener<K extends keyof EventMap>(eventName: K, listener: listeners<EventMap[K]>) {
        const argListeners = this.#eventListeners[eventName] ?? new Set();

        let argListener: Arglisteners<EventMap[K]> | undefined = undefined;
        for (const value of argListeners.values()) {
            if (value.listener === listener) {
                argListener = value;
                break;
            }
        }
        if (argListener === undefined) return;

        argListeners.delete(argListener);
        this.#eventListeners[eventName] = argListeners;
    }
    /**
     * This removes all listeners from an event.
     * @param eventName Name of event.
     */
    removeAllListeners<K extends keyof EventMap>(eventName: K) {
        const argListeners = this.#eventListeners[eventName] ?? new Set();
        argListeners.clear();
        this.#eventListeners[eventName] = argListeners;
    }
    /**
     * This returns the number of listeners inside an event.
     * @param eventName Name of event.
     * @returns number
     */
    listenerCount<K extends keyof EventMap>(eventName: K): number {
        const argListeners = this.#eventListeners[eventName] ?? new Set();
        return argListeners.size;
    }
    /**
     * This returns all the listeners inside an event.
     * @param eventName Name of event.
     * @returns Set<listeners>
     */
    getEventListeners<K extends keyof EventMap>(eventName: K): Set<listeners<EventMap[K]>> {
        const argListeners = this.#eventListeners[eventName] ?? new Set();
        return new Set([...argListeners].map((argListener) => argListener.listener));
    }
    /**
     * Private function that emits an event.
     * @param eventName Name of event.
     * @param eventData Event data that is passed to the listeners.
     */
    emit<K extends keyof EventMap>(eventName: K) {
        const argListeners = this.#eventListeners[eventName] ?? new Set();
        for (const argListener of argListeners) {
            try {
                argListener.listener(...argListener.args);
            } catch (error) {
                throw new Error(error as any);
            }
        }
    }
}
