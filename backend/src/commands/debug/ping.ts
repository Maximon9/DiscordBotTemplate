import { SlashCommandBuilder } from "discord.js";
import { Command } from "../../utils/command";

//#region Main
const commandName = "ping" as const,
    meta = new SlashCommandBuilder()
        .setName(commandName)
        .setDescription("Ping the bot for a response.")
        .addStringOption((option) =>
            option
                .setName("message")
                .setDescription("Provide the bot a message to respond with.")
                .setMinLength(1)
                .setMaxLength(2000)
                .setRequired(false)
        );

export default new Command(commandName, meta, ({ interaction }) => {
    const message = interaction.options.getString("message");

    return interaction.reply({
        ephemeral: true,
        content: message ?? "Pong! 🏓",
    });
});
//#endregion Main
