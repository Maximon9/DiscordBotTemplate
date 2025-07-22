//#region Main

import type { Event } from "../types/index.js";
import interactionCreate from "./interactionCreate.js";
import ready from "./ready.js";

const events = [interactionCreate, ready] as Event[];

export default events;

//#endregion
