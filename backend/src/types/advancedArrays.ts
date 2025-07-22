import type {AdvancedArray} from "../utils/advancedArrays.js";

//#region Main
export enum ArrayEventTypes {
    moved = 0,
    removed = 1,
    added = 2,
    changed = 3,
    clear = 4,
}
export type ArrayEventNames = keyof typeof ArrayEventTypes | "all";
export type ArrayEventData<T> = {
    eventType: keyof typeof ArrayEventTypes;
    array: AdvancedArray<T>;
    item?: T;
    item1?: T;
    item2?: T;
    items?: T[];
    from?: T | T[] | number;
    to?: T | T[] | number;
    index?: number;
    indices?: number[];
    changeType?: "copyWithIn" | "fill" | "replace";
    moveType?: "one" | "swap" | "reversed" | "sorted";
    addType?: "unshift" | "push" | "at" | "range";
    removeType?: "shift" | "pop" | "at" | "item" | "range";
};
export type ArrayArgListener<T> = {listener: ArrayListener<T>; args: any[]};
export type ArrayListener<T> = (event: ArrayEventData<T>, ...args: any[]) => any;

//#endregion Main
