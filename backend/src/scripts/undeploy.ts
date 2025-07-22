import keys from "../keys/index.js";
import {REST, Routes} from "discord.js";
import type {APIUser} from "discord.js";
// import commands from "../commands/index.js";

const rest = new REST({version: "10"}).setToken(keys.clientToken);

async function main() {
    const currentUser = (await rest.get(Routes.user())) as APIUser;

    console.log(currentUser.id);

    const endpoint =
        keys.node_ENV === "production"
            ? Routes.applicationCommands(currentUser.id)
            : Routes.applicationGuildCommands(currentUser.id, keys.testGuild);

    await rest.put(endpoint, {body: {}});

    return currentUser;
}

main()
    .then((user) => {
        const tag = `${user.username}#${user.discriminator}`;
        const response =
            keys.node_ENV === "production"
                ? `Successfully unregistered commands in production as ${tag}`
                : `Successfully unregistered commands for development in ${keys.testGuild} as ${tag}`;

        console.log(response);
    })
    .catch(console.error);
