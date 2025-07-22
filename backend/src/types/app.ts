//#region Main
export enum CollectionEventTypes {
    set = 0,
    delete = 1,
    clear = 2,
    get = 3,
}
export type CollectionEventNames = keyof typeof CollectionEventTypes | "all";
export type CollectionEventData<k, v> = {
    eventType: keyof typeof CollectionEventTypes;
    value?: [k, v];
};
export type CollectionArgListener<k, v> = {listener: CollectionListener<k, v>; args: any[]};
export type CollectionListener<k, v> = (event: CollectionEventData<k, v>, ...args: any[]) => any;

//#endregion Main
