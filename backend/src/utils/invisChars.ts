import type {PermutationInfo, PermutationInfoObj} from "../types/invisChars.js";

//#region Main
function ParsePermutationInfoAsObj(info: PermutationInfo): PermutationInfoObj {
    let chars: string[],
        obj: PermutationInfoObj = {chars: []};
    const possibleLimit = info[info.length - 1];
    if (typeof possibleLimit === "number") {
        obj.limit = possibleLimit < 0 ? 0 : possibleLimit;
        info.pop();
        chars = info as string[];
    }
    else chars = info as string[];
    obj.chars = chars;
    return obj;
}

export function GenerateAllPermutations(...info: PermutationInfo): string[] {
    const {chars, limit} = ParsePermutationInfoAsObj(info);
    let results: string[] = [];
    if (limit === 0) return results;
    if (chars.length === 0) return results;
    if (chars.length === 1) return [...chars];
    for (let i = 0; i < chars.length; i++) {
        const char = chars[i];
        switch (true) {
            case limit !== undefined:
                if (results.length >= limit) return results;
                results.push(char);
                break;
            default:
                results.push(char);
                break;
        }
    }
    if (chars.length === 2) {
        switch (true) {
            case limit !== undefined:
                return results.concat(GeneratePermutation(...chars, limit));
            default:
                return results.concat(GeneratePermutation(...chars));
        }
    }

    for (let counter = 2; counter <= chars.length; counter++) {
        switch (true) {
            case counter === chars.length:
                switch (true) {
                    case limit !== undefined:
                        return results.concat(GeneratePermutation(...chars, limit - results.length));
                    default:
                        return results.concat(GeneratePermutation(...chars));
                }
            default:
                for (let i = 0; i < chars.length; i++) {
                    const newChars: string[] = [];
                    charLoop: for (let i1 = i; i1 < chars.length; i1++) {
                        const char = chars[i1];
                        switch (true) {
                            case newChars.length < counter:
                                newChars.push(char);
                                if (i1 >= chars.length - 1 && newChars.length < counter) i1 = -1;
                                break;
                            default:
                                break charLoop;
                        }
                    }
                    switch (true) {
                        case limit !== undefined:
                            if (limit - results.length <= 0) return results;
                            results = results.concat(GeneratePermutation(...newChars, limit - results.length));
                            break;
                        default:
                            results = results.concat(GeneratePermutation(...newChars));
                            break;
                    }
                }
                break;
        }
    }
    return results;
}

export function GeneratePermutation(...info: PermutationInfo): string[] {
    const {chars, limit} = ParsePermutationInfoAsObj(info);
    let results: string[] = [];
    if (limit === 0) return results;
    if (chars.length === 0) return results;
    if (chars.length === 1) return [...chars];

    for (let i = 0; i < chars.length; i++) {
        const char = chars[i];

        const newChars = chars.slice(0, i).concat(chars.slice(i + 1));
        const swappedPermutation = GeneratePermutation(...newChars);

        for (let j = 0; j < swappedPermutation.length; j++) {
            const finalSwappedPermutation = [char].concat(swappedPermutation[j]);

            switch (true) {
                case limit !== undefined:
                    if (results.length >= limit) return results;
                    results.push(finalSwappedPermutation.join(""));
                    break;
                default:
                    results.push(finalSwappedPermutation.join(""));
                    break;
            }
        }
    }

    return results;
}

export function GenerateInvisChars(...customChars: (string | number)[]): Map<string, string> {
    let limit = 129;
    const customs: (string | number)[] = [];
    for (let i = 0; i < customChars.length; i++) {
        const possibleChar = customChars[i];
        if (typeof possibleChar === "string") {
            if (possibleChar.length > 1) {
                for (let i = 0; i < possibleChar.length; i++) {
                    const char = possibleChar[i];
                    if (char.charCodeAt(0) > limit) customs.push(char);
                }
            }
            else if (possibleChar.charCodeAt(0) > limit) customs.push(possibleChar);
        }
        else if (possibleChar > limit) customs.push(possibleChar);
    }
    limit += customs.length;
    const permutations = GenerateAllPermutations(
            "\u034f",
            "\ufeff",
            "\u2060",
            "\u2061",
            "\u2062",
            "\u2063",
            "\u2064",
            "\u206a",
            "\u206b",
            "\u206c",
            "\u206d",
            "\u206e",
            "\u206f",
            "\u200b",
            "\u200c",
            "\u200e",
            "\u200f",
            "\u17b4",
            "\u17b5",
            "\u00ad",
            "\u061c",
            "\u180e",
            "\u{1d173}",
            "\u{1d174}",
            "\u{1d175}",
            "\u{1d176}",
            "\u{1d177}",
            "\u{1d178}",
            "\u{1d179}",
            "\u{1d17a}",
            limit
        ),
        InvisChars = new Map<string, string>();
    let i = 0;
    for (i; i < 129; i++) {
        const key = permutations[i],
            value = String.fromCharCode(i);
        InvisChars.set(key, value);
    }
    for (let i1 = 0; i1 < customs.length; i1++) {
        const key = permutations[i];
        let value = customs[i1];
        if (typeof value === "string") InvisChars.set(key, value);
        else InvisChars.set(key, String.fromCharCode(value));
        i++;
    }
    return InvisChars;
}

export const InvisChars = GenerateInvisChars(
    "ⓤ",
    "ú",
    "ã",
    "Ğ",
    "☂",
    "ț",
    "♏",
    "@",
    "å",
    "ℛ",
    "ü",
    "Ř",
    "P̃",
    "Ç",
    "Š",
    "M̃",
    "Ÿ",
    "à",
    "á",
    "𝒶",
    "𝓇",
    "Ć",
    "ä",
    "ø",
    "œ",
    "Å",
    "¢",
    "╙",
    "╚",
    "▼"
);
//#region Parsers
function findKey(map: Map<any, any>, fn: (value: any, key: any, map: Map<any, any>) => boolean) {
    if (typeof fn !== "function") throw new TypeError(`${fn} is not a function`);
    for (const [key, val] of map) {
        if (fn(val, key, map)) return key;
    }
    return void 0;
}

export function parseInvisSting(string: string) {
    const chars = string.split("");
    for (let i = 0; i < chars.length; i++) {
        const char = chars[i];
        chars[i] = findKey(InvisChars, (value) => value === char) ?? "";
    }
    const invisString = chars.join("\u200d");
    if (invisString === "") return "";
    else return `\u200d${invisString}\u200d`;
}

export function parseSting(string: string) {
    const chars = string.split("\u200d");
    for (let i = 0; i < chars.length; i++) {
        const char = chars[i];
        chars[i] = InvisChars.get(char) ?? "";
    }
    return chars.join("");
}
//#endregion Parsers

//#endregion Main
