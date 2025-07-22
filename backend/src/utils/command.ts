import type {AutocompleteFocusedOption, AutocompleteInteraction, CacheType} from "discord.js";
import type {
    AutoCompleteFunc,
    CommandCategory,
    CommandCategoryExtra,
    CommandExec,
    CommandMeta,
} from "../types/index.js";

//#region Main
export class AutoComplete<choices extends string | number = string> {
    #emit = (async () => {}) as AutoCompleteFunc<choices>;
    constructor(autoCompleteFunc: AutoCompleteFunc<choices>) {
        this.#emit = autoCompleteFunc;
    }
    async Emit(
        interaction: AutocompleteInteraction<CacheType>,
        choices: choices[],
        focusedOption: AutocompleteFocusedOption
    ) {
        this.#emit(interaction, choices, focusedOption);
    }
}

export class Command<Name extends string = string, choices extends string | number = string> {
    name: Name;
    meta: CommandMeta;
    exec: CommandExec;
    autocomplete: AutoComplete<choices>;
    constructor(name: Name, meta: CommandMeta, exec: CommandExec, autocomplete?: AutoComplete<choices>) {
        this.name = name;
        this.meta = meta;
        this.exec = exec;
        if (autocomplete) this.autocomplete = autocomplete;
        else this.autocomplete = new AutoComplete(async () => {});
    }
}

export function category<Name extends string, choices extends string | number, CommandName extends string>(
    name: Name,
    commands: Command<CommandName, choices>[],
    extra: CommandCategoryExtra = {}
): CommandCategory<Name, CommandName, choices> {
    return {
        name,
        commands,
        ...extra,
    };
}
//#endregion Main
