//#region Main

import { start, update } from "../scripts/application.js";
import App from "../utils/app.js";
import { appEventEmitter, event, Events } from "../utils/index.js";

export default event(Events.ClientReady, async ({ log }, client) => {
    if (!client.user) throw new Error("Bot not found");
    log(`Logged in as ${client.user.username}!`);
    appEventEmitter.addlistener("start", start);
    appEventEmitter.addlistener("update", update);
    App.actualstart();
});

//#endregion
