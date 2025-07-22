import {
    ArrayEventTypes,
    type ArrayArgListener,
    type ArrayEventData,
    type ArrayEventNames,
    type ArrayListener,
} from "../types/advancedArrays";
import { Mathf } from "./math_util";
//#region Main
/**
 * A class that adds event emitters and more functionality to arrays.
 * @ref [Reference]()
 * @see {@link AdvancedArrayEmitter}
 */
export class AdvancedArrayEmitter<T> extends Array<T> {
    constructor(...items: T[]) {
        super(...items);
    }

    /**
     * This changes an item within the array to another item.
     * @param item Item to find and change.
     * @param to The replacement.
     */
    replace(item: T, to: T, emit = true) {
        if (this.length > 0) {
            const index = this.indexOf(item);
            this[index] = to;
            if (emit) {
                const eventData: ArrayEventData<T> = {
                    array: this,
                    eventType: "changed",
                    changeType: "replace",
                    from: item,
                    to,
                    index,
                };
                this.#emit("all", eventData);
                this.#emit("changed", eventData);
            }
            return index;
        } else return 0;
    }

    /**
     * This changes an item at a specific index to another item.
     * @param index Index of the item find and change.
     * @param to The replacement.
     */
    replaceAt(index: number, to: T, emit = true) {
        if (this.length > 0) {
            const clone: T | undefined = emit ? this[index] : undefined;
            this[index] = to;
            if (emit) {
                const eventData: ArrayEventData<T> = {
                    array: this,
                    eventType: "changed",
                    changeType: "replace",
                    from: clone,
                    to,
                    index,
                };
                this.#emit("all", eventData);
                this.#emit("changed", eventData);
            }
            return index;
        } else return 0;
    }

    /**
     * This adds an item to the array
     * @unrequired index
     * @param item The item to add to the array.
     * @param index Index to add item at.
     * @returns The item you added. Incase you need it.
     */
    add(item: T, index?: number, emit = true) {
        if (typeof index === "number") {
            this.splice(index, 0, item);
            if (emit) {
                const eventData: ArrayEventData<T> = {
                    array: this,
                    eventType: "added",
                    addType: "at",
                    item: item,
                    index,
                };
                this.#emit("all", eventData);
                this.#emit("added", eventData);
            }
        } else {
            if (emit) this.push(item);
            else {
                this.length++;
                this[this.length - 1] = item;
            }
        }
        return item;
    }

