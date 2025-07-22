//#region Main

import type { CommandNames } from "../commands/index";
import { commandsMap } from "../commands/index";
import { EditReply, Events, event, Reply } from "../utils/index";
import { Colors } from "discord.js";
import App from "../utils/app";

const colorKeys = Object.keys(Colors) as (keyof typeof Colors)[];

export default event(
    Events.InteractionCreate,
    async ({ log, client }, interaction) => {
        if (!App.hasStarted) return;
        if (interaction.isChatInputCommand()) {
            try {
                const commandName = interaction.commandName as CommandNames;
                const command = commandsMap.get(commandName);

                if (!command) throw new Error("Command not found...");
                await command.exec({
                    client,
                    interaction,
                    log(...args) {
                        log(`[${command.meta.name}]`, ...args);
                    },
                });
            } catch (error) {
                log("[Command Error}", error);
                if (interaction.deferred)
                    return interaction.editReply(
                        EditReply.error("something went wrong :(")
                    );
                return interaction.reply(
                    Reply.interactionError("Something went wrong :)")
                );
            }
        }
    }
);

/* async function CheckDateTimeAndYear(interaction: ChatInputCommandInteraction<CacheType>, options: UserOptions) {
    if (options.user) {
        const oldUserInfo = userInfos.TryFindUserInfo(options.user.id);
        if (!Stringf.IsNullOrEmpty(options.date) && !Stringf.IsNullOrEmpty(options.timezone)) {
            if (dateExists(options.date) && timezonExists(options.timezone)) {
                const reply = await interaction.fetchReply();
                await idTimeouts.deleteReply(interaction, 10000, reply.id);
            }
            else {
                if (dateExists(options.date) && !timezonExists(options.timezone)) {
                    const reply = await interaction.fetchReply();
                    await idTimeouts.deleteReply(interaction, 10000, reply.id);
                }
                else if (!dateExists(options.date) && timezonExists(options.timezone)) {
                    const reply = await interaction.fetchReply();
                    await idTimeouts.deleteReply(interaction, 10000, reply.id);
                }
                else if (!dateExists(options.date) && !timezonExists(options.timezone)) {
                    const reply = await interaction.fetchReply();
                    await idTimeouts.deleteReply(interaction, 10000, reply.id);
                }
            }
        }
        else {
            if (!Stringf.IsNullOrEmpty(options.date) && Stringf.IsNullOrEmpty(options.timezone)) {
                if (oldUserInfo) {
                    if (!Stringf.IsNullOrEmpty(oldUserInfo.timezone)) {
                        if (dateExists(options.date) && timezonExists(oldUserInfo.timezone)) {
                            if (!Stringf.IsNullOrEmpty(options.year)) {
                                if (yearExists(options.year)) {
                                    const reply = await interaction.fetchReply();
                                    await idTimeouts.deleteReply(interaction, 10000, reply.id);
                                }
                                else {
                                    const reply = await interaction.fetchReply();
                                    await idTimeouts.deleteReply(interaction, 10000, reply.id);
                                }
                            }
                        }
                        else {
                            if (!dateExists(options.date)) {
                                if (!Stringf.IsNullOrEmpty(options.year)) {
                                    if (!yearExists(options.year)) {
                                        const reply = await interaction.fetchReply();
                                        await idTimeouts.deleteReply(interaction, 10000, reply.id);
                                    }
                                    else {
                                        const reply = await interaction.fetchReply();
                                        await idTimeouts.deleteReply(interaction, 10000, reply.id);
                                    }
                                }
                            }
                        }
                    }
                    else {
                        throw new Error("This shouldn't be possible, but somehow you have one over the other");
                    }
                }
            }
            else if (Stringf.IsNullOrEmpty(options.date) && !Stringf.IsNullOrEmpty(options.timezone)) {
                if (oldUserInfo) {
                    if (!Stringf.IsNullOrEmpty(oldUserInfo.date)) {
                        if (dateExists(oldUserInfo.date) && timezonExists(options.timezone)) {
                            if (!Stringf.IsNullOrEmpty(options.year)) {
                                if (yearExists(options.year)) {
                                    const reply = await interaction.fetchReply();
                                    await idTimeouts.deleteReply(interaction, 10000, reply.id);
                                }
                                else {
                                    const reply = await interaction.fetchReply();
                                    await idTimeouts.deleteReply(interaction, 10000, reply.id);
                                }
                            }
                        }
                        else {
                            if (!timezonExists(options.timezone)) {
                                if (!Stringf.IsNullOrEmpty(options.year)) {
                                    if (!yearExists(options.year)) {
                                        const reply = await interaction.fetchReply();
                                        await idTimeouts.deleteReply(interaction, 10000, reply.id);
                                    }
                                    else {
                                        const reply = await interaction.fetchReply();
                                        await idTimeouts.deleteReply(interaction, 10000, reply.id);
                                    }
                                }
                            }
                        }
                    }
                    else {
                        throw new Error("This shouldn't be possible, but somehow you have one over the other");
                    }
                }
            }
            else if (Stringf.IsNullOrEmpty(options.date) && Stringf.IsNullOrEmpty(options.timezone)) {
                if (oldUserInfo) {
                    if (!Stringf.IsNullOrEmpty(oldUserInfo.date) && !Stringf.IsNullOrEmpty(oldUserInfo.timezone)) {
                        if (dateExists(oldUserInfo.date) && timezonExists(oldUserInfo.timezone)) {
                            if (!Stringf.IsNullOrEmpty(options.year)) {
                                if (yearExists(options.year)) {
                                    const reply = await interaction.fetchReply();
                                    await idTimeouts.deleteReply(interaction, 10000, reply.id);
                                }
                                else {
                                    const reply = await interaction.fetchReply();
                                    await idTimeouts.deleteReply(interaction, 10000, reply.id);
                                }
                            }
                        }
                        else {
                            throw new Error("This shouldn't be possible, but either a date or timezone does not exist");
                        }
                    }
                    else {
                        throw new Error("This shouldn't be possible, but somehow you have one over the other");
                    }
                }
            }
        }
    }
} */

//#endregion
