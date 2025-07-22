import {ActionRowBuilder, ButtonBuilder, ButtonStyle} from "discord.js";
import {CustomID} from "./ids.js";

//#region Main
export function GetADismissButton(): ActionRowBuilder<ButtonBuilder> {
    const dismissId = new CustomID("dismiss").id;
    const dismissButton = new ButtonBuilder()
        .setCustomId(dismissId)
        .setLabel("dismiss")
        .setStyle(ButtonStyle.Secondary);
    return new ActionRowBuilder<ButtonBuilder>().setComponents(dismissButton);
}
export function CreateConfirmationButtons(
    confirmId: string,
    cancelId: string,
    confirmLabel = "Yes",
    cancelLabel = "No"
): ActionRowBuilder<ButtonBuilder> {
    const yesButton = new ButtonBuilder()
        .setCustomId(confirmId)
        .setLabel(confirmLabel)
        .setStyle(ButtonStyle.Success);
    const noButton = new ButtonBuilder()
        .setCustomId(cancelId)
        .setLabel(cancelLabel)
        .setStyle(ButtonStyle.Danger);
    return new ActionRowBuilder<ButtonBuilder>().setComponents(yesButton, noButton);
}
//#endregion
