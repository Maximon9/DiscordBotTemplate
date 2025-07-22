import { category } from "../../utils/command";
import ping from "./ping";

const commands = [ping];
const extra = {
    description: `Debug contains ${commands.length} commands to debug with`,
    emoji: "🐞",
};

export default category("Debug", commands, extra);