    /**
     * This adds an item to the array
     * @unrequired index
     * @param items The item to add to the array.
     * @param index Index to add item at.
     * @returns The item you added. Incase you need it.
     */
    addRange(items: T[], index?: number, emit = true) {
        if (typeof index === "number") {
            let tempIndex = index;
            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                this.splice(tempIndex, 0, item);
                tempIndex++;
            }
        } else {
            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                this.length++;
                this[this.length - 1] = item;
            }
        }
        if (items !== undefined && items.length > 0 && emit) {
            const eventData: ArrayEventData<T> = {
                array: this,
                eventType: "added",
                addType: "range",
                items: items,
            };
            if (typeof index === "number") eventData.index = index;
            else eventData.index = this.length - items.length;

            this.#emit("all", eventData);
            this.#emit("added", eventData);
        }
        return items;
    }

    /**
     * Removes item from array.
     * @param item Item to remove.
     */
    remove(item: T, emit = true) {
        const index = this.indexOf(item);
        if (this.length > 0 && emit) {
            const eventData: ArrayEventData<T> = {
                array: this,
                eventType: "removed",
                removeType: "item",
                item: this[index],
                index,
            };
            this.#emit("all", eventData);
            this.#emit("removed", eventData);
        }
        this.removeAt(index, false);
    }

    /**
     * Removes item at a specific index from array.
     * @param index Index to remove at.
     */
    removeAt(index: number, emit = true) {
        if (this.length > 0) {
            if (emit) {
                const eventData: ArrayEventData<T> = {
                    array: this,
                    eventType: "removed",
                    removeType: "at",
                    item: this[index],
                    index,
                };
                this.#emit("all", eventData);
                this.#emit("removed", eventData);
            }
            if (index > -1) this.splice(index, 1);
        }
    }

    /**
     * Removes a range of elements.
     * @param start the starting index.
     * @param amount amount to remove.
     */
    removeRange(start: number, amount: number, emit = true) {
        if (this.length > 0) {
            if (emit) {
                let indices: number[] = [];
                for (
                    let i = Mathf.Clamp(start, 0, this.length);
                    i < Mathf.Clamp(start + amount, 0, this.length);
                    i++
                )
                    indices.push(i);
                const eventData: ArrayEventData<T> = {
                    array: this,
                    eventType: "removed",
                    removeType: "range",
                    items: this.splice(start, amount),
                    indices,
                };
                this.#emit("all", eventData);
                this.#emit("removed", eventData);
            }
            this.splice(start, amount);
        }
    }

    /**
     * This moves an item in this array to another position in the array.
     * @param item Item to find and move.
     * @param to what index to move to.
     */
    move(item: T, to: number, emit = true) {
        const index = this.indexOf(item);
        return this.moveAt(index, to, emit);
    }
    /**
     * This moves an item in this array to another position in the array.
     * @param index Index of item to find and move.
     * @param to what index to move to.
     */
    moveAt(index: number, to: number, emit = true) {
        if (this.length > 0) {
            index = Mathf.Clamp(index, 0, this.length - 1);
            to = Mathf.Clamp(to, 0, this.length - 1);
            const item = this[index];
            this.splice(to, 0, this.splice(index, 1)[0]);
            if (emit) {
                const eventData: ArrayEventData<T> = {
                    array: this,
                    eventType: "moved",
                    moveType: "one",
                    item: item,
                    from: index,
                    to,
                };
                this.#emit("all", eventData);
                this.#emit("moved", eventData);
            }
        }
        return this;
    }

    /**
     * This swaps two items in this array.
     * @param item_1 First item to swap.
     * @param item_2 Second item to swap.
     */
    swap(item_1: T, item_2: T, emit = true) {
        const index_1 = this.indexOf(item_1),
            index_2 = this.indexOf(item_2);
        return this.swapAt(index_1, index_2, emit);
    }
    /**
     * This swaps two items in this array.
     * @param index_1 First index of an item to swap.
     * @param index_2 Second index of an item to swap.
     */
    swapAt(index_1: number, index_2: number, emit = true) {
        if (this.length > 0) {
            index_1 = Mathf.Clamp(index_1, 0, this.length - 1);
            index_1 = Mathf.Clamp(index_1, 0, this.length - 1);
            const item1 = this[index_1];
            const item2 = this[index_2];
            this[index_1] = this.splice(index_2, 1, this[index_1])[0];
            if (emit) {
                const eventData: ArrayEventData<T> = {
                    array: this,
                    eventType: "moved",
                    moveType: "swap",
                    item1,
                    item2,
                };
                this.#emit("all", eventData);
                this.#emit("moved", eventData);
            }
        }
        return this;
    }

    /**
     * This clears the array
     */
    clear(emit = true) {
        const clone = [...this];
        if (this.length > 0) this.splice(0, this.length);
        if (emit) {
            const eventData: ArrayEventData<T> = {
                array: this,
                eventType: "clear",
                items: clone,
            };
            this.#emit("all", eventData);
            this.#emit("clear", eventData);
        }
    }

    push(...items: T[]): number {
        const returnValue = super.push(...items);
        if (items !== undefined && items.length > 0) {
            const eventData: ArrayEventData<T> = {
                array: this,
                eventType: "added",
                addType: "push",
            };

            if (items.length > 1) eventData.items = items;
            else eventData.item = items[0];

            eventData.index = this.length - items.length;

            this.#emit("all", eventData);
            this.#emit("added", eventData);
        }
        return returnValue;
    }

    /**
     */
    pop(emit = true): T | undefined {
        const clone: T | undefined = emit ? this[this.length - 1] : undefined,
            returnValue = super.pop();
        if (this.length > 0 && emit) {
            const eventData: ArrayEventData<T> = {
                array: this,
                eventType: "removed",
                removeType: "pop",
                item: clone,
                index: this.length,
            };
            this.#emit("all", eventData);
            this.#emit("removed", eventData);
        }
        return returnValue;
    }

    /**
     */
    shift(emit = true): T | undefined {
        const clone: T | undefined = emit ? this[0] : undefined,
            returnValue = super.shift();
        if (this.length > 0 && emit) {
            const eventData: ArrayEventData<T> = {
                array: this,
                eventType: "removed",
                removeType: "shift",
                item: clone,
                index: 0,
            };
            this.#emit("all", eventData);
            this.#emit("removed", eventData);
        }
        return returnValue;
    }

    unshift(...items: T[]): number {
        const returnValue = super.unshift(...items);
        if (items !== undefined && items.length > 0) {
            const eventData: ArrayEventData<T> = {
                array: this,
                eventType: "added",
                addType: "unshift",
            };

            if (items.length > 1) eventData.items = items;
            else eventData.item = items[0];

            eventData.index = 0;

            this.#emit("all", eventData);
            this.#emit("added", eventData);
        }
        return returnValue;
    }

    /**
     */
    sort(compareFn?: ((a: T, b: T) => number) | undefined, emit = true): this {
        const clone: T[] | undefined = emit ? [...this] : undefined,
            returnValue = super.sort(compareFn);
        if (this.length > 0 && emit) {
            const eventData: ArrayEventData<T> = {
                array: this,
                eventType: "moved",
                moveType: "sorted",
                from: clone,
                to: [...this],
            };
            this.#emit("all", eventData);
            this.#emit("moved", eventData);
        }
        return returnValue;
    }

    /**
     */
    reverse(emit = true): T[] {
        const clone: T[] | undefined = emit ? [...this] : undefined,
            returnValue = super.reverse();
        if (this.length > 0 && emit) {
            const eventData: ArrayEventData<T> = {
                array: this,
                eventType: "moved",
                moveType: "reversed",
                from: clone,
                to: [...this],
            };
            this.#emit("all", eventData);
            this.#emit("moved", eventData);
        }
        return returnValue;
    }

    /**
     */
    copyWithin(
        target: number,
        start: number,
        end?: number | undefined,
        emit = true
    ): this {
        const clone: T[] | undefined = emit ? [...this] : undefined,
            returnValue = super.copyWithin(target, start, end);
        if (end !== undefined && end > start && emit) {
            const eventData: ArrayEventData<T> = {
                array: this,
                eventType: "changed",
                changeType: "copyWithIn",
            };
            if (end - start > 1) {
                eventData.from = clone![target];
                eventData.to = clone![start];
                eventData.index = target;
            } else {
                const indices: number[] = [],
                    realLength = target + end - start;
                eventData.from = clone!.slice(target, realLength);
                eventData.to = clone!.slice(start, end);

                for (
                    let i = Mathf.Clamp(target, 0, this.length);
                    i < Mathf.Clamp(realLength, 0, this.length);
                    i++
                )
                    indices.push(i);

                eventData.indices = indices;
            }
            this.#emit("all", eventData);
            this.#emit("changed", eventData);
        }
        return returnValue;
    }

    /**
     */
    fill(
        value: T,
        start?: number | undefined,
        end?: number | undefined,
        emit = true
    ): this {
        const clone: T[] | undefined = emit ? [...this] : undefined,
            returnValue = super.fill(value, start, end);
        start = start ?? 0;
        if (end !== undefined && end > start && emit) {
            const eventData: ArrayEventData<T> = {
                array: this,
                eventType: "changed",
                changeType: "fill",
            };
            if (end - start > 1) {
                eventData.from = clone![start];
                eventData.to = value;
                eventData.index = start;
            } else {
                const indices: number[] = [];
                eventData.from = clone!.slice(start, end);
                eventData.to = clone!.slice(start, end).fill(value);

                for (
                    let i = Mathf.Clamp(start, 0, this.length);
                    i < Mathf.Clamp(end, 0, this.length);
                    i++
                )
                    indices.push(i);

                eventData.indices = indices;
            }
            this.#emit("all", eventData);
            this.#emit("changed", eventData);
        }
        return returnValue;
    }

    //#region Emitter Methods
    #eventListeners: { [K in ArrayEventNames]?: Set<ArrayArgListener<T>> } = {};
    /**
     * This adds a listener to an event.
     * @param eventName Name of event.
     * @param listener A function that listens for an event.
     */
    addlistener(
        eventName: ArrayEventNames,
        listener: ArrayListener<T>,
        ...args: any[]
    ) {
        if (eventName === "all" || ArrayEventTypes[eventName] !== undefined) {
            const argListeners = this.#eventListeners[eventName] ?? new Set();
            argListeners.add({ listener, args });
            this.#eventListeners[eventName] = argListeners;
        } else throw new Error(`Error: ${eventName} is not an existing event`);
    }

    /**
     * This removes a listener from an event.
     * @param eventName Name of event.
     * @param listener A function that listens for an event.
     */
    removeListener(eventName: ArrayEventNames, listener: ArrayListener<T>) {
        if (eventName === "all" || ArrayEventTypes[eventName] !== undefined) {
            const argListeners = this.#eventListeners[eventName] ?? new Set();

            let argListener: ArrayArgListener<T> | undefined = undefined;
            for (const value of argListeners.values()) {
                if (value.listener === listener) {
                    argListener = value;
                    break;
                }
            }
            if (argListener === undefined) return;

            argListeners.delete(argListener);
            this.#eventListeners[eventName] = argListeners;
        } else throw new Error(`Error: ${eventName} is not an existing event`);
    }
    /**
     * This removes all listeners from an event.
     * @param eventName Name of event.
     */
    removeAllListeners(eventName: ArrayEventNames) {
        if (eventName === "all" || ArrayEventTypes[eventName] !== undefined) {
            const argListeners = this.#eventListeners[eventName] ?? new Set();
            argListeners.clear();
            this.#eventListeners[eventName] = argListeners;
        } else throw new Error(`Error: ${eventName} is not an existing event`);
    }
    /**
     * This returns the number of listeners inside an event.
     * @param eventName Name of event.
     * @returns number
     */
    listenerCount(eventName: ArrayEventNames): number {
        if (eventName === "all" || ArrayEventTypes[eventName] !== undefined) {
            const argListeners = this.#eventListeners[eventName] ?? new Set();
            return argListeners.size;
        } else throw new Error(`Error: ${eventName} is not an existing event`);
    }
    /**
     * This returns all the listeners inside an event.
     * @param eventName Name of event.
     * @returns Set<listeners>
     */
    getEventListeners(eventName: ArrayEventNames): Set<ArrayListener<T>> {
        if (eventName === "all" || ArrayEventTypes[eventName] !== undefined) {
            const argListeners = this.#eventListeners[eventName] ?? new Set();
            return new Set(
                [...argListeners].map((argListener) => argListener.listener)
            );
        } else throw new Error(`Error: ${eventName} is not an existing event`);
    }
    /**
     * Private function that emits an event.
     * @param eventName Name of event.
     * @param eventData Event data that is passed to the listeners.
     */
    #emit(eventName: ArrayEventNames, eventData: ArrayEventData<T>) {
        if (eventName === "all" || ArrayEventTypes[eventName] !== undefined) {
            const argListeners = this.#eventListeners[eventName] ?? new Set();
            for (const argListener of argListeners) {
                try {
                    argListener.listener(eventData, ...argListener.args);
                } catch (error) {
                    throw new Error(error as any);
                }
            }
        } else throw new Error(`Error: ${eventName} is not an existing event`);
    }
    //#endregion Emitter Methods
}
/**
 * A class that adds more functionality to arrays.
 * @ref [Reference]()
 * @see {@link AdvancedArray}
 */
