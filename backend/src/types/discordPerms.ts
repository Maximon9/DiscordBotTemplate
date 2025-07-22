import type {PermissionFlags} from "discord.js";

export enum AuthorizerType {
    None = 0,
    Request = 1,
    Configure = 2,
}

//#region Main
export enum PermEventTypes {
    requests = 0,
    alterations = 1,
}
export type PermEventNames = keyof typeof PermEventTypes | "all";
export type AuthArgListener = {listener: AuthListener; args: any[]};
export type BlackListArgListener = {listener: BlackListListener; args: any[]};
export type AuthListener = (event: AuthEventData, ...args: any[]) => any;
export type BlackListListener = (event: BlackListEventData, ...args: any[]) => any;
export type AuthCategory = "Configurators" | "Requesters" | "Remove";
export type BlackListCategory = "Add" | "Remove";
export type PermGenre = "Users" | "Roles" | "Permissions";
type AllPermGenre =
    | "Users"
    | "Roles"
    | "Permissions"
    | "reset"
    | "clear"
    | "clearRequests"
    | "setRequests"
    | "requestsAccepted";
export type BlackListEventData = {
    eventType: keyof typeof PermEventTypes;
    genre: AllPermGenre;
    category?: BlackListCategory;
    added?: string | bigint | string[] | bigint[];
    included?: string | bigint | string[] | bigint[];
    removed?: string | bigint | string[] | bigint[];
    absent?: string | bigint | string[] | bigint[];
};
export type AuthEventData = {
    eventType: keyof typeof PermEventTypes;
    genre: AllPermGenre;
    category?: AuthCategory;
    added?: string | bigint | string[] | bigint[];
    included?: string | bigint | string[] | bigint[];
    removed?: string | bigint | string[] | bigint[];
    absent?: string | bigint | string[] | bigint[];
};
export type PermissionNames = keyof PermissionFlags;
