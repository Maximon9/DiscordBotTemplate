import type {Arg} from "../types/ids.js";
import {Stringf} from "./string_util.js";

//#region main
export class CustomID<VarInfoModel extends string = string> {
    [index: number]: string;

    #length!: number;
    get length(): number {
        return this.#length;
    }

    get id(): string {
        this.#setID();
        return toString(this);
    }
    set id(value: string) {
        this.#length = value.length;
        SetClassString(this, value);
        this.#setArgs();
    }

    #args!: Arg<VarInfoModel>[];

    get args(): ReadonlyArray<Arg<VarInfoModel>> {
        return this.#args;
    }
    set args(value: Arg<VarInfoModel>[]) {
        this.#args = value;
        this.#setID();
    }
    get arg(): Arg<VarInfoModel> {
        return this.#args[0];
    }
    set arg(value: Arg<VarInfoModel>) {
        this.#args[0] = value;
        this.#setID();
    }

    constructor(...args: Arg<VarInfoModel>[]) {
        let allArgs: Arg<VarInfoModel>[] = [];
        if (args.length > 0) {
            for (let i = 0; i < args.length; i++) {
                const arg = args[i];
                if (typeof arg === "string") {
                    allArgs = allArgs.concat(CustomID.#ReadID(arg));
                }
                else allArgs.push(arg);
            }
        }
        this.#args = allArgs;
        this.#setID();
    }
    set(...args: Arg<VarInfoModel>[]): this {
        let allArgs: Arg<VarInfoModel>[] = [];
        if (args.length > 0) {
            for (let i = 0; i < args.length; i++) {
                const arg = args[i];
                if (typeof arg === "string") allArgs = allArgs.concat(CustomID.#ReadID<VarInfoModel>(arg));
                else allArgs.push(arg);
            }
        }
        this.#args = allArgs;
        return this.#setID();
    }

    at<T extends Arg<VarInfoModel>>(index: number): T {
        return this.#args[index] as T;
    }
    setAt(index: number, value: Arg<VarInfoModel>): this {
        this.#args[index] = value;
        return this.#setID();
    }

    TryFetchVarInfo<values extends string = string>(
        key: VarInfoModel,
        returnEmptyIfNull = true
    ): VariableInfo<values, VarInfoModel> {
        const variableInfos = this.#args.filter((arg) => typeof arg !== "string") as VariableInfo<
            values,
            VarInfoModel
        >[];
        const varInfo = variableInfos.find((varInfo) => varInfo.key === key);
        if (returnEmptyIfNull) return varInfo ?? new VariableInfo();
        else if (varInfo) return varInfo;
        else throw new Error("Missing args");
    }

    concat(...strings: string[]) {
        this.id = toString(this).concat(...strings);
    }
    add(...args: Arg<VarInfoModel>[]): this {
        if (args && args.length > 0) {
            for (let i = 0; i < args.length; i++) {
                const arg = args[i];
                if (typeof arg === "string") this.#args = this.#args.concat(CustomID.#ReadID(arg));
                else this.#args.push(arg);
            }
            return this.#setID();
        }
        else return this;
    }

    static #ReadID<VarInfoModel extends string = string>(id: string): [...args: Arg<VarInfoModel>[]] {
        const args: Arg<VarInfoModel>[] = id.split(";").map((stringArg) => {
            if (stringArg.includes(":")) return ReadVariable(stringArg);
            else return stringArg;
        });
        if (args.length > 0) return [...args];
        else return [id];
    }

    #setID(): this {
        const realArgs = this.#args.map((arg) => {
            if (typeof arg === "string") return arg;
            else return arg.fullVar;
        });

        let newId = "";
        if (!Stringf.isNullOrEmpty(realArgs[0])) newId = realArgs[0];
        if (realArgs.length > 1) newId = realArgs.join(";");

        this.#length = newId.length;
        return SetClassString<this>(this, newId);
    }
    #setArgs(): this {
        this.#args = CustomID.#ReadID(toString(this));
        return this;
    }
}
export class VariableInfo<values extends string = string, VarInfoModel extends string = string> {
    [k: number]: values;

    #length: number = 0;
    get length(): number {
        return this.#length;
    }

    get fullVar(): string {
        this.#setFullVar();
        return toString(this);
    }
    set fullVar(value: string) {
        this.#length = value.length;
        SetClassString(this, value);
        this.#setKeyAndValues();
    }

    #key: string = "";
    get key(): string {
        return this.#key;
    }
    set key(value: string) {
        this.#key = value;
        this.#setFullVar();
    }

    #values: values[] = [];

    get values(): ReadonlyArray<string> {
        return this.#values;
    }
    set values(value: values[]) {
        this.#values = value;
        this.#setFullVar();
    }
    get value(): values {
        return this.#values[0];
    }
    set value(value: values) {
        this.#values[0] = value;
        this.#setFullVar();
    }

    constructor(key?: VarInfoModel, ...values: values[]) {
        if (!Stringf.isNullOrEmpty(key) && values.length > 0) {
            this.#key = key;
            this.#values = values;
            this.#setFullVar();
        }
    }

    setAt(index: number, value: values) {
        this.#values[index] = value;
        this.#setFullVar();
    }

    #setFullVar() {
        let fullVar = "";
        if (!Stringf.isNullOrEmpty(this.#key) && !Stringf.isNullOrEmpty(this.#values[0]))
            fullVar = `${this.#key}:${this.#values[0]}`;
        if (this.#values.length > 1) fullVar = `${this.key}:${this.#values.join(",")}`;

        this.#length = fullVar.length;
        return SetClassString(this, fullVar);
    }
    #setKeyAndValues() {
        const newVarInfo = ReadVariable<values>(toString(this));
        if (!Stringf.isNullOrEmpty(newVarInfo.key) && newVarInfo.values.length > 0) {
            this.#key = newVarInfo.#key;
            this.#values = newVarInfo.#values;
        }
        return this;
    }
}

function SetClassString<T extends CustomID | VariableInfo>(_Class: CustomID | VariableInfo, value: string): T {
    for (const key in _Class) if (/[0-9]+/g.test(key)) delete _Class[key];
    for (let i = 0; i < value.length; i++) _Class[i] = value[i];
    return _Class as T;
}
function ReadVariable<values extends string = string>(variable: string): VariableInfo<values> {
    const varDeclaration = variable.split(":");
    if (varDeclaration.length === 2) {
        const [key, value] = varDeclaration,
            stringValues = value.split(",");
        if (stringValues.length > 0) return new VariableInfo<values>(key, ...(stringValues as values[]));
        else return new VariableInfo<values>(key, value as values);
    }
    else return new VariableInfo<values>();
}
function toString(_Class: CustomID | VariableInfo): string {
    let string = "";
    for (let i = 0; i < _Class.length; i++) string += _Class[i];
    return string;
}
//#endregion
