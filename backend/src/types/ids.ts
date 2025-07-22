import type {VariableInfo} from "../utils/ids.js";

export type Arg<VarInfoModel extends string = string> = string | VariableInfo<string, VarInfoModel>;
