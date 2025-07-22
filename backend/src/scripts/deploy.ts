import {commands} from "../commands/index.js";
import keys from "../keys/index.js";
import {REST, Routes} from "discord.js";
import type {APIUser} from "discord.js";

const body = commands.map(({meta}) => meta).flat(),
    rest = new REST({version: "10"}).setToken(keys.clientToken);

async function main() {
    const currentUser = (await rest.get(Routes.user())) as APIUser;

    const endpoint =
        keys.node_ENV === "production"
            ? Routes.applicationCommands(currentUser.id)
            : Routes.applicationGuildCommands(currentUser.id, keys.testGuild);

    await rest.put(endpoint, {body});

    return currentUser;
}

main()
    .then((user) => {
        const tag = `${user.username}#${user.discriminator}`;
        const response =
            keys.node_ENV === "production"
                ? `Successfully registered commands in production as ${tag}`
                : `Successfully registered commands for development in ${keys.testGuild} as ${tag}`;
        console.log(response);
    })
    .catch(console.error);