export class AdvancedArray<T> extends Array<T> {
    constructor(...items: T[]) {
        super(...items);
    }

    /**
     * This changes an item within the array to another item.
     * @param item Item to find and change.
     * @param to The replacement.
     */
    replace(item: T, to: T) {
        if (this.length > 0) {
            const index = this.indexOf(item);
            this[index] = to;
            return index;
        } else return 0;
    }

    /**
     * This changes an item at a specific index to another item.
     * @param index Index of the item find and change.
     * @param to The replacement.
     */
    replaceAt(index: number, to: T) {
        if (this.length > 0) {
            this[index] = to;
            return index;
        } else return 0;
    }

    /**
     * This adds an item to the array
     * @unrequired index
     * @param item The item to add to the array.
     * @param index Index to add item at.
     * @returns The item you added. Incase you need it.
     */
    add(item: T, index?: number) {
        if (typeof index === "number") this.splice(index, 0, item);
        else this.push(item);
        return item;
    }

    /**
     * This adds an item to the array
     * @unrequired index
     * @param items The item to add to the array.
     * @param index Index to add item at.
     * @returns The item you added. Incase you need it.
     */
    addRange(items: T[], index?: number) {
        if (typeof index === "number") {
            let tempIndex = index;
            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                this.splice(tempIndex, 0, item);
                tempIndex++;
            }
        } else {
            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                this.push(item);
            }
        }
        return items;
    }

    /**
     * Removes item from array.
     * @param item Item to remove.
     */
    remove(item: T) {
        const index = this.indexOf(item);
        this.removeAt(index);
    }

    /**
     * Removes item at a specific index from array.
     * @param index Index to remove at.
     */
    removeAt(index: number) {
        if (this.length > 0) if (index > -1) this.splice(index, 1);
    }

    /**
     * Removes a range of elements.
     * @param start the starting index.
     * @param amount amount to remove.
     */
    removeRange(start: number, amount: number) {
        if (this.length > 0) this.splice(start, amount);
    }

    /**
     * This moves an item in this array to another position in the array.
     * @param item Item to find and move.
     * @param to what index to move to.
     */
    move(item: T, to: number) {
        const index = this.indexOf(item);
        return this.moveAt(index, to);
    }
    /**
     * This moves an item in this array to another position in the array.
     * @param index Index of item to find and move.
     * @param to what index to move to.
     */
    moveAt(index: number, to: number) {
        if (this.length > 0) {
            index = Mathf.Clamp(index, 0, this.length - 1);
            to = Mathf.Clamp(to, 0, this.length - 1);
            this.splice(to, 0, this.splice(index, 1)[0]);
        }
        return this;
    }

    /**
     * This swaps two items in this array.
     * @param item_1 First item to swap.
     * @param item_2 Second item to swap.
     */
    swap(item_1: T, item_2: T) {
        const index_1 = this.indexOf(item_1),
            index_2 = this.indexOf(item_2);
        return this.swapAt(index_1, index_2);
    }
    /**
     * This swaps two items in this array.
     * @param index_1 First index of an item to swap.
     * @param index_2 Second index of an item to swap.
     */
    swapAt(index_1: number, index_2: number) {
        if (this.length > 0) {
            index_1 = Mathf.Clamp(index_1, 0, this.length - 1);
            index_2 = Mathf.Clamp(index_2, 0, this.length - 1);
            this[index_1] = this.splice(index_2, 1, this[index_1])[0];
        }
        return this;
    }

    /**
     * This clears the array
     */
    clear() {
        if (this.length > 0) this.splice(0, this.length);
    }
}
//#endregion Main
