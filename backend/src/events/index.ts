//#region Main

import type { Event } from "../types/index";
import interactionCreate from "./interactionCreate";
import ready from "./ready";

const events = [interactionCreate, ready] as Event[];

export default events;

//#endregion
