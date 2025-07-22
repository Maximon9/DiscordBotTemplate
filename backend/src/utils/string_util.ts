export class Stringf {
    static isNullOrEmpty(value: string | null | undefined): value is null | undefined {
        if (typeof value === "string" && value !== "") {
            value;
            return false;
        }
        else return true;
    }
    static TryFindStringInArray(stringArray: string[], stringToFind: string | null): stringToFind is string {
        if (Stringf.isNullOrEmpty(stringToFind)) return false;
        else {
            const stringFound = stringArray.find((string) => string === stringToFind) ?? null;
            if (stringFound) return true;
            else return false;
        }
    }
}
